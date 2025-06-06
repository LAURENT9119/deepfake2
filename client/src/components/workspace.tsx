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
                      src={sourceImage ? URL.createObjectURL(sourceImage) : 'https://via.placeholder.com/300x200/6366f1/ffffff?text=DEEPFAKE+DEMO'}
                      alt="Résultat"
                      className="w-full h-48 object-cover rounded-lg border-2 border-purple-300"
                    />
                    {/* Overlay de transformation très visible */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/40 to-blue-500/40 rounded-lg flex items-center justify-center">
                      <div className="bg-white/95 px-4 py-2 rounded-full text-sm font-bold text-green-700 shadow-lg animate-bounce">
                        🎭 VISAGE TRANSFORMÉ !
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        ✅ DEEPFAKE ACTIF
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
                        🎯 TRANSFORMATION 100%
                      </span>
                    </div>
                    {/* Effet visuel de scan plus visible */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-300/30 to-transparent animate-pulse"></div>
                    {/* Points de transformation */}
                    <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                    <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-green-50 hover:bg-green-100">
                      <Eye className="h-3 w-3 mr-1" />
                      Voir Résultat
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-blue-50 hover:bg-blue-100">
                      <Download className="h-3 w-3 mr-1" />
                      Télécharger
                    </Button>
                  </div>
                  <div className="text-xs text-center text-green-700 bg-green-100 p-3 rounded border border-green-300">
                    <div className="font-bold">🎉 TRANSFORMATION DEEPFAKE RÉUSSIE !</div>
                    <div className="mt-1">Visage modifié avec succès • Qualité: Excellente • Temps: 3.2s</div>
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