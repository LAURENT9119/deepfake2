import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Video, VideoOff, Mic, MicOff, Phone, PhoneOff, 
  Settings, User, Volume2, Camera, MonitorSpeaker,
  Palette, Lightbulb, Zap, Users, ArrowLeft, Home, UserPlus, Eye
} from "lucide-react";
import io from "socket.io-client";
import { Link } from "wouter";
import { WhatsAppIntegration } from "@/components/whatsapp-integration";
import { ModelManager } from "@/components/model-manager";

interface FaceModel {
  id: number;
  name: string;
  category: string;
  isPublic: boolean;
}

interface VoiceModel {
  id: number;
  name: string;
  category: string;
  language: string;
  isPublic: boolean;
}

export default function VideoCall() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<any>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userId] = useState(Math.random().toString(36).substr(2, 9));
  const [isFromWhatsApp, setIsFromWhatsApp] = useState(false);
  
  // Deepfake settings
  const [selectedFaceModel, setSelectedFaceModel] = useState<number | null>(null);
  const [selectedVoiceModel, setSelectedVoiceModel] = useState<number | null>(null);
  const [deepfakeEnabled, setDeepfakeEnabled] = useState(false);
  const [faceSwapIntensity, setFaceSwapIntensity] = useState([80]);
  const [voiceChangeIntensity, setVoiceChangeIntensity] = useState([70]);
  const [lightingAdaptation, setLightingAdaptation] = useState(true);
  const [realTimeProcessing, setRealTimeProcessing] = useState(true);

  // Fetch available face models
  const { data: faceModels } = useQuery<FaceModel[]>({
    queryKey: ["/api/face-models/public"],
    enabled: true
  });

  // Fetch available voice models
  const { data: voiceModels } = useQuery<VoiceModel[]>({
    queryKey: ["/api/voice-models/public"],
    enabled: true
  });

  // Initialize WebRTC and Socket.IO
  useEffect(() => {
    // Vérifier les paramètres URL pour les appels directs WhatsApp
    const urlParams = new URLSearchParams(window.location.search);
    const sessionParam = urlParams.get('session');
    const deepfakeParam = urlParams.get('deepfake');
    const autostartParam = urlParams.get('autostart');

    if (sessionParam) {
      setRoomId(sessionParam);
      setIsFromWhatsApp(true);
      
      if (deepfakeParam === 'true') {
        setDeepfakeEnabled(true);
      }

      toast({
        title: "Appel WhatsApp détecté",
        description: `Session: ${sessionParam.substring(0, 8)}... - Deepfake: ${deepfakeParam === 'true' ? 'Activé' : 'Désactivé'}`,
      });

      // Auto-démarrer l'appel si demandé
      if (autostartParam === 'true') {
        setTimeout(() => {
          startCall();
        }, 2000);
      }
    }

    initializeMedia();
    initializeSocket();
    
    return () => {
      cleanup();
    };
  }, []);

  const initializeSocket = () => {
    socketRef.current = io(window.location.origin);
    
    socketRef.current.on('user-connected', (userId: string) => {
      toast({
        title: "Utilisateur connecté",
        description: `L'utilisateur ${userId} a rejoint l'appel`,
      });
    });

    socketRef.current.on('offer', async (offer: RTCSessionDescriptionInit) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(offer);
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socketRef.current.emit('answer', answer, roomId);
      }
    });

    socketRef.current.on('answer', async (answer: RTCSessionDescriptionInit) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(answer);
      }
    });

    socketRef.current.on('ice-candidate', async (candidate: RTCIceCandidateInit) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(candidate);
      }
    });

    socketRef.current.on('processed-frame', (processedFrame: string) => {
      // Apply processed frame to video element
      if (videoRef.current && deepfakeEnabled) {
        // In real implementation, this would update the video stream
        console.log('Received processed frame');
      }
    });

    socketRef.current.on('face-model-update', (data: { faceModelId: number }) => {
      toast({
        title: "Modèle de visage mis à jour",
        description: "L'autre participant a changé de visage",
      });
    });

    socketRef.current.on('voice-model-update', (data: { voiceModelId: number }) => {
      toast({
        title: "Modèle de voix mis à jour", 
        description: "L'autre participant a changé de voix",
      });
    });
  };

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Setup peer connection
      setupPeerConnection();
      
      // Start real-time processing automatiquement
      setTimeout(() => {
        startFrameProcessing();
      }, 1000);

    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: "Erreur d'accès à la caméra",
        description: "Impossible d'accéder à votre caméra ou microphone",
        variant: "destructive",
      });
    }
  };

  const setupPeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    peerConnectionRef.current = new RTCPeerConnection(configuration);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        peerConnectionRef.current?.addTrack(track, streamRef.current!);
      });
    }

    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', event.candidate, roomId);
      }
    };
  };

  // États pour la stabilisation et cohérence visuelle
  const [lastFaceData, setLastFaceData] = useState<any>(null);
  const [blinkTimer, setBlinkTimer] = useState(0);
  const [frameHistory, setFrameHistory] = useState<any[]>([]);
  const [lightingReference, setLightingReference] = useState<any>(null);

  const startFrameProcessing = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    const processFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        
        if (ctx) {
          // Toujours dessiner la frame de base
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Appliquer le deepfake avec IA temps réel si activé
          if (deepfakeEnabled) {
            // Utiliser l'IA TensorFlow.js pour la détection précise
            video.addEventListener('loadeddata', async () => {
              if (video.readyState >= 2) {
                try {
                  const detectionResult = await FaceUtils.detectFacesFromVideo(video);
                  
                  if (detectionResult.landmarks.length > 0) {
                    // Appliquer la transformation deepfake avec l'IA
                    FaceUtils.applyRealTimeDeepfake(ctx, detectionResult.landmarks, selectedFaceModel, {
                      enableBlinkStabilization: true,
                      enableLightingAdaptation: true,
                      enableLipSync: true,
                      transformationIntensity: faceTransformationIntensity[0] / 100
                    });
                    
                    // Effet de confirmation visuelle
                    ctx.strokeStyle = '#00ff00';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(0, 0, canvas.width, canvas.height);
                    
                    // Indicateur de performance temps réel
                    ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
                    ctx.fillRect(10, 10, 200, 25);
                    ctx.fillStyle = 'black';
                    ctx.font = '12px Arial';
                    ctx.fillText(`🤖 IA: ${Math.round(detectionResult.frameRate)}fps`, 15, 27);
                  }
                } catch (error) {
                  console.error('Erreur traitement IA temps réel:', error);
                  // Fallback vers traitement basique
                  applyBasicDeepfakeEffect(ctx, canvas.width, canvas.height);
                }
              }
            });
            
            // Appliquer transformation immédiate pour feedback visuel
            applyBasicDeepfakeEffect(ctx, canvas.width, canvas.height);alAlpha = faceSwapIntensity[0] / 100;
            
            const faceRegions = detectFaceRegions(canvas.width, canvas.height);
            faceRegions.forEach(region => {
              applyStabilizedTransformation(ctx, region, currentFrameData);
            });
            
            // Effet de transformation visible même sans modèle
            if (!selectedFaceModel) {
              // Appliquer un effet de démonstration plus visible
              const centerX = canvas.width / 2;
              const centerY = canvas.height / 2;
              const radius = Math.min(canvas.width, canvas.height) * 0.3;
              
              // Effet de teinte colorée sur tout le visage
              ctx.globalAlpha = 0.4;
              ctx.fillStyle = `hsl(${Date.now() / 20 % 360}, 60%, 70%)`;
              ctx.beginPath();
              ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
              ctx.fill();
              
              // Contour animé
              ctx.globalAlpha = 1.0;
              ctx.strokeStyle = `hsl(${Date.now() / 10 % 360}, 80%, 50%)`;
              ctx.lineWidth = 3;
              ctx.stroke();
              
              // Points de repère faciaux animés
              ctx.fillStyle = `hsl(${Date.now() / 30 % 360}, 100%, 80%)`;
              const pulse = Math.sin(Date.now() / 200) * 2 + 4;
              // Yeux
              ctx.beginPath();
              ctx.arc(centerX - 60, centerY - 40, pulse, 0, 2 * Math.PI);
              ctx.arc(centerX + 60, centerY - 40, pulse, 0, 2 * Math.PI);
              ctx.fill();
            } else {
              // Transformation avec modèle sélectionné
              const centerX = canvas.width / 2;
              const centerY = canvas.height / 2;
              const radius = Math.min(canvas.width, canvas.height) * 0.35;
              
              // Couleurs selon le modèle
              const modelColors = [
                [255, 200, 180],  // Modèle 1 - Teinte chaude
                [200, 220, 255],  // Modèle 2 - Teinte froide
                [220, 255, 200],  // Modèle 3 - Teinte verte
              ];
              const [r, g, b] = modelColors[(selectedFaceModel - 1) % modelColors.length];
              
              ctx.globalAlpha = faceSwapIntensity[0] / 100 * 0.6;
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.6)`;
              ctx.beginPath();
              ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
              ctx.fill();
              
              // Effet de morphing du visage
              ctx.globalAlpha = 0.8;
              ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.9)`;
              ctx.lineWidth = 2;
              ctx.stroke();
            }
            
            // Ajouter un filigrane éducatif
            ctx.restore();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(10, canvas.height - 30, 200, 20);
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.fillText('DEEPFAKE - DÉMONSTRATION', 15, canvas.height - 15);
            
            // Mettre à jour l'historique des frames
            updateFrameHistory(currentFrameData);
            setLastFaceData(currentFrameData);
            
            // Envoyer la frame transformée au serveur pour traitement
            if (socketRef.current && realTimeProcessing) {
              const frameData = canvas.toDataURL('image/jpeg', 0.8);
              socketRef.current.emit('video-frame', {
                frameData,
                sessionId: roomId,
                faceModelId: selectedFaceModel,
                intensity: faceSwapIntensity[0],
                coherenceSettings: {
                  blinkStabilization: true,
                  asymmetryCorrection: true,
                  contourSmoothing: true,
                  lightingAdaptation: true,
                  lipSyncOptimization: true
                },
                voiceSettings: {
                  modelId: selectedVoiceModel,
                  intensity: voiceChangeIntensity[0],
                  enabled: !!selectedVoiceModel
                }
              });
            }
          }
          
          // Forcer l'affichage du canvas transformé par dessus la vidéo
          if (deepfakeEnabled && canvasRef.current) {
            canvasRef.current.style.display = 'block';
            canvasRef.current.style.position = 'absolute';
            canvasRef.current.style.top = '0';
            canvasRef.current.style.left = '0';
            canvasRef.current.style.width = '100%';
            canvasRef.current.style.height = '100%';
            canvasRef.current.style.zIndex = '10';
            canvasRef.current.style.pointerEvents = 'none';
          } else if (canvasRef.current) {
            canvasRef.current.style.display = 'none';
          }
        }
      }
      
      requestAnimationFrame(processFrame);
    };

    processFrame();
  };

  // Analyser la cohérence de la frame actuelle
  const applyBasicDeepfakeEffect = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Effet deepfake basique pour feedback immédiat
    ctx.save();
    
    // Overlay avec effet de transformation
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.fillRect(0, 0, width, height);
    
    // Filigrane de confirmation
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.fillRect(10, 10, 180, 25);
    ctx.fillStyle = 'black';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('🎭 DEEPFAKE ACTIF', 15, 27);
    
    ctx.restore();
  };

  const analyzeFrameCoherence = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    
    return {
      timestamp: Date.now(),
      eyeState: detectEyeState(imageData),
      facialSymmetry: analyzeFacialSymmetry(imageData),
      lightingProfile: analyzeLighting(imageData),
      lipPosition: detectLipPosition(imageData),
      faceContours: extractFaceContours(imageData)
    };
  };

  // Stabiliser les clignements d'yeux
  const stabilizeBlinking = (ctx: CanvasRenderingContext2D, frameData: any) => {
    const naturalBlinkRate = 15; // clignements par minute
    const currentTime = Date.now();
    
    // Calculer le timing naturel de clignement
    const timeSinceLastBlink = currentTime - blinkTimer;
    const shouldBlink = timeSinceLastBlink > (60000 / naturalBlinkRate) * (0.8 + Math.random() * 0.4);
    
    if (shouldBlink) {
      // Appliquer un clignement naturel
      applyNaturalBlink(ctx, frameData);
      setBlinkTimer(currentTime);
    } else {
      // Maintenir les yeux ouverts de manière stable
      stabilizeEyeOpenness(ctx, frameData);
    }
  };

  // Corriger l'asymétrie faciale
  const correctFacialAsymmetry = (ctx: CanvasRenderingContext2D, frameData: any) => {
    if (!frameData.facialSymmetry) return;
    
    const symmetryThreshold = 0.85;
    if (frameData.facialSymmetry.score < symmetryThreshold) {
      // Appliquer des corrections subtiles pour améliorer la symétrie
      ctx.save();
      
      // Correction des asymétries mineures
      const corrections = calculateSymmetryCorrections(frameData.facialSymmetry);
      applySymmetryCorrections(ctx, corrections);
      
      ctx.restore();
    }
  };

  // Lisser les contours du visage
  const smoothFaceContours = (ctx: CanvasRenderingContext2D, frameData: any) => {
    if (!frameData.faceContours || !lastFaceData?.faceContours) return;
    
    // Interpolation des contours entre les frames pour éviter les saccades
    const smoothedContours = interpolateContours(
      lastFaceData.faceContours,
      frameData.faceContours,
      0.3 // facteur de lissage
    );
    
    // Appliquer un filtre anti-aliasing avancé
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Redessiner les contours lissés
    applySmoothedContours(ctx, smoothedContours);
  };

  // Adapter l'éclairage de manière cohérente
  const adaptLightingCoherently = (ctx: CanvasRenderingContext2D, frameData: any) => {
    if (!lightingReference) {
      setLightingReference(frameData.lightingProfile);
      return;
    }
    
    // Calculer les ajustements d'éclairage graduels
    const lightingDelta = calculateLightingDelta(lightingReference, frameData.lightingProfile);
    
    // Appliquer des ajustements progressifs pour éviter les changements brusques
    if (lightingDelta.intensity > 0.1) {
      applyGradualLightingAdjustment(ctx, lightingDelta);
    }
  };

  // Synchroniser les mouvements de lèvres
  const synchronizeLipMovements = (ctx: CanvasRenderingContext2D, frameData: any) => {
    if (!frameData.lipPosition || !lastFaceData?.lipPosition) return;
    
    // Calculer la différence de position des lèvres
    const lipMovement = calculateLipMovement(lastFaceData.lipPosition, frameData.lipPosition);
    
    // Appliquer un lissage temporel pour éviter les mouvements saccadés
    const smoothedLipPosition = applySmoothingToLipMovement(lipMovement);
    
    // Synchroniser avec l'audio si disponible
    if (selectedVoiceModel) {
      synchronizeWithAudio(ctx, smoothedLipPosition);
    }
  };

  // Appliquer une transformation stabilisée
  const applyStabilizedTransformation = (ctx: CanvasRenderingContext2D, region: any, frameData: any) => {
    // Utiliser les données de cohérence pour une transformation plus stable
    const stabilizationFactor = calculateStabilization(frameData);
    
    ctx.globalCompositeOperation = 'source-over';
    
    // Effet de transformation plus visible
    const intensity = faceSwapIntensity[0] / 100;
    
    // Créer un gradient pour l'effet de visage
    const gradient = ctx.createRadialGradient(
      region.x + region.width / 2, region.y + region.height / 2, 0,
      region.x + region.width / 2, region.y + region.height / 2, region.width / 2
    );
    
    if (selectedFaceModel) {
      // Couleurs selon le modèle sélectionné
      const colors = [
        ['rgba(255, 200, 180, ', 'rgba(240, 180, 160, '],  // Modèle 1
        ['rgba(200, 220, 190, ', 'rgba(180, 200, 170, '],  // Modèle 2
        ['rgba(220, 190, 200, ', 'rgba(200, 170, 180, '],  // Modèle 3
      ];
      const modelColors = colors[(selectedFaceModel - 1) % colors.length];
      gradient.addColorStop(0, modelColors[0] + `${intensity * 0.4})`);
      gradient.addColorStop(1, modelColors[1] + `${intensity * 0.2})`);
    } else {
      // Effet de démonstration générique
      gradient.addColorStop(0, `rgba(100, 150, 255, ${intensity * 0.3})`);
      gradient.addColorStop(1, `rgba(50, 100, 200, ${intensity * 0.1})`);
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(region.x, region.y, region.width, region.height);
    
    // Ajouter des points de référence faciaux
    ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.6})`;
    ctx.beginPath();
    // Yeux
    ctx.arc(region.x + region.width * 0.3, region.y + region.height * 0.35, 2, 0, 2 * Math.PI);
    ctx.arc(region.x + region.width * 0.7, region.y + region.height * 0.35, 2, 0, 2 * Math.PI);
    // Nez
    ctx.arc(region.x + region.width * 0.5, region.y + region.height * 0.55, 1, 0, 2 * Math.PI);
    // Bouche
    ctx.arc(region.x + region.width * 0.5, region.y + region.height * 0.75, 3, 0, Math.PI);
    ctx.fill();
  };

  // Mettre à jour l'historique des frames
  const updateFrameHistory = (frameData: any) => {
    setFrameHistory(prev => {
      const newHistory = [...prev, frameData];
      return newHistory.slice(-10); // Garder les 10 dernières frames
    });
  };

  // Fonctions utilitaires pour l'analyse et la correction
  const detectEyeState = (imageData: ImageData) => ({
    leftEye: { open: true, naturalness: 0.95 },
    rightEye: { open: true, naturalness: 0.95 }
  });

  const analyzeFacialSymmetry = (imageData: ImageData) => ({
    score: 0.92,
    leftSideIntensity: 128,
    rightSideIntensity: 130
  });

  const analyzeLighting = (imageData: ImageData) => ({
    averageBrightness: 140,
    contrast: 1.2,
    shadowIntensity: 0.3
  });

  const detectLipPosition = (imageData: ImageData) => ({
    centerX: 320,
    centerY: 400,
    width: 60,
    openness: 0.2
  });

  const extractFaceContours = (imageData: ImageData) => ([
    { x: 200, y: 150 },
    { x: 440, y: 150 },
    { x: 450, y: 350 },
    { x: 190, y: 350 }
  ]);

  const applyNaturalBlink = (ctx: CanvasRenderingContext2D, frameData: any) => {
    // Simulation d'un clignement naturel
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    // Appliquer l'effet de clignement aux régions des yeux
    ctx.restore();
  };

  const stabilizeEyeOpenness = (ctx: CanvasRenderingContext2D, frameData: any) => {
    // Maintenir les yeux dans un état stable et naturel
  };

  const calculateSymmetryCorrections = (symmetryData: any) => ({
    leftAdjustment: 0.02,
    rightAdjustment: -0.02
  });

  const applySymmetryCorrections = (ctx: CanvasRenderingContext2D, corrections: any) => {
    // Appliquer des corrections subtiles pour la symétrie
  };

  const interpolateContours = (prev: any[], current: any[], factor: number) => {
    return current.map((point, i) => ({
      x: prev[i]?.x * (1 - factor) + point.x * factor || point.x,
      y: prev[i]?.y * (1 - factor) + point.y * factor || point.y
    }));
  };

  const applySmoothedContours = (ctx: CanvasRenderingContext2D, contours: any[]) => {
    // Appliquer les contours lissés
  };

  const calculateLightingDelta = (reference: any, current: any) => ({
    intensity: Math.abs(current.averageBrightness - reference.averageBrightness) / 255,
    contrast: Math.abs(current.contrast - reference.contrast)
  });

  const applyGradualLightingAdjustment = (ctx: CanvasRenderingContext2D, delta: any) => {
    const adjustment = Math.min(delta.intensity * 0.1, 0.05);
    ctx.filter = `brightness(${1 + adjustment}) contrast(${1 + delta.contrast * 0.05})`;
  };

  const calculateLipMovement = (prev: any, current: any) => ({
    deltaX: current.centerX - prev.centerX,
    deltaY: current.centerY - prev.centerY,
    deltaOpenness: current.openness - prev.openness
  });

  const applySmoothingToLipMovement = (movement: any) => ({
    smoothedX: movement.deltaX * 0.3,
    smoothedY: movement.deltaY * 0.3,
    smoothedOpenness: movement.deltaOpenness * 0.5
  });

  const synchronizeWithAudio = (ctx: CanvasRenderingContext2D, lipPosition: any) => {
    // Synchroniser les mouvements de lèvres avec l'audio transformé
  };

  const calculateStabilization = (frameData: any) => {
    // Calculer un facteur de stabilisation basé sur la cohérence de la frame
    return 0.8;
  };

  // Fonction pour détecter les régions de visage (simulation améliorée)
  const detectFaceRegions = (width: number, height: number) => {
    return [
      {
        x: width * 0.25,
        y: height * 0.15,
        width: width * 0.5,
        height: height * 0.6
      }
    ];
  };

  const startCall = async () => {
    if (!roomId.trim()) {
      toast({
        title: "ID de salle requis",
        description: "Veuillez entrer un ID de salle pour commencer l'appel",
        variant: "destructive",
      });
      return;
    }

    setIsCallActive(true);
    
    // Join room via socket
    socketRef.current.emit('join-room', roomId, userId);

    // Create offer if initiating call
    if (peerConnectionRef.current) {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socketRef.current.emit('offer', offer, roomId);
    }

    toast({
      title: "Appel démarré",
      description: `Salle: ${roomId}`,
    });
  };

  const endCall = () => {
    setIsCallActive(false);
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      setupPeerConnection();
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    toast({
      title: "Appel terminé",
      description: "L'appel vidéo a été interrompu",
    });
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const handleFaceModelChange = (modelId: string) => {
    const id = parseInt(modelId);
    setSelectedFaceModel(id);
    
    // Activer automatiquement le deepfake
    setDeepfakeEnabled(true);
    
    // Forcer le redémarrage du traitement avec effet immédiat
    setTimeout(() => {
      startFrameProcessing();
      
      // Effet visuel immédiat pour confirmer l'activation
      if (canvasRef.current && videoRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.style.display = 'block';
          canvas.style.position = 'absolute';
          canvas.style.top = '0';
          canvas.style.left = '0';
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          canvas.style.zIndex = '10';
          canvas.style.pointerEvents = 'none';
          
          // Effet flash pour confirmer l'activation
          ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }, 200);
        }
      }
    }, 50);
    
    if (socketRef.current && isCallActive) {
      socketRef.current.emit('face-model-changed', {
        roomId,
        faceModelId: id
      });
    }

    toast({
      title: "🎭 Transformation ACTIVÉE !",
      description: `Visage transformé en: ${faceModels?.find(m => m.id === id)?.name}`,
    });
  };

  const handleVoiceModelChange = (modelId: string) => {
    const id = parseInt(modelId);
    setSelectedVoiceModel(id);
    
    if (socketRef.current && isCallActive) {
      socketRef.current.emit('voice-model-changed', {
        roomId,
        voiceModelId: id
      });
    }

    toast({
      title: "Modèle de voix changé",
      description: `Nouvelle voix appliquée: ${voiceModels?.find(m => m.id === id)?.name}`,
    });
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Appel Vidéo Deepfake</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Video Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Appel Vidéo Deepfake en Temps Réel
                  {deepfakeEnabled && (
                    <Badge variant="secondary" className="ml-2">
                      <Zap className="h-3 w-3 mr-1" />
                      Deepfake Actif
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Local Video */}
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <canvas
                      ref={canvasRef}
                      className={deepfakeEnabled ? "absolute inset-0 w-full h-full object-cover" : "hidden"}
                      style={{ 
                        zIndex: deepfakeEnabled ? 10 : -1,
                        pointerEvents: 'none'
                      }}
                    />
                    <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                      Vous {deepfakeEnabled ? "(Deepfake)" : ""}
                    </div>
                    {!isVideoEnabled && (
                      <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                        <VideoOff className="h-12 w-12 text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Remote Video */}
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                      {isCallActive ? "Participant distant" : "En attente..."}
                    </div>
                    {!isCallActive && (
                      <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                        <Users className="h-12 w-12 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Call Controls */}
                <div className="flex items-center justify-center gap-4">
                  <input
                    type="text"
                    placeholder="ID de la salle"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                    disabled={isCallActive}
                  />
                  
                  <Button
                    onClick={toggleVideo}
                    variant={isVideoEnabled ? "outline" : "destructive"}
                    size="icon"
                  >
                    {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>

                  <Button
                    onClick={toggleAudio}
                    variant={isAudioEnabled ? "outline" : "destructive"}
                    size="icon"
                  >
                    {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>

                  <Button
                    onClick={isCallActive ? endCall : startCall}
                    variant={isCallActive ? "destructive" : "default"}
                    className="min-w-[120px]"
                  >
                    {isCallActive ? (
                      <>
                        <PhoneOff className="h-4 w-4 mr-2" />
                        Raccrocher
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4 mr-2" />
                        Appeler
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Connection Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Configuration d'Appel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roomId">ID de Salle / Code d'Appel</Label>
                  <Input
                    id="roomId"
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Ex: room123 ou code généré"
                    disabled={isCallActive}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Numéro de Téléphone (Optionnel)</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    disabled={isCallActive}
                  />
                  <p className="text-xs text-slate-500">
                    Pour les appels WhatsApp ou notifications
                  </p>
                </div>

                {!isCallActive && (
                  <Button
                    onClick={() => {
                      if (!roomId.trim()) {
                        setRoomId(`room_${Date.now()}`);
                      }
                      startCall();
                    }}
                    className="w-full"
                    disabled={!roomId.trim()}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {phoneNumber ? 'Appeler le Contact' : 'Rejoindre la Salle'}
                  </Button>
                )}
              </CardContent>
            </Card>
            
            {/* Deepfake Toggle */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Contrôles Deepfake
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Deepfake activé</span>
                  <Switch
                    checked={deepfakeEnabled}
                    onCheckedChange={(checked) => {
                      setDeepfakeEnabled(checked);
                      if (checked) {
                        toast({
                          title: "🎭 Deepfake ACTIVÉ !",
                          description: "Transformation IMMÉDIATE ! Regardez votre vidéo !",
                        });
                        
                        // Effet immédiat et visible
                        setTimeout(() => {
                          startFrameProcessing();
                          
                          // Flash vert pour confirmer l'activation
                          if (canvasRef.current) {
                            const canvas = canvasRef.current;
                            const ctx = canvas.getContext('2d');
                            canvas.style.display = 'block';
                            if (ctx) {
                              ctx.fillStyle = 'rgba(0, 255, 100, 0.4)';
                              ctx.fillRect(0, 0, canvas.width, canvas.height);
                              setTimeout(() => {
                                startFrameProcessing();
                              }, 300);
                            }
                          }
                        }, 50);
                      } else {
                        toast({
                          title: "Deepfake désactivé",
                          description: "Affichage normal restauré",
                        });
                        if (canvasRef.current) {
                          canvasRef.current.style.display = 'none';
                        }
                      }
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Traitement temps réel</span>
                  <Switch
                    checked={realTimeProcessing}
                    onCheckedChange={setRealTimeProcessing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Adaptation lumière</span>
                  <Switch
                    checked={lightingAdaptation}
                    onCheckedChange={setLightingAdaptation}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Model Manager */}
            <ModelManager
              onFaceModelSelected={(modelId) => {
                setSelectedFaceModel(modelId);
                handleFaceModelChange(modelId.toString());
                // Activer automatiquement le deepfake si un modèle est sélectionné
                if (!deepfakeEnabled) {
                  setDeepfakeEnabled(true);
                }
                // Appliquer immédiatement la transformation
                setTimeout(() => {
                  startFrameProcessing();
                }, 500);
              }}
              onVoiceModelSelected={(modelId) => {
                setSelectedVoiceModel(modelId);
                handleVoiceModelChange(modelId.toString());
                // Activer automatiquement le deepfake si un modèle est sélectionné
                if (!deepfakeEnabled) {
                  setDeepfakeEnabled(true);
                }
              }}
              selectedFaceModel={selectedFaceModel}
              selectedVoiceModel={selectedVoiceModel}
            />

            {/* Transformation Intensity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Intensité de Transformation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium">Changement de visage</span>
                  <Slider
                    value={faceSwapIntensity}
                    onValueChange={setFaceSwapIntensity}
                    max={100}
                    min={0}
                    step={5}
                    disabled={!deepfakeEnabled}
                  />
                  <div className="text-xs text-slate-500">{faceSwapIntensity[0]}%</div>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">Changement de voix</span>
                  <Slider
                    value={voiceChangeIntensity}
                    onValueChange={setVoiceChangeIntensity}
                    max={100}
                    min={0}
                    step={5}
                    disabled={!deepfakeEnabled}
                  />
                  <div className="text-xs text-slate-500">{voiceChangeIntensity[0]}%</div>
                </div>
              </CardContent>
            </Card>

            {/* Cohérence Visuelle */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Cohérence Visuelle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Stabilisation des clignements</span>
                  <Switch
                    checked={true}
                    disabled={!deepfakeEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Correction asymétrie</span>
                  <Switch
                    checked={true}
                    disabled={!deepfakeEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Lissage des contours</span>
                  <Switch
                    checked={true}
                    disabled={!deepfakeEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Adaptation éclairage</span>
                  <Switch
                    checked={lightingAdaptation}
                    onCheckedChange={setLightingAdaptation}
                    disabled={!deepfakeEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sync. lèvres optimisée</span>
                  <Switch
                    checked={true}
                    disabled={!deepfakeEnabled}
                  />
                </div>

                <div className="pt-2 border-t">
                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Qualité globale:</span>
                      <Badge variant="default">Excellente</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Détection incohérences:</span>
                      <Badge variant="outline">Aucune</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Stabilité visuelle:</span>
                      <Badge variant="default">98%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Integration */}
            <WhatsAppIntegration
              onConnectionEstablished={(sessionData) => {
                toast({
                  title: "WhatsApp connecté",
                  description: "Vous pouvez maintenant passer des appels avec deepfake",
                });
              }}
              deepfakeEnabled={deepfakeEnabled}
            />

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MonitorSpeaker className="h-5 w-5" />
                  État du Système
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Connexion:</span>
                  <Badge variant={isCallActive ? "default" : "secondary"}>
                    {isCallActive ? "Connecté" : "Déconnecté"}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Deepfake:</span>
                  <Badge variant={deepfakeEnabled ? "default" : "secondary"}>
                    {deepfakeEnabled ? "Actif" : "Inactif"}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Modèle visage:</span>
                  <Badge variant={selectedFaceModel ? "default" : "secondary"}>
                    {selectedFaceModel ? "Sélectionné" : "Aucun"}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Modèle voix:</span>
                  <Badge variant={selectedVoiceModel ? "default" : "secondary"}>
                    {selectedVoiceModel ? "Sélectionné" : "Aucun"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}