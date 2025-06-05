import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertUploadSchema, insertProcessSchema } from "@shared/schema";
import sharp from "sharp";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'audio/wav', 'audio/mp3'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  }, express.static(uploadDir));

  // Initialize Socket.IO for real-time communication
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Real-time video streaming and deepfake processing
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('join-room', async (roomId: string, userId: string) => {
      socket.join(roomId);
      
      // Create or update video session
      const existingSession = await storage.getVideoSessionBySessionId(roomId);
      if (!existingSession) {
        await storage.createVideoSession({
          sessionId: roomId,
          userId: userId,
          status: "active"
        });
      }
      
      socket.to(roomId).emit('user-connected', userId);
      console.log(`User ${userId} joined room ${roomId}`);
    });

    socket.on('offer', (offer, roomId) => {
      socket.to(roomId).emit('offer', offer);
    });

    socket.on('answer', (answer, roomId) => {
      socket.to(roomId).emit('answer', answer);
    });

    socket.on('ice-candidate', (candidate, roomId) => {
      socket.to(roomId).emit('ice-candidate', candidate);
    });

    socket.on('video-frame', async (data) => {
      // Process video frame for deepfake transformation
      const { frameData, sessionId, faceModelId, voiceSettings } = data;
      
      try {
        // Apply deepfake transformation
        const processedFrame = await processVideoFrame(frameData, faceModelId, voiceSettings);
        socket.emit('processed-frame', processedFrame);
      } catch (error) {
        console.error('Frame processing error:', error);
        socket.emit('processing-error', { error: 'Frame processing failed' });
      }
    });

    socket.on('face-model-changed', (data) => {
      const { roomId, faceModelId } = data;
      socket.to(roomId).emit('face-model-update', { faceModelId });
    });

    socket.on('voice-model-changed', (data) => {
      const { roomId, voiceModelId } = data;
      socket.to(roomId).emit('voice-model-update', { voiceModelId });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Upload endpoint for images and audio
  app.post("/api/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const uploadData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      };

      const validatedData = insertUploadSchema.parse(uploadData);
      const upload = await storage.createUpload(validatedData);
      
      res.json(upload);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get all uploads
  app.get("/api/uploads", async (req, res) => {
    try {
      const uploads = await storage.getAllUploads();
      res.json(uploads);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Face models endpoints
  app.get("/api/face-models", async (req, res) => {
    try {
      const faceModels = await storage.getAllFaceModels();
      res.json(faceModels);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/face-models/public", async (req, res) => {
    try {
      const publicModels = await storage.getPublicFaceModels();
      res.json(publicModels);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/face-models", async (req, res) => {
    try {
      const { name, uploadId, isPublic, category } = req.body;
      const faceModel = await storage.createFaceModel({
        name,
        uploadId: parseInt(uploadId),
        isPublic: Boolean(isPublic),
        category: category || "user"
      });
      res.json(faceModel);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Voice models endpoints
  app.get("/api/voice-models", async (req, res) => {
    try {
      const voiceModels = await storage.getAllVoiceModels();
      res.json(voiceModels);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/voice-models/public", async (req, res) => {
    try {
      const publicModels = await storage.getPublicVoiceModels();
      res.json(publicModels);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/voice-models", async (req, res) => {
    try {
      const { name, uploadId, isPublic, category, language } = req.body;
      const voiceModel = await storage.createVoiceModel({
        name,
        uploadId: parseInt(uploadId),
        isPublic: Boolean(isPublic),
        category: category || "user",
        language: language || "fr"
      });
      res.json(voiceModel);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Video session endpoints
  app.post("/api/video-sessions", async (req, res) => {
    try {
      const { sessionId, userId, faceModelId, voiceModelId } = req.body;
      const session = await storage.createVideoSession({
        sessionId,
        userId,
        faceModelId: faceModelId ? parseInt(faceModelId) : null,
        voiceModelId: voiceModelId ? parseInt(voiceModelId) : null
      });
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/video-sessions/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getVideoSessionBySessionId(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Real-time deepfake processing endpoint
  app.post("/api/process-frame", async (req, res) => {
    try {
      const { frameData, faceModelId, voiceSettings } = req.body;
      const processedFrame = await processVideoFrame(frameData, faceModelId, voiceSettings);
      res.json({ processedFrame });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // WhatsApp Integration endpoints
  app.post("/api/whatsapp/connect", async (req, res) => {
    try {
      const { method, phoneNumber, deepfakeEnabled } = req.body;
      
      if (method === "phone" && !phoneNumber) {
        return res.status(400).json({ message: "Numéro de téléphone requis" });
      }

      // Vérifier que les clés API sont configurées
      const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
      const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
      const businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;

      if (!accessToken || !phoneNumberId || !businessAccountId) {
        return res.status(500).json({ 
          message: "Clés API WhatsApp Business non configurées. Veuillez ajouter WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID et WHATSAPP_BUSINESS_ACCOUNT_ID dans les Secrets." 
        });
      }

      if (method === "phone") {
        // Vérifier le numéro avec l'API WhatsApp Business
        try {
          const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });

          const phoneData = await response.json();
          
          if (!response.ok) {
            throw new Error(phoneData.error?.message || 'Erreur API WhatsApp');
          }

          const sessionResponse = {
            sessionId: `whatsapp_${Date.now()}`,
            phoneNumber: phoneData.display_phone_number || phoneNumber,
            connected: true,
            deepfakeEnabled,
            businessAccountId,
            phoneNumberId,
            message: "Connexion WhatsApp Business réussie"
          };

          res.json(sessionResponse);
        } catch (apiError: any) {
          res.status(400).json({ 
            message: `Erreur de connexion WhatsApp: ${apiError.message}` 
          });
        }
      } else if (method === "qr") {
        // Pour le QR code, générer un token de session temporaire
        const qrResponse = {
          sessionId: `whatsapp_qr_${Date.now()}`,
          connected: false,
          deepfakeEnabled,
          qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=whatsapp://send?phone=${phoneNumberId}`,
          message: "Code QR généré - Scannez avec WhatsApp"
        };

        res.json(qrResponse);
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/whatsapp/start-call", async (req, res) => {
    try {
      const { sessionId, contactNumber, faceModelId, voiceModelId, deepfakeSettings } = req.body;
      
      if (!sessionId || !contactNumber) {
        return res.status(400).json({ message: "Session ID et numéro de contact requis" });
      }

      const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
      const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

      if (!accessToken || !phoneNumberId) {
        return res.status(500).json({ 
          message: "Clés API WhatsApp Business non configurées" 
        });
      }

      // Initier un appel vidéo via l'API WhatsApp Business
      try {
        const whatsappResponse = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: contactNumber.replace('+', ''),
            type: "template",
            template: {
              name: "video_call_invite",
              language: {
                code: "fr"
              },
              components: [{
                type: "body",
                parameters: [{
                  type: "text",
                  text: "Appel vidéo avec fonctionnalités deepfake"
                }]
              }]
            }
          })
        });

        const whatsappData = await whatsappResponse.json();

        if (!whatsappResponse.ok) {
          throw new Error(whatsappData.error?.message || 'Erreur API WhatsApp');
        }

        const callResponse = {
          callId: `call_${Date.now()}`,
          whatsappMessageId: whatsappData.messages[0]?.id,
          status: "initiated",
          contactNumber,
          deepfakeActive: deepfakeSettings?.enabled || false,
          faceModelId,
          voiceModelId,
          message: "Invitation d'appel WhatsApp envoyée avec succès"
        };

        // Notify via socket for real-time updates
        io.emit('whatsapp-call-started', callResponse);

        res.json(callResponse);
      } catch (apiError: any) {
        res.status(400).json({ 
          message: `Erreur lors de l'appel WhatsApp: ${apiError.message}` 
        });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/whatsapp/status/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      const statusResponse = {
        sessionId,
        connected: true,
        lastActivity: new Date(),
        activeCalls: 0,
        deepfakeSupported: true
      };

      res.json(statusResponse);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create a face swap process
  app.post("/api/process", async (req, res) => {
    try {
      const { sourceImageId, targetImageId, options } = req.body;
      
      const processData = {
        sourceImageId: parseInt(sourceImageId),
        targetImageId: targetImageId ? parseInt(targetImageId) : null,
        status: "pending",
        options: JSON.stringify(options || {}),
      };

      const validatedData = insertProcessSchema.parse(processData);
      const process = await storage.createProcess(validatedData);

      // Start background processing
      processDeepfake(process.id);
      
      res.json(process);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  return httpServer;
}

// Real-time video frame processing for deepfake transformation
async function processVideoFrame(frameData: string, faceModelId?: number, voiceSettings?: any): Promise<string> {
  try {
    if (!frameData) {
      throw new Error('No frame data provided');
    }

    // Simulate processing delay for real-time (~60fps processing)
    await new Promise(resolve => setTimeout(resolve, 16));
    
    let processedFrame = frameData;
    
    if (faceModelId) {
      const faceModel = await storage.getFaceModel(faceModelId);
      if (faceModel) {
        processedFrame = await applyFaceSwap(frameData, faceModel);
      }
    }

    if (voiceSettings) {
      processedFrame = addVoiceMetadata(processedFrame, voiceSettings);
    }

    return processedFrame;
  } catch (error) {
    console.error('Video frame processing error:', error);
    throw error;
  }
}

// Simulate advanced face swap with lighting adaptation
async function applyFaceSwap(frameData: string, faceModel: any): Promise<string> {
  // Real implementation would use:
  // - MediaPipe Face Mesh for precise facial landmark detection
  // - TensorFlow.js deepfake models for face generation
  // - Real-time lighting and expression matching
  // - GPU-accelerated processing for 60fps performance
  
  return frameData;
}

// Add voice processing metadata
function addVoiceMetadata(frameData: string, voiceSettings: any): string {
  // Voice transformation handled in separate audio pipeline
  return frameData;
}

// Background processing function
async function processDeepfake(processId: number) {
  try {
    await storage.updateProcessStatus(processId, "processing");
    
    const process = await storage.getProcess(processId);
    if (!process) return;

    const sourceUpload = await storage.getUpload(process.sourceImageId);
    if (!sourceUpload) return;

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    // Create processed image with watermark
    const outputPath = path.join(uploadDir, `processed_${Date.now()}.jpg`);
    
    await sharp(sourceUpload.path)
      .composite([{
        input: Buffer.from(`
          <svg width="300" height="50">
            <rect width="100%" height="100%" fill="rgba(0,0,0,0.7)"/>
            <text x="10" y="30" font-family="Arial" font-size="14" fill="white">
              ÉDUCATIF - DÉMONSTRATION
            </text>
          </svg>
        `),
        top: 10,
        left: 10,
      }])
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    await storage.updateProcessStatus(processId, "completed", outputPath);
  } catch (error) {
    console.error("Processing error:", error);
    await storage.updateProcessStatus(processId, "failed");
  }
}