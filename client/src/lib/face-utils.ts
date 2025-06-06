
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

export interface FaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FaceLandmarks {
  keypoints: Array<{
    x: number;
    y: number;
    z?: number;
    name?: string;
  }>;
  box: FaceBox;
}

export interface FaceDetectionResult {
  faces: FaceBox[];
  landmarks: FaceLandmarks[];
  confidence: number;
}

export class FaceUtils {
  private static detector: faceLandmarksDetection.FaceLandmarksDetector | null = null;
  private static isInitialized = false;

  static async initializeAI(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🤖 Initialisation de l\'IA de détection faciale...');
      
      // Initialiser TensorFlow.js
      await tf.ready();
      console.log('✅ TensorFlow.js prêt');

      // Charger le modèle MediaPipe Face Mesh
      this.detector = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: 'tfjs',
          refineLandmarks: true,
          maxFaces: 3
        }
      );

      this.isInitialized = true;
      console.log('✅ IA de détection faciale initialisée');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de l\'IA:', error);
      throw error;
    }
  }

  static async detectFaces(imageFile: File): Promise<FaceDetectionResult> {
    await this.initializeAI();
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        try {
          console.log('🔍 Détection des visages avec IA...');
          
          // Utiliser l'IA pour détecter les visages
          const predictions = await this.detector!.estimateFaces(img);
          
          const faces: FaceBox[] = [];
          const landmarks: FaceLandmarks[] = [];
          
          predictions.forEach((prediction) => {
            if (prediction.box) {
              const box: FaceBox = {
                x: prediction.box.xMin,
                y: prediction.box.yMin,
                width: prediction.box.width,
                height: prediction.box.height
              };
              
              faces.push(box);
              landmarks.push({
                keypoints: prediction.keypoints.map(kp => ({
                  x: kp.x,
                  y: kp.y,
                  z: kp.z,
                  name: kp.name
                })),
                box
              });
            }
          });

          console.log(`✅ ${faces.length} visage(s) détecté(s) avec IA`);
          
          resolve({
            faces,
            landmarks,
            confidence: faces.length > 0 ? 0.95 : 0
          });
        } catch (error) {
          console.error('❌ Erreur de détection IA:', error);
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Impossible de charger l\'image'));
      img.src = URL.createObjectURL(imageFile);
    });
  }

  static async detectFacesFromVideo(video: HTMLVideoElement): Promise<FaceDetectionResult> {
    await this.initializeAI();
    
    try {
      const predictions = await this.detector!.estimateFaces(video);
      
      const faces: FaceBox[] = [];
      const landmarks: FaceLandmarks[] = [];
      
      predictions.forEach((prediction) => {
        if (prediction.box) {
          const box: FaceBox = {
            x: prediction.box.xMin,
            y: prediction.box.yMin,
            width: prediction.box.width,
            height: prediction.box.height
          };
          
          faces.push(box);
          landmarks.push({
            keypoints: prediction.keypoints.map(kp => ({
              x: kp.x,
              y: kp.y,
              z: kp.z,
              name: kp.name
            })),
            box
          });
        }
      });

      return {
        faces,
        landmarks,
        confidence: faces.length > 0 ? 0.95 : 0
      };
    } catch (error) {
      console.error('Erreur de détection vidéo:', error);
      return { faces: [], landmarks: [], confidence: 0 };
    }
  }

  static async alignFace(imageFile: File, faceBox: FaceBox): Promise<Blob> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        canvas.width = faceBox.width;
        canvas.height = faceBox.height;
        
        ctx.drawImage(
          img,
          faceBox.x, faceBox.y, faceBox.width, faceBox.height,
          0, 0, canvas.width, canvas.height
        );
        
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/jpeg', 0.9);
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  }

  static async addWatermark(imageFile: File, text: string = "DEEPFAKE IA - DÉMONSTRATION"): Promise<Blob> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Add watermark with AI indicator
        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.fillRect(10, 10, 350, 40);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(text, 20, 35);
        
        // Add AI detection indicator
        ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.fillRect(10, 60, 200, 25);
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText('🤖 IA ACTIVÉE', 15, 77);
        
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/jpeg', 0.9);
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  }

  static drawFaceLandmarks(
    ctx: CanvasRenderingContext2D, 
    landmarks: FaceLandmarks[],
    showDetails: boolean = true
  ): void {
    landmarks.forEach((face, faceIndex) => {
      // Dessiner la boîte englobante
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.strokeRect(face.box.x, face.box.y, face.box.width, face.box.height);
      
      // Label du visage
      ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
      ctx.fillRect(face.box.x, face.box.y - 25, 120, 20);
      ctx.fillStyle = 'black';
      ctx.font = '12px Arial';
      ctx.fillText(`Visage ${faceIndex + 1} (IA)`, face.box.x + 5, face.box.y - 10);
      
      if (showDetails) {
        // Dessiner les points clés du visage
        ctx.fillStyle = '#ff0000';
        face.keypoints.forEach((point, index) => {
          // Ne dessiner que certains points clés importants
          if (index % 3 === 0) { // Réduire la densité pour la lisibilité
            ctx.beginPath();
            ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
            ctx.fill();
          }
        });
        
        // Dessiner les contours des yeux
        this.drawEyeContours(ctx, face.keypoints);
        
        // Dessiner le contour des lèvres
        this.drawLipContours(ctx, face.keypoints);
      }
    });
  }

  private static drawEyeContours(ctx: CanvasRenderingContext2D, keypoints: any[]): void {
    // Contours simplifiés des yeux (indices MediaPipe)
    const leftEyeIndices = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
    const rightEyeIndices = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];
    
    ctx.strokeStyle = '#0080ff';
    ctx.lineWidth = 1;
    
    // Dessiner l'œil gauche
    this.drawContour(ctx, keypoints, leftEyeIndices);
    
    // Dessiner l'œil droit
    this.drawContour(ctx, keypoints, rightEyeIndices);
  }

  private static drawLipContours(ctx: CanvasRenderingContext2D, keypoints: any[]): void {
    // Contours des lèvres (indices MediaPipe)
    const lipIndices = [61, 84, 17, 314, 405, 320, 307, 375, 321, 308, 324, 318];
    
    ctx.strokeStyle = '#ff8000';
    ctx.lineWidth = 1;
    
    this.drawContour(ctx, keypoints, lipIndices);
  }

  private static drawContour(ctx: CanvasRenderingContext2D, keypoints: any[], indices: number[]): void {
    if (indices.length < 2) return;
    
    ctx.beginPath();
    indices.forEach((index, i) => {
      if (keypoints[index]) {
        if (i === 0) {
          ctx.moveTo(keypoints[index].x, keypoints[index].y);
        } else {
          ctx.lineTo(keypoints[index].x, keypoints[index].y);
        }
      }
    });
    ctx.closePath();
    ctx.stroke();
  }
}
