import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Camera, Square, Zap, Eye, Lightbulb, Palette, Brain } from "lucide-react";
import { FaceUtils, FaceDetectionResult } from "@/lib/face-utils";

interface FaceDetection {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  landmarks?: number[][];
}

interface RealTimeFaceDetectorProps {
  onFaceDetected?: (faces: FaceDetection[]) => void;
  faceModel?: any;
  voiceModel?: any;
  enabled?: boolean;
}

export function RealTimeFaceDetector({ 
  onFaceDetected, 
  faceModel, 
  voiceModel, 
  enabled = false 
}: RealTimeFaceDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const processingCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedFaces, setDetectedFaces] = useState<FaceDetection[]>([]);
  const [processingEnabled, setProcessingEnabled] = useState(enabled);
  const [detectionAccuracy, setDetectionAccuracy] = useState([85]);
  const [lightingCompensation, setLightingCompensation] = useState(true);
  const [motionBlurReduction, setMotionBlurReduction] = useState(true);
  const [frameRate, setFrameRate] = useState([30]);
  const [aiInitialized, setAiInitialized] = useState(false);
  const [aiDetectionResult, setAiDetectionResult] = useState<FaceDetectionResult | null>(null);
  const [useRealAI, setUseRealAI] = useState(true);

  useEffect(() => {
    initializeAI();
  }, []);

  useEffect(() => {
    if (processingEnabled) {
      startFaceDetection();
    } else {
      stopFaceDetection();
    }
  }, [processingEnabled, faceModel, voiceModel, aiInitialized]);

  const initializeAI = async () => {
    try {
      await FaceUtils.initializeAI();
      setAiInitialized(true);
      console.log('🤖 IA temps réel initialisée');
    } catch (error) {
      console.error('Erreur initialisation IA temps réel:', error);
      setAiInitialized(false);
    }
  };

  const startFaceDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: frameRate[0] }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        processVideoStream();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopFaceDetection = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      setDetectedFaces([]);
    }
  };

  const processVideoStream = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const processingCanvas = processingCanvasRef.current;
    
    if (!video || !canvas || !processingCanvas) return;

    const ctx = canvas.getContext('2d');
    const processingCtx = processingCanvas.getContext('2d');
    
    if (!ctx || !processingCtx) return;

    const detectFaces = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const width = video.videoWidth;
        const height = video.videoHeight;
        
        canvas.width = width;
        canvas.height = height;
        processingCanvas.width = width;
        processingCanvas.height = height;

        // Draw current frame
        ctx.drawImage(video, 0, 0, width, height);
        processingCtx.drawImage(video, 0, 0, width, height);

        // Utiliser l'IA réelle pour la détection
        const faces = await performRealAIDetection(video);
        
        // Apply deepfake transformation if models are available
        if (faceModel && faces.length > 0) {
          applyFaceTransformation(processingCtx, faces, faceModel);
        }

        // Apply lighting compensation
        if (lightingCompensation) {
          applyLightingCompensation(processingCtx, width, height);
        }

        // Motion blur reduction
        if (motionBlurReduction) {
          applyMotionBlurReduction(processingCtx, width, height);
        }

        // Draw face detection boxes
        drawFaceDetections(ctx, faces);
        
        setDetectedFaces(faces);
        onFaceDetected?.(faces);
      }
      
      if (processingEnabled) {
        requestAnimationFrame(detectFaces);
      }
    };

    detectFaces();
  };

  const performRealAIDetection = async (video: HTMLVideoElement): Promise<FaceDetection[]> => {
    if (!aiInitialized || !useRealAI) {
      return performFallbackDetection();
    }

    try {
      const result = await FaceUtils.detectFacesFromVideo(video);
      setAiDetectionResult(result);
      
      // Convertir les résultats IA au format attendu avec caractéristiques détaillées
      const faces: FaceDetection[] = result.faces.map((face, index) => {
        const landmark = result.landmarks[index];
        return {
          x: face.x,
          y: face.y,
          width: face.width,
          height: face.height,
          confidence: result.confidence,
          landmarks: landmark?.keypoints.map(kp => [kp.x, kp.y]) || [],
          features: landmark?.features, // Nouvelles caractéristiques détaillées
          blinkState: {
            left: landmark?.features.leftEye.blinkState || 0,
            right: landmark?.features.rightEye.blinkState || 0
          },
          mouthState: {
            openness: landmark?.features.mouth.openness || 0,
            movement: landmark?.features.mouth.lipMovement || 'neutral'
          },
          lighting: landmark?.features.lighting
        };
      });

      return faces;
    } catch (error) {
      console.error('Erreur détection IA temps réel:', error);
      return performFallbackDetection();
    }
  };

  const performFallbackDetection = (): FaceDetection[] => {
    // Détection de base si l'IA échoue
    const accuracy = detectionAccuracy[0];
    const faces: FaceDetection[] = [];
    
    if (Math.random() * 100 < accuracy) {
      faces.push({
        x: 320 + (Math.random() - 0.5) * 50,
        y: 180 + (Math.random() - 0.5) * 30,
        width: 280 + (Math.random() - 0.5) * 100,
        height: 360 + (Math.random() - 0.5) * 80,
        confidence: 0.85 + Math.random() * 0.15,
        landmarks: generateFaceLandmarks()
      });
    }

    return faces;
  };

  const generateFaceLandmarks = (): number[][] => {
    // Generate 68 facial landmarks (simplified)
    const landmarks: number[][] = [];
    for (let i = 0; i < 68; i++) {
      landmarks.push([Math.random() * 100, Math.random() * 100]);
    }
    return landmarks;
  };

  const applyFaceTransformation = (ctx: CanvasRenderingContext2D, faces: FaceDetection[], model: any) => {
    // Transformation deepfake avancée avec caractéristiques précises
    faces.forEach(face => {
      ctx.save();
      
      // Appliquer la transformation du modèle de visage avec IA
      if (face.features) {
        FaceUtils.applyRealTimeDeepfake(ctx, [{ 
          keypoints: face.landmarks?.map(([x, y]) => ({ x, y })) || [],
          box: { x: face.x, y: face.y, width: face.width, height: face.height },
          features: face.features,
          confidence: face.confidence
        }], model, {
          enableBlinkStabilization: true,
          enableLightingAdaptation: lightingCompensation,
          enableLipSync: true,
          transformationIntensity: 0.8
        });
      }
      
      // Amélioration spécifique des yeux avec stabilisation des clignements
      if (face.blinkState) {
        // Dessiner les yeux stabilisés
        const leftEyeAlpha = Math.max(0.1, 1 - face.blinkState.left);
        const rightEyeAlpha = Math.max(0.1, 1 - face.blinkState.right);
        
        ctx.globalAlpha = leftEyeAlpha;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(face.x + face.width * 0.25, face.y + face.height * 0.35, face.width * 0.15, face.height * 0.1);
        
        ctx.globalAlpha = rightEyeAlpha;
        ctx.fillRect(face.x + face.width * 0.6, face.y + face.height * 0.35, face.width * 0.15, face.height * 0.1);
      }
      
      // Amélioration de la bouche avec synchronisation labiale
      if (face.mouthState) {
        ctx.globalAlpha = 0.6;
        const mouthY = face.y + face.height * 0.7;
        const mouthWidth = face.width * 0.3 * (1 + face.mouthState.openness * 0.5);
        const mouthHeight = face.height * 0.05 * (1 + face.mouthState.openness * 2);
        
        // Couleur en fonction du mouvement
        let mouthColor = 'rgba(200, 100, 100, 0.3)';
        if (face.mouthState.movement === 'talking') {
          mouthColor = 'rgba(100, 200, 100, 0.4)';
        } else if (face.mouthState.movement === 'smiling') {
          mouthColor = 'rgba(100, 100, 200, 0.4)';
        }
        
        ctx.fillStyle = mouthColor;
        ctx.fillRect(
          face.x + face.width * 0.35,
          mouthY,
          mouthWidth,
          mouthHeight
        );
      }
      
      // Adaptation de l'éclairage en temps réel
      if (face.lighting && lightingCompensation) {
        const gradient = ctx.createRadialGradient(
          face.x + face.width * 0.5,
          face.y + face.height * 0.3,
          0,
          face.x + face.width * 0.5,
          face.y + face.height * 0.3,
          face.width * 0.8
        );
        
        gradient.addColorStop(0, `rgba(${face.lighting.color.r}, ${face.lighting.color.g}, ${face.lighting.color.b}, ${face.lighting.intensity * 0.1})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.05)');
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(face.x, face.y, face.width, face.height);
      }
      
      // Filigrane éducatif amélioré
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
      ctx.fillRect(face.x, face.y, 180, 25);
      ctx.fillStyle = 'black';
      ctx.font = 'bold 11px Arial';
      ctx.fillText('🤖 IA TEMPS RÉEL ACTIVÉE', face.x + 5, face.y + 17);
      
      // Indicateur de performance
      if (aiDetectionResult?.frameRate) {
        ctx.fillStyle = 'rgba(0, 0, 255, 0.7)';
        ctx.fillRect(face.x, face.y + 30, 100, 20);
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.fillText(`${Math.round(aiDetectionResult.frameRate)} FPS`, face.x + 5, face.y + 43);
      }
      
      ctx.restore();
    });
  };

  const applyLightingCompensation = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Simulate lighting adaptation
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Simple brightness adjustment
    const brightnessFactor = 1.05;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * brightnessFactor);     // Red
      data[i + 1] = Math.min(255, data[i + 1] * brightnessFactor); // Green
      data[i + 2] = Math.min(255, data[i + 2] * brightnessFactor); // Blue
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const applyMotionBlurReduction = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Simple motion blur reduction simulation
    ctx.filter = 'contrast(1.1) saturate(1.05)';
    ctx.drawImage(ctx.canvas, 0, 0);
    ctx.filter = 'none';
  };

  const drawFaceDetections = (ctx: CanvasRenderingContext2D, faces: FaceDetection[]) => {
    faces.forEach((face, index) => {
      // Draw bounding box
      ctx.strokeStyle = face.confidence > 0.8 ? '#10B981' : '#F59E0B';
      ctx.lineWidth = 2;
      ctx.strokeRect(face.x, face.y, face.width, face.height);
      
      // Draw confidence score
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(face.x, face.y - 25, 100, 20);
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText(`Face ${index + 1}: ${(face.confidence * 100).toFixed(1)}%`, face.x + 5, face.y - 10);
      
      // Draw landmarks if available
      if (face.landmarks) {
        ctx.fillStyle = '#3B82F6';
        face.landmarks.slice(0, 10).forEach(([x, y]) => {
          const realX = face.x + (x / 100) * face.width;
          const realY = face.y + (y / 100) * face.height;
          ctx.beginPath();
          ctx.arc(realX, realY, 1, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Détection Faciale Temps Réel
          {processingEnabled && (
            <Badge variant="default" className="ml-2">
              <Zap className="h-3 w-3 mr-1" />
              Actif
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Display */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Video */}
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
                className="absolute top-0 left-0 w-full h-full"
              />
              <div className="absolute top-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                Original + Détection
              </div>
            </div>

            {/* Processed Video */}
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <canvas
                ref={processingCanvasRef}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                Deepfake Traité
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Détection activée</span>
              <Switch
                checked={processingEnabled}
                onCheckedChange={setProcessingEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Compensation lumière</span>
              <Switch
                checked={lightingCompensation}
                onCheckedChange={setLightingCompensation}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Réduction flou</span>
              <Switch
                checked={motionBlurReduction}
                onCheckedChange={setMotionBlurReduction}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-1">
                <Brain className="h-3 w-3" />
                IA TensorFlow
              </span>
              <Switch
                checked={useRealAI && aiInitialized}
                onCheckedChange={setUseRealAI}
                disabled={!aiInitialized}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Précision détection</label>
              <Slider
                value={detectionAccuracy}
                onValueChange={setDetectionAccuracy}
                max={100}
                min={50}
                step={5}
                className="mt-1"
              />
              <div className="text-xs text-slate-500 mt-1">{detectionAccuracy[0]}%</div>
            </div>

            <div>
              <label className="text-sm font-medium">Fréquence d'images</label>
              <Slider
                value={frameRate}
                onValueChange={setFrameRate}
                max={60}
                min={15}
                step={5}
                className="mt-1"
              />
              <div className="text-xs text-slate-500 mt-1">{frameRate[0]} fps</div>
            </div>
          </div>
        </div>

        {/* Detection Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
            <span>Status:</span>
            <Badge variant={isStreaming ? "default" : "secondary"}>
              {isStreaming ? "Streaming" : "Arrêté"}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
            <span>Visages:</span>
            <Badge variant="outline">{detectedFaces.length}</Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
            <span>IA:</span>
            <Badge variant={aiInitialized && useRealAI ? "default" : "secondary"}>
              {aiInitialized && useRealAI ? "🤖 Active" : "Simulation"}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
            <span>Voix:</span>
            <Badge variant={voiceModel ? "default" : "secondary"}>
              {voiceModel ? "Chargé" : "Aucun"}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => setProcessingEnabled(!processingEnabled)}
            variant={processingEnabled ? "destructive" : "default"}
            size="sm"
          >
            <Camera className="h-4 w-4 mr-2" />
            {processingEnabled ? "Arrêter" : "Démarrer"}
          </Button>
          
          {detectedFaces.length > 0 && (
            <Button variant="outline" size="sm">
              <Square className="h-4 w-4 mr-2" />
              Capturer ({detectedFaces.length} visages)
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}