import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Image, Settings } from "lucide-react";

interface WorkspaceProps {
  sourceImage: File | null;
  targetImage: File | null;
  processing: boolean;
  progress: number;
}

export function Workspace({ sourceImage, targetImage, processing, progress }: WorkspaceProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="border-b border-slate-200 pb-4 mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Espace de travail</h2>
          <p className="text-slate-600 text-sm mt-1">
            Visualisez le processus de transformation en temps réel
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original Image */}
          <div>
            <h3 className="font-medium text-slate-900 mb-3">Image originale</h3>
            <div className="aspect-video bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
              {sourceImage ? (
                <img
                  src={URL.createObjectURL(sourceImage)}
                  alt="Image source"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <Image className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600">Aucune image téléchargée</p>
                </div>
              )}
            </div>
          </div>

          {/* Result Image */}
          <div>
            <h3 className="font-medium text-slate-900 mb-3">Résultat de démonstration</h3>
            <div className="aspect-video bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden">
              {processing ? (
                <div className="text-center">
                  <Settings className="h-12 w-12 text-slate-400 mx-auto mb-3 animate-spin" />
                  <p className="text-slate-600">Traitement en cours...</p>
                </div>
              ) : progress === 100 && sourceImage ? (
                <>
                  <img
                    src={URL.createObjectURL(sourceImage)}
                    alt="Résultat"
                    className="max-w-full max-h-full object-contain opacity-90"
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    ÉDUCATIF - DÉMONSTRATION
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <Settings className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600">En attente de traitement</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Progression</span>
            <span className="text-sm text-slate-500">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
