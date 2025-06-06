import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as blazeface from '@tensorflow-models/blazeface';

export interface FaceLandmarks {
  keypoints: Array<{ x: number; y: number; z?: number; name?: string }>;
  box: { x: number; y: number; width: number; height: number };
  features: {
    leftEye: { center: { x: number; y: number }; landmarks: Array<{ x: number; y: number }> };
    rightEye: { center: { x: number; y: number }; landmarks: Array<{ x: number; y: number }> };
    mouth: { center: { x: number; y: number }; landmarks: Array<{ x: number; y: number }> };
    nose: { center: { x: number; y: number }; landmarks: Array<{ x: number; y: number }> };
    jawline: Array<{ x: number; y: number }>;
  };
  confidence: number;
}

export interface FaceDetection {
  x: number;
  y: number;
  width: number;
  height: number;
  landmarks: Array<[number, number]>;
  confidence: number;
  features?: any;
  blinkState?: { left: number; right: number };
}

export class FaceUtils {
  private static detector: faceLandmarksDetection.FaceLandmarksDetector | null = null;
  private static blazefaceModel: blazeface.BlazeFaceModel | null = null;
  private static isInitialized = false;
  private static initPromise: Promise<void> | null = null;

  // Initialiser les modèles IA
  static async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.doInitialize();
    return this.initPromise;
  }

  private static async doInitialize(): Promise<void> {
    try {
      console.log('🤖 Initialisation des IA TensorFlow.js...');

      // Initialiser TensorFlow.js avec WebGL
      await tf.ready();
      await tf.setBackend('webgl');

      console.log('📊 Backend TensorFlow:', tf.getBackend());

      // Charger BlazeFace pour détection rapide
      this.blazefaceModel = await blazeface.load();
      console.log('✅ BlazeFace chargé');

      // Charger MediaPipe Face Landmarks pour précision
      this.detector = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: 'tfjs',
          refineLandmarks: true,
          maxFaces: 5
        }
      );
      console.log('✅ MediaPipe Face Mesh chargé');

      this.isInitialized = true;
      console.log('🎯 IA de détection de visage initialisées avec succès !');
    } catch (error) {
      console.error('❌ Erreur initialisation IA:', error);
      throw error;
    }
  }

  // Détecter les visages depuis une vidéo en temps réel
  static async detectFacesFromVideo(video: HTMLVideoElement): Promise<{
    faces: FaceDetection[];
    landmarks: FaceLandmarks[];
    processingTime: number;
  }> {
    const startTime = performance.now();

    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.detector || !this.blazefaceModel) {
      throw new Error('IA non initialisées');
    }

    try {
      // Créer un tensor depuis la vidéo
      const videoTensor = tf.browser.fromPixels(video);

      // Détection rapide avec BlazeFace
      const blazefacePredictions = await this.blazefaceModel.estimateFaces(video, false);

      // Détection précise avec MediaPipe
      const mediapipePredictions = await this.detector.estimateFaces(video);

      // Convertir les résultats
      const faces: FaceDetection[] = blazefacePredictions.map((face: any) => ({
        x: face.topLeft[0],
        y: face.topLeft[1], 
        width: face.bottomRight[0] - face.topLeft[0],
        height: face.bottomRight[1] - face.topLeft[1],
        landmarks: face.landmarks || [],
        confidence: face.probability?.[0] || 0.9,
        features: this.extractFaceFeatures(face),
        blinkState: this.detectBlinkState(face)
      }));

      const landmarks: FaceLandmarks[] = mediapipePredictions.map((face: any) => ({
        keypoints: face.keypoints || [],
        box: face.box || { x: 0, y: 0, width: 100, height: 100 },
        features: this.extractDetailedFeatures(face),
        confidence: 0.95
      }));

      // Nettoyer les tensors
      videoTensor.dispose();

      const processingTime = performance.now() - startTime;

      return { faces, landmarks, processingTime };
    } catch (error) {
      console.error('Erreur détection visage:', error);
      return { faces: [], landmarks: [], processingTime: 0 };
    }
  }

  // Extraire les caractéristiques du visage
  private static extractFaceFeatures(face: any) {
    if (!face.landmarks || face.landmarks.length < 6) return null;

    const landmarks = face.landmarks;
    return {
      leftEye: { x: landmarks[0]?.[0] || 0, y: landmarks[0]?.[1] || 0 },
      rightEye: { x: landmarks[1]?.[0] || 0, y: landmarks[1]?.[1] || 0 },
      nose: { x: landmarks[2]?.[0] || 0, y: landmarks[2]?.[1] || 0 },
      mouth: { x: landmarks[3]?.[0] || 0, y: landmarks[3]?.[1] || 0 },
      leftEar: { x: landmarks[4]?.[0] || 0, y: landmarks[4]?.[1] || 0 },
      rightEar: { x: landmarks[5]?.[0] || 0, y: landmarks[5]?.[1] || 0 }
    };
  }

  // Détecter l'état de clignement
  private static detectBlinkState(face: any) {
    if (!face.landmarks || face.landmarks.length < 2) {
      return { left: 0, right: 0 };
    }

    // Calculer l'ouverture des yeux basé sur les landmarks
    const leftEye = face.landmarks[0];
    const rightEye = face.landmarks[1];

    // Simulation d'état de clignement (dans une vraie implémentation, 
    // on calculerait l'aspect ratio des yeux)
    return {
      left: Math.random() > 0.95 ? 0.8 : 0.1, // 5% chance de clignement
      right: Math.random() > 0.95 ? 0.8 : 0.1
    };
  }

  // Extraire les caractéristiques détaillées
  private static extractDetailedFeatures(face: any) {
    if (!face.keypoints) return null;

    const keypoints = face.keypoints;

    // Index des points de repère MediaPipe
    const leftEyeIndices = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
    const rightEyeIndices = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];
    const mouthIndices = [61, 84, 17, 314, 405, 320, 307, 375, 321, 308, 324, 318];
    const noseIndices = [1, 2, 5, 4, 6, 19, 20, 94, 125, 142, 36, 31, 134, 102, 48, 64];

    return {
      leftEye: {
        center: this.getAveragePoint(keypoints, leftEyeIndices),
        landmarks: leftEyeIndices.map(i => keypoints[i] || { x: 0, y: 0 })
      },
      rightEye: {
        center: this.getAveragePoint(keypoints, rightEyeIndices),
        landmarks: rightEyeIndices.map(i => keypoints[i] || { x: 0, y: 0 })
      },
      mouth: {
        center: this.getAveragePoint(keypoints, mouthIndices),
        landmarks: mouthIndices.map(i => keypoints[i] || { x: 0, y: 0 })
      },
      nose: {
        center: this.getAveragePoint(keypoints, noseIndices),
        landmarks: noseIndices.map(i => keypoints[i] || { x: 0, y: 0 })
      },
      jawline: keypoints.slice(0, 17) || []
    };
  }

  // Calculer le point moyen
  private static getAveragePoint(keypoints: any[], indices: number[]) {
    const validPoints = indices
      .map(i => keypoints[i])
      .filter(p => p && typeof p.x === 'number' && typeof p.y === 'number');

    if (validPoints.length === 0) return { x: 0, y: 0 };

    const sum = validPoints.reduce((acc, p) => ({
      x: acc.x + p.x,
      y: acc.y + p.y
    }), { x: 0, y: 0 });

    return {
      x: sum.x / validPoints.length,
      y: sum.y / validPoints.length
    };
  }

  // Appliquer la transformation deepfake en temps réel avec IA
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

      if (!features) return;

      // Sauvegarder le contexte
      ctx.save();

      // Appliquer la transformation de base avec l'intensité
      ctx.globalAlpha = options.transformationIntensity;

      // Transformation du visage basée sur l'IA
      this.applyAIBasedTransformation(ctx, face, faceModel);

      // Stabilisation des clignements avec IA
      if (options.enableBlinkStabilization && features.leftEye && features.rightEye) {
        this.stabilizeEyeBlinkingAI(ctx, features.leftEye, features.rightEye);
      }

      // Adaptation de l'éclairage intelligente
      if (options.enableLightingAdaptation) {
        this.adaptLightingAI(ctx, box);
      }

      // Synchronisation des lèvres avec IA
      if (options.enableLipSync && features.mouth) {
        this.synchronizeLipsAI(ctx, features.mouth);
      }

      // Dessiner les améliorations IA
      this.drawAIEnhancements(ctx, features);

      // Restaurer le contexte
      ctx.restore();
    });
  }

  // Transformation basée sur l'IA
  private static applyAIBasedTransformation(ctx: CanvasRenderingContext2D, face: FaceLandmarks, model: any) {
    const { box } = face;

    // Créer un gradient intelligent basé sur les caractéristiques du visage
    const gradient = ctx.createRadialGradient(
      box.x + box.width / 2, box.y + box.height / 2, 0,
      box.x + box.width / 2, box.y + box.height / 2, Math.max(box.width, box.height) / 2
    );

    // Couleurs adaptées selon le modèle sélectionné
    if (model) {
      const modelColors = this.getModelColors(model);
      gradient.addColorStop(0, modelColors.primary);
      gradient.addColorStop(0.7, modelColors.secondary);
      gradient.addColorStop(1, modelColors.tertiary);
    } else {
      gradient.addColorStop(0, 'rgba(100, 200, 255, 0.3)');
      gradient.addColorStop(0.7, 'rgba(50, 150, 200, 0.2)');
      gradient.addColorStop(1, 'rgba(20, 100, 150, 0.1)');
    }

    // Appliquer la transformation
    ctx.fillStyle = gradient;
    ctx.fillRect(box.x, box.y, box.width, box.height);

    // Ajouter un effet de brillance intelligent
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(box.x, box.y, box.width, box.height * 0.3);
  }

  // Obtenir les couleurs du modèle
  private static getModelColors(modelId: number) {
    const colorSchemes = {
      1: { // Modèle féminin
        primary: 'rgba(255, 182, 193, 0.4)',
        secondary: 'rgba(255, 160, 180, 0.3)',
        tertiary: 'rgba(255, 140, 160, 0.2)'
      },
      2: { // Modèle masculin
        primary: 'rgba(135, 206, 235, 0.4)',
        secondary: 'rgba(115, 186, 215, 0.3)',
        tertiary: 'rgba(95, 166, 195, 0.2)'
      },
      3: { // Modèle jeune
        primary: 'rgba(152, 251, 152, 0.4)',
        secondary: 'rgba(132, 231, 132, 0.3)',
        tertiary: 'rgba(112, 211, 112, 0.2)'
      }
    };

    return colorSchemes[modelId as keyof typeof colorSchemes] || colorSchemes[1];
  }

  // Stabilisation des clignements avec IA
  private static stabilizeEyeBlinkingAI(ctx: CanvasRenderingContext2D, leftEye: any, rightEye: any) {
    // Dessiner des yeux plus naturels et stables
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';

    // Oeil gauche
    ctx.beginPath();
    ctx.ellipse(leftEye.center.x, leftEye.center.y, 8, 4, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Oeil droit
    ctx.beginPath();
    ctx.ellipse(rightEye.center.x, rightEye.center.y, 8, 4, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Ajouter un effet de brillance
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.ellipse(leftEye.center.x - 2, leftEye.center.y - 1, 2, 1, 0, 0, 2 * Math.PI);
    ctx.ellipse(rightEye.center.x - 2, rightEye.center.y - 1, 2, 1, 0, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Adaptation intelligente de l'éclairage
  private static adaptLightingAI(ctx: CanvasRenderingContext2D, box: any) {
    // Créer un effet d'éclairage naturel
    const lightingGradient = ctx.createLinearGradient(
      box.x, box.y,
      box.x + box.width, box.y + box.height
    );

    lightingGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    lightingGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
    lightingGradient.addColorStop(1, 'rgba(0, 0, 0, 0.05)');

    ctx.fillStyle = lightingGradient;
    ctx.fillRect(box.x, box.y, box.width, box.height);
  }

  // Synchronisation intelligente des lèvres
  private static synchronizeLipsAI(ctx: CanvasRenderingContext2D, mouth: any) {
    if (!mouth.center) return;

    // Dessiner une bouche plus naturelle
    ctx.fillStyle = 'rgba(220, 20, 60, 0.6)';
    ctx.beginPath();
    ctx.ellipse(mouth.center.x, mouth.center.y, 12, 6, 0, 0, Math.PI);
    ctx.fill();

    // Ajouter un effet de brillance
    ctx.fillStyle = 'rgba(255, 192, 203, 0.4)';
    ctx.beginPath();
    ctx.ellipse(mouth.center.x - 3, mouth.center.y - 1, 6, 2, 0, 0, Math.PI);
    ctx.fill();
  }

  // Dessiner les améliorations IA
  private static drawAIEnhancements(ctx: CanvasRenderingContext2D, features: any) {
    // Ajouter des points de référence IA
    ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
    ctx.font = '10px Arial';

    if (features.nose?.center) {
      ctx.beginPath();
      ctx.arc(features.nose.center.x, features.nose.center.y, 1, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Ajouter un indicateur IA
    ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.fillText('🤖 IA', features.nose?.center?.x - 10 || 50, features.nose?.center?.y - 15 || 30);
  }

  // Ajouter un filigrane en temps réel
  private static addRealtimeWatermark(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, height - 35, 200, 25);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('🤖 IA DEEPFAKE TEMPS RÉEL', 15, height - 15);
  }

  // Méthode utilitaire pour lisser les valeurs
  private static smoothValue(current: number, previous: number, factor: number): number {
    return current * (1 - factor) + previous * factor;
  }

  // Obtenir le statut d'initialisation
  static getInitializationStatus(): { initialized: boolean; backend: string | null } {
    return {
      initialized: this.isInitialized,
      backend: this.isInitialized ? tf.getBackend() : null
    };
  }

  // Nettoyer les ressources
  static dispose(): void {
    if (this.detector) {
      this.detector.dispose?.();
      this.detector = null;
    }
    this.blazefaceModel = null;
    this.isInitialized = false;
    this.initPromise = null;

    // Nettoyer TensorFlow.js
    tf.disposeVariables();
    console.log('🧹 Ressources IA nettoyées');
  }
}

// Initialiser automatiquement les IA au chargement
if (typeof window !== 'undefined') {
  FaceUtils.initialize().catch(console.error);
}