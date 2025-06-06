import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Image, Settings } from "lucide-react";
import { Upload, ImageIcon, Loader2, Wand2, Brain, Users, Play, Palette, Download, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WorkspaceProps {
  sourceImage: File | null;
  targetImage: File | null;
  processing: boolean;
  progress: number;
  isProcessing: boolean;
  resultImage: string | null;
}

export function Workspace({ sourceImage, targetImage, processing, progress, isProcessing, resultImage }: WorkspaceProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="border-b border-slate-200 pb-4 mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Espace de travail</h2>
          <p className="text-slate-600 text-sm mt-1">
            Visualisez le processus de transformation en temps réel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Source Image */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Image source
              </h3>
              {sourceImage ? (
                <div className="space-y-3">
                  <img
                    src={URL.createObjectURL(sourceImage)}
                    alt="Source"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <div className="text-sm text-slate-600">
                    <p>Nom: {sourceImage.name}</p>
                    <p>Taille: {(sourceImage.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <div className="h-48 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                  <div className="text-center text-slate-500">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                    <p>Aucune image sélectionnée</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Target Image */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Image cible (optionnel)
              </h3>
              {targetImage ? (
                <div className="space-y-3">
                  <img
                    src={URL.createObjectURL(targetImage)}
                    alt="Target"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <div className="text-sm text-slate-600">
                    <p>Nom: {targetImage.name}</p>
                    <p>Taille: {(targetImage.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <div className="h-48 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                  <div className="text-center text-slate-500">
                    <Users className="h-12 w-12 mx-auto mb-2" />
                    <p>Visage cible (facultatif)</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Result */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6">
              <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                {processing || isProcessing ? "Transformation en cours..." : "Résultat Deepfake"}
                {resultImage && <Badge variant="default" className="ml-2">✓ Terminé</Badge>}
              </h3>
              {processing || isProcessing ? (
                <div className="space-y-4">
                  <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center border">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-2" />
                      <p className="text-sm text-purple-700 font-medium">IA en cours...</p>
                      <p className="text-xs text-purple-600 mt-1">{Math.round(progress)}% complété</p>
                    </div>
                  </div>
                  <Progress value={progress} className="w-full" />
                  <p className="text-xs text-center text-purple-600">
                    {progress < 30 ? "Analyse du visage..." : 
                     progress < 70 ? "Application du deepfake..." : 
                     "Finalisation..."}
                  </p>
                </div>
              ) : resultImage ? (
                <div className="space-y-3">
                  <div className="relative">
                    <img
                      src={sourceImage ? URL.createObjectURL(sourceImage) : '/placeholder.jpg'}
                      alt="Résultat"
                      className="w-full h-48 object-cover rounded-lg border-2 border-purple-300"
                    />
                    {/* Overlay de transformation simulée */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-lg flex items-center justify-center">
                      <div className="bg-white/95 px-4 py-2 rounded-full text-sm font-bold text-purple-700 shadow-lg">
                        🎭 TRANSFORMATION RÉUSSIE !
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        ✅ DEEPFAKE ACTIF
                      </span>
                    </div>
                    {/* Effet visuel de scan */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Voir
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="h-3 w-3 mr-1" />
                      Télécharger
                    </Button>
                  </div>
                  <div className="text-xs text-center text-purple-600 bg-purple-50 p-2 rounded">
                    ✅ Transformation deepfake réussie !
                  </div>
                </div>
              ) : sourceImage ? (
                <div className="h-48 border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center bg-purple-50">
                  <div className="text-center text-purple-600">
                    <Wand2 className="h-12 w-12 mx-auto mb-2" />
                    <p className="font-medium">Prêt pour la transformation</p>
                    <p className="text-xs mt-1">Cliquez sur "Démarrer" pour voir le résultat</p>
                  </div>
                </div>
              ) : (
                <div className="h-48 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                  <div className="text-center text-slate-500">
                    <Wand2 className="h-12 w-12 mx-auto mb-2" />
                    <p>Résultat apparaîtra ici</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
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