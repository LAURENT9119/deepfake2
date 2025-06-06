
import { useEffect, useRef, useState } from "react";
import { FaceUtils, FaceDetectionResult } from "@/lib/face-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Brain, Eye, Zap } from "lucide-react";

interface FaceDetectorProps {
  imageFile: File;
  onFaceDetected: (result: FaceDetectionResult) => void;
}

export function FaceDetector({ imageFile, onFaceDetected }: FaceDetectorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiInitialized, setAiInitialized] = useState(false);
  const [detectionResult, setDetectionResult] = useState<FaceDetectionResult | null>(null);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAI();
  }, []);

  useEffect(() => {
    if (!imageFile || !aiInitialized) return;
    detectFaces();
  }, [imageFile, aiInitialized]);

  const initializeAI = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await FaceUtils.initializeAI();
      setAiInitialized(true);
      console.log('🤖 IA de détection faciale prête');
    } catch (error) {
      console.error('Erreur d\'initialisation IA:', error);
      setError('Impossible d\'initialiser l\'IA de détection faciale');
    } finally {
      setIsLoading(false);
    }
  };

  const detectFaces = async () => {
    if (!aiInitialized) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Analyse de l\'image avec IA...');
      
      // Utiliser l'IA pour détecter les visages
      const result = await FaceUtils.detectFaces(imageFile);
      
      setDetectionResult(result);
      onFaceDetected(result);

      // Dessiner les résultats sur le canvas
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Dessiner les détections IA
        if (result.landmarks.length > 0) {
          FaceUtils.drawFaceLandmarks(ctx, result.landmarks, showLandmarks);
        }

        // Ajouter indicateur IA
        ctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
        ctx.fillRect(10, 10, 160, 30);
        ctx.fillStyle = 'black';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('🤖 IA ACTIVÉE', 15, 30);
      };

      img.src = URL.createObjectURL(imageFile);
      
    } catch (error) {
      console.error('Erreur de détection IA:', error);
      setError('Erreur lors de la détection faciale IA');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Détection Faciale IA (TensorFlow.js)
          {aiInitialized && (
            <Badge variant="default" className="ml-2">
              <Zap className="h-3 w-3 mr-1" />
              IA Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">Points de repère détaillés</span>
          </div>
          <Switch
            checked={showLandmarks}
            onCheckedChange={setShowLandmarks}
            disabled={isLoading}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
            <Button
              onClick={initializeAI}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Réessayer l'initialisation IA
            </Button>
          </div>
        )}

        {/* Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto border rounded-lg"
            style={{ display: isLoading ? 'none' : 'block' }}
          />
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-slate-600">
                  {!aiInitialized ? 'Initialisation de l\'IA...' : 'Détection des visages avec IA...'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Detection Results */}
        {detectionResult && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span>Visages:</span>
              <Badge variant="default">{detectionResult.faces.length}</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <span>Confiance:</span>
              <Badge variant="outline">{(detectionResult.confidence * 100).toFixed(1)}%</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
              <span>Points IA:</span>
              <Badge variant="secondary">
                {detectionResult.landmarks.reduce((acc, face) => acc + face.keypoints.length, 0)}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
              <span>Modèle:</span>
              <Badge variant="outline">MediaPipe</Badge>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={detectFaces}
            disabled={isLoading || !aiInitialized}
            variant="default"
            size="sm"
          >
            <Brain className="h-4 w-4 mr-2" />
            Réanalyser avec IA
          </Button>
          
          {detectionResult && detectionResult.faces.length > 0 && (
            <Button
              onClick={() => setShowLandmarks(!showLandmarks)}
              variant="outline"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showLandmarks ? 'Masquer' : 'Afficher'} détails
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
