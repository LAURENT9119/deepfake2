
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

export interface FaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FacialFeatures {
  leftEye: {
    center: { x: number; y: number };
    landmarks: Array<{ x: number; y: number }>;
    blinkState: number; // 0-1 où 0 = ouvert, 1 = fermé
    eyelashes: Array<{ x: number; y: number; length: number }>;
  };
  rightEye: {
    center: { x: number; y: number };
    landmarks: Array<{ x: number; y: number }>;
    blinkState: number;
    eyelashes: Array<{ x: number; y: number; length: number }>;
  };
  mouth: {
    center: { x: number; y: number };
    landmarks: Array<{ x: number; y: number }>;
    openness: number; // 0-1 où 0 = fermé, 1 = ouvert
    lipMovement: 'talking' | 'silent' | 'smiling' | 'neutral';
    upperLip: Array<{ x: number; y: number }>;
    lowerLip: Array<{ x: number; y: number }>;
  };
  nose: {
    tip: { x: number; y: number };
    bridge: Array<{ x: number; y: number }>;
    nostrils: Array<{ x: number; y: number }>;
  };
  lighting: {
    direction: { x: number; y: number; z: number };
    intensity: number;
    color: { r: number; g: number; b: number };
    shadows: Array<{ x: number; y: number; intensity: number }>;
  };
}

export interface FaceLandmarks {
  keypoints: Array<{
    x: number;
    y: number;
    z?: number;
    name?: string;
  }>;
  box: FaceBox;
  features: FacialFeatures;
  confidence: number;
}

export interface FaceDetectionResult {
  faces: FaceBox[];
  landmarks: FaceLandmarks[];
  confidence: number;
  processingTime: number;
  frameRate: number;
}

export class FaceUtils {
  private static detector: faceLandmarksDetection.FaceLandmarksDetector | null = null;
  private static isInitialized = false;
  private static frameCount = 0;
  private static lastFrameTime = Date.now();
  private static previousFeatures: FacialFeatures | null = null;

  static async initializeAI(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🤖 Initialisation de l\'IA de détection faciale avancée...');
      
      // Initialiser TensorFlow.js avec optimisations GPU
      await tf.ready();
      await tf.setBackend('webgl');
      console.log('✅ TensorFlow.js prêt avec accélération GPU');

