import { useCallback } from "react";
import { CloudUpload, User } from "lucide-react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  placeholder?: string;
  subtext?: string;
  icon?: "upload" | "user";
}

export function UploadZone({ 
  onFileSelect, 
  accept = "image/*", 
  placeholder = "Glisser ou cliquer pour télécharger",
  subtext = "JPG, PNG jusqu'à 10MB",
  icon = "upload"
}: UploadZoneProps) {
  
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const IconComponent = icon === "upload" ? CloudUpload : User;

  return (
    <div
      className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById(`file-input-${Math.random()}`)?.click()}
    >
      <IconComponent className="h-8 w-8 text-slate-400 mx-auto mb-2" />
      <p className="text-sm text-slate-600">{placeholder}</p>
      <p className="text-xs text-slate-500 mt-1">{subtext}</p>
      <input
        id={`file-input-${Math.random()}`}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
