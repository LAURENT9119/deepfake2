import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Camera, Square, Zap, Eye, Lightbulb, Palette } from "lucide-react";

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

  useEffect(() => {
    if (processingEnabled) {
      startFaceDetection();
    } else {
      stopFaceDetection();
    }
  }, [processingEnabled, faceModel, voiceModel]);

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

        // Simulate advanced face detection
        const faces = performFaceDetection(canvas, detectionAccuracy[0]);
        
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

  const performFaceDetection = (canvas: HTMLCanvasElement, accuracy: number): FaceDetection[] => {
    // Simulated advanced face detection with MediaPipe-like accuracy
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Simulate multiple face detection
    const faces: FaceDetection[] = [];
    
    // Primary face detection (center area)
    if (Math.random() * 100 < accuracy) {
      faces.push({
        x: canvas.width * 0.25 + (Math.random() - 0.5) * 50,
        y: canvas.height * 0.15 + (Math.random() - 0.5) * 30,
        width: canvas.width * 0.4 + (Math.random() - 0.5) * 100,
        height: canvas.height * 0.5 + (Math.random() - 0.5) * 80,
        confidence: 0.85 + Math.random() * 0.15,
        landmarks: generateFaceLandmarks()
      });
    }

    // Secondary face detection (if multiple people)
    if (Math.random() * 100 < accuracy * 0.7) {
      faces.push({
        x: canvas.width * 0.65 + (Math.random() - 0.5) * 40,
        y: canvas.height * 0.20 + (Math.random() - 0.5) * 25,
        width: canvas.width * 0.3 + (Math.random() - 0.5) * 60,
        height: canvas.height * 0.4 + (Math.random() - 0.5) * 50,
        confidence: 0.75 + Math.random() * 0.2,
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
    // Advanced face transformation simulation
    faces.forEach(face => {
      ctx.save();
      
      // Apply face model transformation
      const faceRegion = ctx.getImageData(face.x, face.y, face.width, face.height);
      
      // Simulate deepfake blending
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 50) + 200}, ${Math.floor(Math.random() * 50) + 180}, ${Math.floor(Math.random() * 50) + 170}, 0.1)`;
      ctx.fillRect(face.x, face.y, face.width, face.height);
      
      // Add educational watermark
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(face.x, face.y, 200, 25);
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText('DEEPFAKE - DÉMO', face.x + 5, face.y + 17);
      
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
            <span>Modèle:</span>
            <Badge variant={faceModel ? "default" : "secondary"}>
              {faceModel ? "Chargé" : "Aucun"}
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