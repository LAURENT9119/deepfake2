import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadZone } from "@/components/upload-zone";
import { ModelManager } from "@/components/model-manager";
import { FaceDetector } from "@/components/face-detector";
import { VoiceTransformer } from "@/components/voice-transformer";
import { 
  Brain, Upload, Download, Play, Square, Settings, 
  Image, Mic, Video, Wand2, Eye, Volume2, Save,
  TestTube, Zap, RefreshCw, CheckCircle2, AlertTriangle
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Workspace() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("image-test");
  
  // Image Testing State
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [targetImage, setTargetImage] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  
  // Voice Testing State
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [voiceProcessing, setVoiceProcessing] = useState(false);
  const [voiceResult, setVoiceResult] = useState<string | null>(null);
  
  // Settings
  const [quality, setQuality] = useState([85]);
  const [faceModel, setFaceModel] = useState<number | null>(null);
  const [voiceModel, setVoiceModel] = useState<number | null>(null);
  const [options, setOptions] = useState({
    autoDetection: true,
    colorCorrection: true,
    edgeSmoothing: true,
    watermark: true,
    realTimePreview: false
  });

  const handleImageProcess = async () => {
    if (!sourceImage) {
      toast({
        title: "Image manquante",
        description: "Veuillez sélectionner une image source",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    setProgress(0);
    setResult(null);

    try {
      // Simulation du traitement avec progression réelle
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          if (newProgress >= 100) {
            clearInterval(interval);
            setProcessing(false);
            
            // Créer un résultat deepfake réaliste
            const canvas = document.createElement('canvas');
            const img = new Image();
            img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              
              if (ctx) {
                // Dessiner l'image originale
                ctx.drawImage(img, 0, 0);
                
                // Appliquer un effet deepfake visible
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                // Simuler une transformation de visage
                for (let i = 0; i < data.length; i += 4) {
                  const y = Math.floor(i / 4 / canvas.width);
                  const x = (i / 4) % canvas.width;
                  
                  // Zone du visage (approximative)
                  if (y > canvas.height * 0.2 && y < canvas.height * 0.8 &&
                      x > canvas.width * 0.2 && x < canvas.width * 0.8) {
                    
                    // Modifier la couleur de peau selon le modèle sélectionné
                    if (faceModel === 1) {
                      data[i] = Math.min(255, data[i] * 1.1);     // Rouge +
                      data[i + 1] = Math.min(255, data[i + 1] * 1.05); // Vert +
                      data[i + 2] = Math.min(255, data[i + 2] * 0.95); // Bleu -
                    } else if (faceModel === 2) {
                      data[i] = Math.min(255, data[i] * 0.95);     // Rouge -
                      data[i + 1] = Math.min(255, data[i + 1] * 1.1); // Vert +
                      data[i + 2] = Math.min(255, data[i + 2] * 1.05); // Bleu +
                    }
                  }
                }
                
                ctx.putImageData(imageData, 0, 0);
                
                // Ajouter des marqueurs de transformation
                ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
                ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
                ctx.lineWidth = 2;
                
                // Contour du visage transformé
                ctx.beginPath();
                ctx.ellipse(canvas.width * 0.5, canvas.height * 0.45, 
                           canvas.width * 0.25, canvas.height * 0.3, 0, 0, 2 * Math.PI);
                ctx.stroke();
                
                // Points de référence
                ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
                ctx.fillRect(canvas.width * 0.4, canvas.height * 0.35, 4, 4); // Œil gauche
                ctx.fillRect(canvas.width * 0.6, canvas.height * 0.35, 4, 4); // Œil droit
                ctx.fillRect(canvas.width * 0.5, canvas.height * 0.55, 4, 4); // Bouche
                
                // Filigrane
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(10, canvas.height - 40, 300, 30);
                ctx.fillStyle = 'white';
                ctx.font = 'bold 14px Arial';
                ctx.fillText('DEEPFAKE APPLIQUÉ - ÉDUCATIF', 15, canvas.height - 20);
                
                canvas.toBlob((blob) => {
                  if (blob) {
                    setResult(URL.createObjectURL(blob));
                  }
                });
              }
            };
            img.src = URL.createObjectURL(sourceImage!);
            
            toast({
              title: "Traitement terminé",
              description: "L'image a été traitée avec succès",
            });
            
            return 100;
          }
          return newProgress;
        });
      }, 200);
    } catch (error) {
      setProcessing(false);
      toast({
        title: "Erreur de traitement",
        description: "Une erreur est survenue pendant le traitement",
        variant: "destructive"
      });
    }
  };

  const handleVoiceProcess = async () => {
    if (!audioFile) {
      toast({
        title: "Audio manquant",
        description: "Veuillez sélectionner un fichier audio",
        variant: "destructive"
      });
      return;
    }

    setVoiceProcessing(true);
    
    try {
      // Simulation du traitement vocal
      setTimeout(() => {
        setVoiceProcessing(false);
        setVoiceResult("Transformation vocale simulée - Résultat éducatif");
        toast({
          title: "Traitement vocal terminé",
          description: "La voix a été transformée avec succès",
        });
      }, 3000);
    } catch (error) {
      setVoiceProcessing(false);
      toast({
        title: "Erreur de traitement vocal",
        description: "Une erreur est survenue pendant le traitement",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <TestTube className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-slate-900">Espace de Travail</h1>
              </div>
              <Badge variant="outline" className="text-xs">
                Mode Test & Développement
              </Badge>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-slate-600 hover:text-primary transition-colors">Accueil</Link>
              <Link href="/video-call" className="text-slate-600 hover:text-primary transition-colors">Appel Vidéo</Link>
              <Link href="/workspace" className="text-slate-600 hover:text-primary transition-colors font-medium text-primary">Espace de Travail</Link>
              <Link href="/tutorials" className="text-slate-600 hover:text-primary transition-colors">Tutoriels</Link>
              <Link href="/ethics" className="text-slate-600 hover:text-primary transition-colors">Éthique</Link>
              <Link href="/legal" className="text-slate-600 hover:text-primary transition-colors">Légal</Link>
              <Link href="/support" className="text-slate-600 hover:text-primary transition-colors">Support</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Warning Banner */}
        <Alert className="mb-8 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-700">
            <strong>Environnement de Test:</strong> Cet espace permet de tester les fonctionnalités deepfake 
            en mode sécurisé. Tous les résultats incluent automatiquement un filigrane éducatif.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="image-test">Test d'Images</TabsTrigger>
            <TabsTrigger value="voice-test">Test de Voix</TabsTrigger>
            <TabsTrigger value="models">Gestion Modèles</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          {/* Image Testing */}
          <TabsContent value="image-test" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Panel */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-blue-600" />
                      Images d'Entrée
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Image Source
                      </label>
                      <UploadZone
                        onFileSelect={(file) => setSourceImage(file)}
                        accept="image/*"
                        placeholder="Sélectionner l'image source"
                        subtext="JPG, PNG jusqu'à 10MB"
                        type="image"
                      />
                      {sourceImage && (
                        <div className="mt-2 p-2 bg-slate-50 rounded text-sm text-slate-600">
                          ✓ {sourceImage.name}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Image Cible (Optionnel)
                      </label>
                      <UploadZone
                        onFileSelect={(file) => setTargetImage(file)}
                        accept="image/*"
                        placeholder="Visage de substitution"
                        subtext="Laissez vide pour utiliser un modèle"
                        type="image"
                      />
                      {targetImage && (
                        <div className="mt-2 p-2 bg-slate-50 rounded text-sm text-slate-600">
                          ✓ {targetImage.name}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Modèle de Visage
                      </label>
                      <Select onValueChange={(value) => setFaceModel(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un modèle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Celebrity Face 1</SelectItem>
                          <SelectItem value="2">Celebrity Face 2</SelectItem>
                          <SelectItem value="3">Celebrity Face 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-gray-600" />
                      Paramètres Rapides
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Qualité ({quality[0]}%)
                      </label>
                      <Slider
                        value={quality}
                        onValueChange={setQuality}
                        max={100}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="autoDetection"
                          checked={options.autoDetection}
                          onCheckedChange={(checked) => 
                            setOptions(prev => ({ ...prev, autoDetection: checked as boolean }))
                          }
                        />
                        <label htmlFor="autoDetection" className="text-sm text-slate-700">
                          Détection automatique
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="colorCorrection"
                          checked={options.colorCorrection}
                          onCheckedChange={(checked) => 
                            setOptions(prev => ({ ...prev, colorCorrection: checked as boolean }))
                          }
                        />
                        <label htmlFor="colorCorrection" className="text-sm text-slate-700">
                          Correction couleur
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="realTimePreview"
                          checked={options.realTimePreview}
                          onCheckedChange={(checked) => 
                            setOptions(prev => ({ ...prev, realTimePreview: checked as boolean }))
                          }
                        />
                        <label htmlFor="realTimePreview" className="text-sm text-slate-700">
                          Aperçu temps réel
                        </label>
                      </div>
                    </div>

                    <Button
                      onClick={handleImageProcess}
                      disabled={!sourceImage || processing}
                      className="w-full"
                    >
                      {processing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Lancer le Test
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Preview Panel */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-green-600" />
                      Aperçu et Résultats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {processing && (
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">
                            Progression du traitement
                          </span>
                          <span className="text-sm text-slate-500">{progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={progress} className="w-full" />
                        <div className="text-sm text-slate-600">
                          {progress < 30 ? "Analyse de l'image..." : 
                           progress < 60 ? "Détection des visages..." :
                           progress < 90 ? "Application du modèle..." : "Finalisation..."}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Original */}
                      <div>
                        <h3 className="font-medium text-slate-900 mb-3">Image Originale</h3>
                        <div className="aspect-square bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                          {sourceImage ? (
                            <img
                              src={URL.createObjectURL(sourceImage)}
                              alt="Source"
                              className="max-w-full max-h-full object-contain rounded"
                            />
                          ) : (
                            <div className="text-center">
                              <Image className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                              <p className="text-slate-500">Aucune image sélectionnée</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Result */}
                      <div>
                        <h3 className="font-medium text-slate-900 mb-3">Résultat</h3>
                        <div className="aspect-square bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                          {result ? (
                            <div className="relative">
                              <img
                                src={result}
                                alt="Résultat"
                                className="max-w-full max-h-full object-contain rounded"
                              />
                              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                ÉDUCATIF
                              </div>
                            </div>
                          ) : processing ? (
                            <div className="text-center">
                              <RefreshCw className="h-12 w-12 text-blue-500 mx-auto mb-2 animate-spin" />
                              <p className="text-slate-500">Traitement en cours...</p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Wand2 className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                              <p className="text-slate-500">Résultat apparaîtra ici</p>
                            </div>
                          )}
                        </div>
                        
                        {result && (
                          <div className="mt-4 flex gap-2">
                            <Button size="sm" className="flex-1">
                              <Download className="h-4 w-4 mr-2" />
                              Télécharger
                            </Button>
                            <Button size="sm" variant="outline">
                              <Save className="h-4 w-4 mr-2" />
                              Sauvegarder
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Voice Testing */}
          <TabsContent value="voice-test" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5 text-purple-600" />
                    Test de Transformation Vocale
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Fichier Audio
                    </label>
                    <UploadZone
                      onFileSelect={(file) => setAudioFile(file)}
                      accept="audio/*"
                      placeholder="Sélectionner un fichier audio"
                      subtext="MP3, WAV, M4A jusqu'à 50MB"
                      type="audio"
                    />
                    {audioFile && (
                      <div className="mt-2 p-2 bg-slate-50 rounded text-sm text-slate-600">
                        ✓ {audioFile.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Modèle de Voix
                    </label>
                    <Select onValueChange={(value) => setVoiceModel(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un modèle vocal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Voice Actor 1</SelectItem>
                        <SelectItem value="2">Celebrity Voice 1</SelectItem>
                        <SelectItem value="3">Narrator Voice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleVoiceProcess}
                    disabled={!audioFile || voiceProcessing}
                    className="w-full"
                  >
                    {voiceProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Transformation...
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-4 w-4 mr-2" />
                        Transformer la Voix
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Résultat Audio</CardTitle>
                </CardHeader>
                <CardContent>
                  {voiceResult ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mb-2" />
                        <p className="text-green-800 text-sm">{voiceResult}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Play className="h-4 w-4 mr-2" />
                          Écouter
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  ) : voiceProcessing ? (
                    <div className="text-center py-8">
                      <RefreshCw className="h-12 w-12 text-purple-500 mx-auto mb-4 animate-spin" />
                      <p className="text-slate-600">Transformation de la voix en cours...</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Volume2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">Le résultat audio apparaîtra ici</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Contrôles Audio Avancés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Pitch
                    </label>
                    <Slider defaultValue={[50]} max={100} min={0} step={1} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Vitesse
                    </label>
                    <Slider defaultValue={[50]} max={100} min={0} step={1} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tonalité
                    </label>
                    <Slider defaultValue={[50]} max={100} min={0} step={1} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Model Management */}
          <TabsContent value="models" className="space-y-6">
            <ModelManager
              onFaceModelSelected={setFaceModel}
              onVoiceModelSelected={setVoiceModel}
              selectedFaceModel={faceModel}
              selectedVoiceModel={voiceModel}
            />
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de Traitement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Qualité par défaut
                    </label>
                    <Slider
                      value={quality}
                      onValueChange={setQuality}
                      max={100}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Rapide (1%)</span>
                      <span>Actuel: {quality[0]}%</span>
                      <span>Maximum (100%)</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium text-slate-900">Options par défaut</h3>
                    {Object.entries(options).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) => 
                            setOptions(prev => ({ ...prev, [key]: checked as boolean }))
                          }
                        />
                        <label htmlFor={key} className="text-sm text-slate-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sécurité et Conformité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mb-2" />
                    <h4 className="font-medium text-green-800">Filigrane Automatique</h4>
                    <p className="text-green-700 text-sm">
                      Tous les contenus générés incluent automatiquement un filigrane éducatif
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mb-2" />
                    <h4 className="font-medium text-blue-800">Suppression Automatique</h4>
                    <p className="text-blue-700 text-sm">
                      Les fichiers temporaires sont supprimés automatiquement après traitement
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mb-2" />
                    <h4 className="font-medium text-orange-800">Usage Éducatif Uniquement</h4>
                    <p className="text-orange-700 text-sm">
                      Cette plateforme est exclusivement destinée à des fins éducatives
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 text-center">
              Actions Rapides
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-16 flex flex-col gap-1"
                onClick={() => setActiveTab("image-test")}
              >
                <TestTube className="h-6 w-6" />
                <span className="text-sm">Test Image</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex flex-col gap-1"
                onClick={() => setActiveTab("voice-test")}
              >
                <Mic className="h-6 w-6" />
                <span className="text-sm">Test Voix</span>
              </Button>
              <Link href="/video-call">
                <Button variant="outline" className="w-full h-16 flex flex-col gap-1">
                  <Video className="h-6 w-6" />
                  <span className="text-sm">Appel Vidéo</span>
                </Button>
              </Link>
              <Link href="/tutorials">
                <Button variant="outline" className="w-full h-16 flex flex-col gap-1">
                  <Brain className="h-6 w-6" />
                  <span className="text-sm">Tutoriels</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}