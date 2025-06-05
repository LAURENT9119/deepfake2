import { useEffect, useRef, useState } from "react";

interface FaceDetectorProps {
  imageFile: File;
  onFaceDetected: (faces: any[]) => void;
}

export function FaceDetector({ imageFile, onFaceDetected }: FaceDetectorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!imageFile) return;

    const detectFaces = async () => {
      setIsLoading(true);
      
      try {
        // Load face-api.js models
        await Promise.all([
          loadTinyFaceDetectorModel(),
          loadFaceLandmarkModel(),
          loadFaceRecognitionModel(),
        ]);

        const img = new Image();
        img.onload = async () => {
          const canvas = canvasRef.current;
          if (!canvas) return;

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // Detect faces (simulated for demo)
          const mockFaces = [
            {
              x: img.width * 0.3,
              y: img.height * 0.2,
              width: img.width * 0.4,
              height: img.height * 0.5,
            }
          ];

          // Draw face detection boxes
          ctx.strokeStyle = '#2563EB';
          ctx.lineWidth = 2;
          mockFaces.forEach(face => {
            ctx.strokeRect(face.x, face.y, face.width, face.height);
          });

          onFaceDetected(mockFaces);
        };

        img.src = URL.createObjectURL(imageFile);
      } catch (error) {
        console.error('Face detection error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    detectFaces();
  }, [imageFile, onFaceDetected]);

  // Simulated model loading functions
  const loadTinyFaceDetectorModel = () => Promise.resolve();
  const loadFaceLandmarkModel = () => Promise.resolve();
  const loadFaceRecognitionModel = () => Promise.resolve();

  return (
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
            <p className="text-sm text-slate-600">Détection des visages...</p>
          </div>
        </div>
      )}
    </div>
  );
}