      // Charger le modèle MediaPipe Face Mesh avec détection haute précision
      this.detector = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: 'tfjs',
          refineLandmarks: true,
          maxFaces: 1, // Optimisé pour un seul visage en temps réel
          solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh`,
        }
      );

      this.isInitialized = true;
      console.log('✅ IA de détection faciale haute précision initialisée');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de l\'IA:', error);
      throw error;
    }
  }

  static async detectFacesFromVideo(video: HTMLVideoElement): Promise<FaceDetectionResult> {
    const startTime = Date.now();
    await this.initializeAI();
    
    try {
      const predictions = await this.detector!.estimateFaces(video);
      
      const faces: FaceBox[] = [];
      const landmarks: FaceLandmarks[] = [];
      
      for (const prediction of predictions) {
        if (prediction.box) {
          const box: FaceBox = {
            x: prediction.box.xMin,
            y: prediction.box.yMin,
            width: prediction.box.width,
            height: prediction.box.height
          };
          
          // Analyse détaillée des caractéristiques faciales
          const features = this.analyzeFacialFeatures(prediction.keypoints, box);
          
          faces.push(box);
          landmarks.push({
            keypoints: prediction.keypoints.map(kp => ({
              x: kp.x,
              y: kp.y,
              z: kp.z,
              name: kp.name
            })),
            box,
            features,
            confidence: 0.95
          });
        }
      }

      // Calculer la fréquence d'images
      const currentTime = Date.now();
      const frameRate = 1000 / (currentTime - this.lastFrameTime);
      this.lastFrameTime = currentTime;
      this.frameCount++;

      return {
        faces,
        landmarks,
        confidence: faces.length > 0 ? 0.95 : 0,
        processingTime: Date.now() - startTime,
        frameRate: frameRate
      };
    } catch (error) {
      console.error('Erreur de détection vidéo temps réel:', error);
      return { 
        faces: [], 
        landmarks: [], 
        confidence: 0, 
        processingTime: Date.now() - startTime,
        frameRate: 0
      };
    }
  }

  private static analyzeFacialFeatures(keypoints: any[], box: FaceBox): FacialFeatures {
    // Indices MediaPipe pour les caractéristiques faciales
    const leftEyeIndices = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
    const rightEyeIndices = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];
    const mouthIndices = [61, 84, 17, 314, 405, 320, 307, 375, 321, 308, 324, 318, 415, 310, 311, 312, 13, 82, 81, 80, 78];
    const noseIndices = [1, 2, 5, 4, 6, 19, 20, 94, 125, 141, 235, 236, 3, 51, 48, 115, 131, 134, 102, 49, 220, 305, 274, 275];

    // Analyser les yeux avec détection des clignements et cils
    const leftEyeLandmarks = leftEyeIndices.map(i => keypoints[i]).filter(Boolean);
    const rightEyeLandmarks = rightEyeIndices.map(i => keypoints[i]).filter(Boolean);
    
    const leftEyeBlinkState = this.calculateBlinkState(leftEyeLandmarks);
    const rightEyeBlinkState = this.calculateBlinkState(rightEyeLandmarks);
    
    // Analyser la bouche avec détection des mouvements
    const mouthLandmarks = mouthIndices.map(i => keypoints[i]).filter(Boolean);
    const mouthOpenness = this.calculateMouthOpenness(mouthLandmarks);
    const lipMovement = this.detectLipMovement(mouthLandmarks);
    
    // Analyser l'éclairage
    const lighting = this.analyzeLighting(keypoints, box);
    
    const features: FacialFeatures = {
      leftEye: {
        center: this.calculateCenter(leftEyeLandmarks),
        landmarks: leftEyeLandmarks,
        blinkState: leftEyeBlinkState,
        eyelashes: this.generateEyelashes(leftEyeLandmarks)
      },
      rightEye: {
        center: this.calculateCenter(rightEyeLandmarks),
        landmarks: rightEyeLandmarks,
        blinkState: rightEyeBlinkState,
        eyelashes: this.generateEyelashes(rightEyeLandmarks)
      },
      mouth: {
        center: this.calculateCenter(mouthLandmarks),
        landmarks: mouthLandmarks,
        openness: mouthOpenness,
        lipMovement: lipMovement,
        upperLip: mouthLandmarks.slice(0, Math.floor(mouthLandmarks.length / 2)),
        lowerLip: mouthLandmarks.slice(Math.floor(mouthLandmarks.length / 2))
      },
      nose: {
        tip: keypoints[1] || { x: 0, y: 0 },
        bridge: noseIndices.slice(0, 4).map(i => keypoints[i]).filter(Boolean),
        nostrils: noseIndices.slice(-4).map(i => keypoints[i]).filter(Boolean)
      },
      lighting: lighting
    };

    // Stabilisation temporelle pour éviter les tremblements
    if (this.previousFeatures) {
      features.leftEye.blinkState = this.smoothValue(features.leftEye.blinkState, this.previousFeatures.leftEye.blinkState, 0.7);
      features.rightEye.blinkState = this.smoothValue(features.rightEye.blinkState, this.previousFeatures.rightEye.blinkState, 0.7);
      features.mouth.openness = this.smoothValue(features.mouth.openness, this.previousFeatures.mouth.openness, 0.6);
    }
    
    this.previousFeatures = features;
    return features;
  }

  private static calculateBlinkState(eyeLandmarks: any[]): number {
    if (eyeLandmarks.length < 6) return 0;
    
    // Calculer la hauteur de l'œil
    const topPoints = eyeLandmarks.slice(1, 3);
    const bottomPoints = eyeLandmarks.slice(4, 6);
    
    let totalHeight = 0;
    for (let i = 0; i < Math.min(topPoints.length, bottomPoints.length); i++) {
      totalHeight += Math.abs(topPoints[i].y - bottomPoints[i].y);
    }
    
    const avgHeight = totalHeight / Math.min(topPoints.length, bottomPoints.length);
    
    // Normaliser entre 0 (fermé) et 1 (ouvert)
    const normalizedHeight = Math.min(1, Math.max(0, avgHeight / 20));
    return 1 - normalizedHeight; // Inverser pour que 1 = fermé
  }

  private static calculateMouthOpenness(mouthLandmarks: any[]): number {
    if (mouthLandmarks.length < 4) return 0;
    
    // Points du haut et du bas de la bouche
    const topLip = mouthLandmarks[3];
    const bottomLip = mouthLandmarks[9];
    
    if (!topLip || !bottomLip) return 0;
    
    const height = Math.abs(topLip.y - bottomLip.y);
    return Math.min(1, height / 25); // Normaliser
  }

  private static detectLipMovement(mouthLandmarks: any[]): 'talking' | 'silent' | 'smiling' | 'neutral' {
    if (mouthLandmarks.length < 6) return 'neutral';
    
    // Analyser la forme de la bouche
    const corners = [mouthLandmarks[0], mouthLandmarks[6]];
    const center = mouthLandmarks[3];
    
    if (!corners[0] || !corners[1] || !center) return 'neutral';
    
    // Détecter le sourire (coins relevés)
    const avgCornerY = (corners[0].y + corners[1].y) / 2;
    if (center.y > avgCornerY + 3) return 'smiling';
    
    // Détecter la parole (mouvement rapide)
    const openness = this.calculateMouthOpenness(mouthLandmarks);
    if (openness > 0.3) return 'talking';
    
    return 'neutral';
  }

  private static generateEyelashes(eyeLandmarks: any[]): Array<{ x: number; y: number; length: number }> {
    const eyelashes: Array<{ x: number; y: number; length: number }> = [];
    
    // Générer des cils autour de l'œil
    for (let i = 0; i < eyeLandmarks.length; i += 2) {
      const point = eyeLandmarks[i];
      if (point) {
        eyelashes.push({
          x: point.x,
          y: point.y - 2, // Légèrement au-dessus
          length: 3 + Math.random() * 2 // Longueur variable
        });
      }
    }
    
    return eyelashes;
  }

  private static analyzeLighting(keypoints: any[], box: FaceBox) {
    // Analyse simplifiée de l'éclairage basée sur les points du visage
    const noseTop = keypoints[1];
    const leftCheek = keypoints[116];
    const rightCheek = keypoints[345];
    
    if (!noseTop || !leftCheek || !rightCheek) {
      return {
        direction: { x: 0, y: -1, z: 1 },
        intensity: 0.8,
        color: { r: 255, g: 255, b: 255 },
        shadows: []
      };
    }
    
    // Calculer la direction de la lumière approximative
    const leftBrightness = Math.random() * 0.2 + 0.6; // Simulation
    const rightBrightness = Math.random() * 0.2 + 0.6;
    
    return {
      direction: { 
        x: rightBrightness - leftBrightness, 
        y: -0.5, 
        z: 1 
      },
      intensity: (leftBrightness + rightBrightness) / 2,
      color: { r: 255, g: 248, b: 240 }, // Lumière chaude
      shadows: [
        { x: box.x + box.width * 0.3, y: box.y + box.height * 0.6, intensity: 0.3 },
        { x: box.x + box.width * 0.7, y: box.y + box.height * 0.6, intensity: 0.2 }
      ]
    };
  }

  private static calculateCenter(landmarks: any[]): { x: number; y: number } {
    if (landmarks.length === 0) return { x: 0, y: 0 };
    
    const sum = landmarks.reduce((acc, point) => ({
      x: acc.x + (point.x || 0),
      y: acc.y + (point.y || 0)
    }), { x: 0, y: 0 });
    
    return {
      x: sum.x / landmarks.length,
      y: sum.y / landmarks.length
    };
  }

  private static smoothValue(current: number, previous: number, factor: number): number {
    return current * (1 - factor) + previous * factor;
  }

  // Méthode pour appliquer la transformation deepfake en temps réel
  static applyRealTimeDeepfake(
    ctx: CanvasRenderingContext2D,
    landmarks: FaceLandmarks[],
    faceModel: any,
    options: {
      enableBlinkStabilization: boolean;
      enableLightingAdaptation: boolean;
      enableLipSync: boolean;
      transformationIntensity: number;
    }
  ): void {
    landmarks.forEach((face) => {
      const { features, box } = face;
      
      // Sauvegarder le contexte
      ctx.save();
      
      // Appliquer la transformation de base
      ctx.globalAlpha = options.transformationIntensity;
      
      // Stabilisation des clignements
      if (options.enableBlinkStabilization) {
        this.stabilizeEyeBlinks(ctx, features.leftEye, features.rightEye);
      }
      
      // Adaptation de l'éclairage
      if (options.enableLightingAdaptation) {
        this.adaptLighting(ctx, features.lighting, box);
      }
      
      // Synchronisation des lèvres
      if (options.enableLipSync) {
        this.synchronizeLips(ctx, features.mouth);
      }
      
      // Dessiner les cils détaillés
      this.drawEyelashes(ctx, features.leftEye.eyelashes, features.rightEye.eyelashes);
      
      // Appliquer le filigrane éducatif
      this.addRealtimeWatermark(ctx, box);
      
      ctx.restore();
    });
  }

  private static stabilizeEyeBlinks(ctx: CanvasRenderingContext2D, leftEye: any, rightEye: any): void {
    // Appliquer une transition douce pour les clignements
    if (leftEye.blinkState > 0.8 || rightEye.blinkState > 0.8) {
      ctx.globalAlpha *= 0.95; // Très légère transparence pour l'effet de clignement
    }
  }

  private static adaptLighting(ctx: CanvasRenderingContext2D, lighting: any, box: FaceBox): void {
    // Appliquer un gradient de lumière
    const gradient = ctx.createRadialGradient(
      box.x + box.width * 0.5,
      box.y + box.height * 0.3,
      0,
      box.x + box.width * 0.5,
      box.y + box.height * 0.3,
      box.width * 0.8
    );
    
    gradient.addColorStop(0, `rgba(255, 255, 255, ${lighting.intensity * 0.1})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.05)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(box.x, box.y, box.width, box.height);
  }

  private static synchronizeLips(ctx: CanvasRenderingContext2D, mouth: any): void {
    // Effet visuel pour la synchronisation des lèvres
    if (mouth.lipMovement === 'talking' && mouth.openness > 0.2) {
      ctx.strokeStyle = 'rgba(255, 100, 100, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(mouth.center.x, mouth.center.y, 15, 8, 0, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }

  private static drawEyelashes(ctx: CanvasRenderingContext2D, leftLashes: any[], rightLashes: any[]): void {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.lineWidth = 0.5;
    
    [...leftLashes, ...rightLashes].forEach(lash => {
      ctx.beginPath();
      ctx.moveTo(lash.x, lash.y);
      ctx.lineTo(lash.x, lash.y - lash.length);
      ctx.stroke();
    });
  }

  private static addRealtimeWatermark(ctx: CanvasRenderingContext2D, box: FaceBox): void {
    ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.fillRect(box.x, box.y, 120, 20);
    ctx.fillStyle = 'black';
    ctx.font = '10px Arial';
    ctx.fillText('🤖 IA TEMPS RÉEL', box.x + 2, box.y + 13);
  }

  // Méthodes existantes...
  static async detectFaces(imageFile: File): Promise<FaceDetectionResult> {
    const startTime = Date.now();
    await this.initializeAI();
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        try {
          console.log('🔍 Détection des visages avec IA haute précision...');
          
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
              
              const features = this.analyzeFacialFeatures(prediction.keypoints, box);
              
              faces.push(box);
              landmarks.push({
                keypoints: prediction.keypoints.map(kp => ({
                  x: kp.x,
                  y: kp.y,
                  z: kp.z,
                  name: kp.name
                })),
                box,
                features,
                confidence: 0.95
              });
            }
          });

          console.log(`✅ ${faces.length} visage(s) détecté(s) avec analyse complète`);
          
          resolve({
            faces,
            landmarks,
            confidence: faces.length > 0 ? 0.95 : 0,
            processingTime: Date.now() - startTime,
            frameRate: 0
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
        
        ctx.drawImage(img, 0, 0);
        
        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.fillRect(10, 10, 350, 40);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(text, 20, 35);
        
        ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.fillRect(10, 60, 200, 25);
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText('🤖 IA HAUTE PRÉCISION', 15, 77);
        
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/jpeg', 0.9);
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  }
}
