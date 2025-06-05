export interface FaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FaceDetectionResult {
  faces: FaceBox[];
  confidence: number;
}

export class FaceUtils {
  static async detectFaces(imageFile: File): Promise<FaceDetectionResult> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Simulate face detection with mock data
        const mockFaces: FaceBox[] = [
          {
            x: img.width * 0.25,
            y: img.height * 0.15,
            width: img.width * 0.5,
            height: img.height * 0.6,
          }
        ];

        resolve({
          faces: mockFaces,
          confidence: 0.95,
        });
      };
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

  static async addWatermark(imageFile: File, text: string = "ÉDUCATIF - DÉMONSTRATION"): Promise<Blob> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Add watermark
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 300, 40);
        
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText(text, 20, 35);
        
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/jpeg', 0.9);
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  }
}
