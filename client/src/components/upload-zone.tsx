import { useCallback, useState } from "react";
import { CloudUpload, User, Music, Image, FileAudio, Camera } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UploadZoneProps {
  onFileSelect: (file: File, type: 'image' | 'audio') => void;
  accept?: string;
  placeholder?: string;
  subtext?: string;
  icon?: "upload" | "user" | "audio" | "image";
  type?: 'image' | 'audio' | 'both';
}

export function UploadZone({ 
  onFileSelect, 
  accept = "image/*,audio/*", 
  placeholder = "Glisser photos (JPG, PNG) ou audio (MP3, WAV)",
  subtext = "Photos jusqu'à 20MB, Audio jusqu'à 50MB",
  icon = "upload",
  type = "both"
}: UploadZoneProps) {
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const validateFile = (file: File): { valid: boolean; type: 'image' | 'audio' | null; error?: string } => {
    // Validation pour les images
    if (file.type.startsWith('image/')) {
      const supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!supportedImageTypes.includes(file.type)) {
        return { valid: false, type: null, error: 'Format d\'image non supporté. Utilisez JPG, PNG ou WebP.' };
      }
      if (file.size > 20 * 1024 * 1024) { // 20MB
        return { valid: false, type: null, error: 'L\'image est trop volumineuse. Maximum 20MB.' };
      }
      return { valid: true, type: 'image' };
    }
    
    // Validation pour l'audio
    if (file.type.startsWith('audio/')) {
      const supportedAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/mp4', 'audio/m4a', 'audio/ogg'];
      if (!supportedAudioTypes.includes(file.type)) {
        return { valid: false, type: null, error: 'Format audio non supporté. Utilisez MP3, WAV, M4A ou OGG.' };
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB
        return { valid: false, type: null, error: 'Le fichier audio est trop volumineux. Maximum 50MB.' };
      }
      return { valid: true, type: 'audio' };
    }
    
    return { valid: false, type: null, error: 'Type de fichier non supporté.' };
  };

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const validation = validateFile(file);
    
    if (!validation.valid) {
      setUploadError(validation.error || 'Fichier invalide');
      return;
    }

    if (validation.type && (type === 'both' || type === validation.type)) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simuler progression d'upload
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            onFileSelect(file, validation.type!);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    } else {
      setUploadError(`Ce composant accepte seulement les fichiers de type ${type}`);
    }
  }, [onFileSelect, type]);

  const handleDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    setUploadError(null);
    const validation = validateFile(file);
    
    if (!validation.valid) {
      setUploadError(validation.error || 'Fichier invalide');
      return;
    }

    if (validation.type && (type === 'both' || type === validation.type)) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simuler progression d'upload
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            onFileSelect(file, validation.type!);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    } else {
      setUploadError(`Ce composant accepte seulement les fichiers de type ${type}`);
    }
  }, [onFileSelect, type]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const getIcon = () => {
    switch (icon) {
      case "user": return User;
      case "audio": return Music;
      case "image": return Image;
      default: return CloudUpload;
    }
  };

  const IconComponent = getIcon();
  const inputId = `file-input-${Math.random()}`;

  const getAcceptString = () => {
    if (type === 'image') return 'image/jpeg,image/jpg,image/png,image/webp';
    if (type === 'audio') return 'audio/mpeg,audio/mp3,audio/wav,audio/mp4,audio/m4a,audio/ogg';
    return 'image/jpeg,image/jpg,image/png,image/webp,audio/mpeg,audio/mp3,audio/wav,audio/mp4,audio/m4a,audio/ogg';
  };

  return (
    <div className="space-y-2">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          uploadError ? 'border-red-300 bg-red-50' : 
          isUploading ? 'border-blue-300 bg-blue-50' :
          'border-slate-300 hover:border-primary'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById(inputId)?.click()}
      >
        <div className="flex justify-center space-x-2 mb-3">
          <IconComponent className="h-8 w-8 text-slate-400" />
          {type === 'both' && (
            <>
              <Camera className="h-6 w-6 text-slate-300" />
              <FileAudio className="h-6 w-6 text-slate-300" />
            </>
          )}
        </div>
        
        <p className="text-sm text-slate-600 font-medium">{placeholder}</p>
        <p className="text-xs text-slate-500 mt-2">{subtext}</p>
        
        {type === 'both' && (
          <div className="mt-3 text-xs text-slate-400">
            <span className="inline-block bg-slate-100 px-2 py-1 rounded mr-2">Photos: JPG, PNG, WebP</span>
            <span className="inline-block bg-slate-100 px-2 py-1 rounded">Audio: MP3, WAV, M4A</span>
          </div>
        )}
        
        <input
          id={inputId}
          type="file"
          accept={getAcceptString()}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      
      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-slate-500 text-center">Upload en cours... {uploadProgress}%</p>
        </div>
      )}
      
      {uploadError && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
          {uploadError}
        </div>
      )}
    </div>
  );
}
