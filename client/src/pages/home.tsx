import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EthicalBanner } from "@/components/ethical-banner";
import { UploadZone } from "@/components/upload-zone";
import { SocialIntegrations } from "@/components/social-integrations";
import { Workspace } from "@/components/workspace";
import { Shield, Brain, Clock, ShieldCheck, TriangleAlert, VenetianMask, Video, Zap, Users, Download, Eye } from "lucide-react";
import { SiWhatsapp, SiFacebook, SiInstagram, SiZoom } from "react-icons/si";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [targetImage, setTargetImage] = useState<File | null>(null);
  const [ethicsAccepted, setEthicsAccepted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quality, setQuality] = useState([75]);
  const [options, setOptions] = useState({
    autoDetection: true,
    colorAdjustment: true,
    watermark: true,
  });

  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    if (!ethicsAccepted) {
      toast({
        title: "Acceptation requise",
        description: "Veuillez accepter le code d'éthique pour continuer",
        variant: "destructive",
      });
      return;
    }

    // Si pas d'image source, utiliser une image par défaut
    if (!sourceImage) {
      toast({
        title: "Démonstration démarrée !",
        description: "Transformation en cours avec image de démonstration...",
      });
    }

    setProcessing(true);
    setIsProcessing(true);
    setProgress(0);
    setResultImage(null);

    try {
      // Simulation de progression réaliste
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const increment = Math.random() * 15 + 5;
          const newProgress = Math.min(prev + increment, 95);
          
          if (newProgress >= 95) {
            clearInterval(progressInterval);
            
            // Finaliser le traitement
            setTimeout(() => {
              setProgress(100);
              setProcessing(false);
              setIsProcessing(false);
              setResultImage(`demo_result_${Date.now()}`);
              
              toast({
                title: "🎭 Transformation réussie !",
                description: "Deepfake appliqué avec succès. Visage transformé !",
              });
            }, 500);
          }
          
          return newProgress;
        });
      }, 200);

    } catch (error: any) {
      console.error('Processing error:', error);
      setProcessing(false);
      setIsProcessing(false);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors du traitement",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <VenetianMask className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-slate-900">DeepFake Éducatif</h1>
              </div>
              <span className="px-2 py-1 bg-accent text-white text-xs rounded-full font-medium">
                DÉMONSTRATION
              </span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-slate-600 hover:text-primary transition-colors font-medium text-primary">Accueil</Link>
              <Link href="/video-call" className="text-slate-600 hover:text-primary transition-colors">Appel Vidéo</Link>
              <Link href="/workspace" className="text-slate-600 hover:text-primary transition-colors">Espace de Travail</Link>
              <Link href="/tutorials" className="text-slate-600 hover:text-primary transition-colors">Tutoriels</Link>
              <Link href="/ethics" className="text-slate-600 hover:text-primary transition-colors">Éthique</Link>
              <Link href="/legal" className="text-slate-600 hover:text-primary transition-colors">Légal</Link>
              <Link href="/support" className="text-slate-600 hover:text-primary transition-colors">Support</Link>
            </nav>
          </div>
        </div>
      </header>

      <EthicalBanner />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Paramètres</h2>

                <div className="space-y-4">
                  {/* Upload Sections */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Image Source
                    </label>
                    <UploadZone
                      onFileSelect={setSourceImage}
                      accept="image/*"
                      placeholder="Glisser ou cliquer pour télécharger"
                      subtext="JPG, PNG jusqu'à 10MB"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Image Cible
                    </label>
                    <UploadZone
                      onFileSelect={setTargetImage}
                      accept="image/*"
                      placeholder="Sélectionner le visage cible"
                      subtext="Visage clairement visible"
                    />
                  </div>

                  {/* Processing Options */}
                  <div className="pt-4 border-t border-slate-200">
                    <h3 className="font-medium text-slate-900 mb-3">Options de traitement</h3>
                    <div className="space-y-2">
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
                          id="colorAdjustment"
                          checked={options.colorAdjustment}
                          onCheckedChange={(checked) => 
                            setOptions(prev => ({ ...prev, colorAdjustment: checked as boolean }))
                          }
                        />
                        <label htmlFor="colorAdjustment" className="text-sm text-slate-700">
                          Ajustement couleur
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="watermark"
                          checked={options.watermark}
                          onCheckedChange={(checked) => 
                            setOptions(prev => ({ ...prev, watermark: checked as boolean }))
                          }
                        />
                        <label htmlFor="watermark" className="text-sm text-slate-700">
                          Filigrane éducatif
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Quality Slider */}
                  <div className="pt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Qualité de sortie
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
                      <span>Rapide</span>
                      <span>Haute qualité</span>
                    </div>
                  </div>

                  {/* Process Button */}
                  <Button
                    onClick={handleProcess}
                    disabled={!ethicsAccepted || processing}
                    className="w-full"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    {processing ? "Traitement..." : sourceImage ? "Démarrer la démonstration" : "Démo avec image par défaut"}
                  </Button>
                  
                  {!sourceImage && (
                    <div className="text-xs text-center text-slate-500 mt-2">
                      💡 Aucune image sélectionnée ? Testez avec notre image de démonstration !
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Workspace
              sourceImage={sourceImage}
              targetImage={targetImage}
              processing={processing}
              progress={progress}
              resultImage={resultImage}
              isProcessing={isProcessing}
            />

            {/* Real-time Video Call Section */}
            <Card className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Video className="h-6 w-6 text-blue-600" />
                  Appels Vidéo Deepfake en Temps Réel
                  <Zap className="h-5 w-5 text-yellow-500" />
                </h2>
                <p className="text-slate-600 mb-6">
                  Découvrez notre technologie de pointe pour les appels vidéo avec transformation 
                  de visage et de voix en temps réel. Changez d'apparence instantanément pendant vos 
                  appels vidéo avec des célébrités ou d'autres visages.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-900">Fonctionnalités Avancées:</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        Streaming vidéo 60fps avec WebRTC
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        Changement de visage instantané
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        Transformation vocale en temps réel
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        Adaptation automatique à la lumière
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        Bibliothèque de visages de célébrités
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-900">Intégrations Possibles:</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-2 bg-white rounded-lg border">
                        <SiZoom className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">Zoom</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded-lg border">
                        <SiWhatsapp className="h-5 w-5 text-green-500" />
                        <span className="text-sm">WhatsApp</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded-lg border">
                        <SiFacebook className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">Facebook</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded-lg border">
                        <SiInstagram className="h-5 w-5 text-pink-500" />
                        <span className="text-sm">Instagram</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/video-call">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Video className="h-4 w-4 mr-2" />
                      Démarrer un Appel Vidéo
                    </Button>
                  </Link>
                  <Link href="/workspace">
                    <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                      <Users className="h-4 w-4 mr-2" />
                      Voir la Démo
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Technical Information */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Informations techniques
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-medium text-slate-900">Algorithme IA</h3>
                    <p className="text-sm text-slate-600">Réseaux neuronaux convolutionnels</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <Clock className="h-8 w-8 text-success mx-auto mb-2" />
                    <h3 className="font-medium text-slate-900">Temps Réel</h3>
                    <p className="text-sm text-slate-600">60fps streaming</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <Video className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-medium text-slate-900">WebRTC</h3>
                    <p className="text-sm text-slate-600">Appels P2P sécurisés</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <Shield className="h-8 w-8 text-accent mx-auto mb-2" />
                    <h3 className="font-medium text-slate-900">Sécurité</h3>
                    <p className="text-sm text-slate-600">Filigrane automatique</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <SocialIntegrations />

            {/* Educational Resources */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Ressources éducatives
                </h2>
                <div className="space-y-3">
                  <Link href="/tutorials" className="block p-3 border border-slate-200 rounded-lg hover:border-primary hover:bg-primary hover:bg-opacity-5 transition-colors">
                    <h3 className="font-medium text-slate-900 text-sm">
                      Comment fonctionnent les DeepFakes?
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">Guide technique complet</p>
                  </Link>

                  <Link href="/tutorials" className="block p-3 border border-slate-200 rounded-lg hover:border-primary hover:bg-primary hover:bg-opacity-5 transition-colors">
                    <h3 className="font-medium text-slate-900 text-sm">
                      Détecter les DeepFakes
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">Outils et techniques</p>
                  </Link>

                  <Link href="/ethics" className="block p-3 border border-slate-200 rounded-lg hover:border-primary hover:bg-primary hover:bg-opacity-5 transition-colors">
                    <h3 className="font-medium text-slate-900 text-sm">
                      Implications éthiques
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">Discussion et réflexions</p>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Ethics Guidelines */}
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-red-900 mb-4">
                  <TriangleAlert className="h-5 w-5 inline mr-2" />
                  Code d'éthique
                </h2>
                <ul className="space-y-2 text-sm text-red-800">
                  <li className="flex items-start space-x-2">
                    <ShieldCheck className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>Usage éducatif uniquement</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ShieldCheck className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>Consentement requis pour tous les visages</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ShieldCheck className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>Filigrane obligatoire sur le contenu</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ShieldCheck className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>Aucune utilisation malveillante</span>
                  </li>
                </ul>
                <Button
                  onClick={() => setEthicsAccepted(true)}
                  disabled={ethicsAccepted}
                  className="w-full mt-4 bg-red-600 hover:bg-red-700"
                >
                  {ethicsAccepted ? "Accepté ✓" : "Accepter et continuer"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">À propos</h3>
              <p className="text-sm text-slate-600">
                Cette plateforme démontre la technologie DeepFake à des fins éducatives, 
                sensibilisant aux implications et aux techniques de détection.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Ressources</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Tutoriels vidéo</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Support technique</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Légal</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-primary transition-colors">Conditions d'utilisation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Code d'éthique</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contactez-nous</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 mt-8 pt-8 text-center text-sm text-slate-600">
            <p>&copy; 2024 DeepFake Éducatif. Tous droits réservés. Utilisé exclusivement à des fins éducatives.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}