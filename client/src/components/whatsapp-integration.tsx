import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  MessageCircle, Phone, QrCode, Shield, 
  CheckCircle, AlertCircle, Smartphone,
  Video, Settings
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

interface WhatsAppIntegrationProps {
  onConnectionEstablished?: (sessionData: any) => void;
  deepfakeEnabled?: boolean;
}

export function WhatsAppIntegration({ 
  onConnectionEstablished, 
  deepfakeEnabled = false 
}: WhatsAppIntegrationProps) {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [connectionMethod, setConnectionMethod] = useState<"qr" | "phone">("phone");
  const [whatsappSession, setWhatsappSession] = useState<any>(null);
  const [deepfakeActive, setDeepfakeActive] = useState(deepfakeEnabled);

  // WhatsApp connection mutation
  const connectWhatsApp = useMutation({
    mutationFn: async ({ method, phoneNumber }: { method: string, phoneNumber?: string }) => {
      const response = await apiRequest("POST", "/api/whatsapp/connect", {
        method,
        phoneNumber,
        deepfakeEnabled: deepfakeActive
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.qrCode) {
        setQrCode(data.qrCode);
        toast({
          title: "Code QR généré",
          description: "Scannez le code QR avec WhatsApp pour vous connecter",
        });
      } else if (data.sessionId) {
        setIsConnected(true);
        setWhatsappSession(data);
        onConnectionEstablished?.(data);
        toast({
          title: "Connexion WhatsApp réussie",
          description: "Vous pouvez maintenant passer des appels avec deepfake",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter à WhatsApp. Vérifiez vos paramètres.",
        variant: "destructive",
      });
    },
  });

  // Start video call with deepfake
  const startWhatsAppCall = useMutation({
    mutationFn: async ({ contactNumber, faceModelId, voiceModelId }: any) => {
      const response = await apiRequest("POST", "/api/whatsapp/start-call", {
        sessionId: whatsappSession?.sessionId,
        contactNumber,
        faceModelId,
        voiceModelId,
        deepfakeSettings: {
          enabled: deepfakeActive,
          realTime: true,
          quality: "high"
        }
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Appel WhatsApp démarré",
        description: `Appel en cours avec deepfake ${deepfakeActive ? 'activé' : 'désactivé'}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur d'appel",
        description: "Impossible de démarrer l'appel WhatsApp",
        variant: "destructive",
      });
    },
  });

  const handleConnect = () => {
    if (connectionMethod === "phone" && !phoneNumber.trim()) {
      toast({
        title: "Numéro requis",
        description: "Veuillez entrer votre numéro de téléphone",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    connectWhatsApp.mutate({
      method: connectionMethod,
      phoneNumber: connectionMethod === "phone" ? phoneNumber : undefined
    });
  };

  const handleStartCall = (contactNumber: string) => {
    if (!isConnected) {
      toast({
        title: "Non connecté",
        description: "Veuillez d'abord vous connecter à WhatsApp",
        variant: "destructive",
      });
      return;
    }

    startWhatsAppCall.mutate({
      contactNumber,
      faceModelId: 1, // Default face model
      voiceModelId: 1 // Default voice model
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SiWhatsapp className="h-5 w-5 text-green-500" />
          Intégration WhatsApp Réelle
          {isConnected && (
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Connecté
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {!isConnected ? (
          <>
            {/* Connection Method Selection */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={connectionMethod === "phone" ? "default" : "outline"}
                  onClick={() => setConnectionMethod("phone")}
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Numéro
                </Button>
                <Button
                  variant={connectionMethod === "qr" ? "default" : "outline"}
                  onClick={() => setConnectionMethod("qr")}
                  className="flex items-center gap-2"
                >
                  <QrCode className="h-4 w-4" />
                  Code QR
                </Button>
              </div>

              {connectionMethod === "phone" && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">Votre numéro WhatsApp</label>
                  <Input
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={isConnecting}
                  />
                  <p className="text-xs text-slate-600">
                    Format international avec indicatif pays
                  </p>
                </div>
              )}

              {connectionMethod === "qr" && (
                <Alert>
                  <QrCode className="h-4 w-4" />
                  <AlertDescription>
                    Un code QR sera généré pour scanner avec votre application WhatsApp
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Deepfake Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Deepfake pour les appels</span>
                <Switch
                  checked={deepfakeActive}
                  onCheckedChange={setDeepfakeActive}
                />
              </div>
              <p className="text-xs text-slate-600">
                Activer la transformation de visage et voix pendant les appels WhatsApp
              </p>
            </div>

            {/* Connection Button */}
            <Button
              onClick={handleConnect}
              disabled={isConnecting || connectWhatsApp.isPending}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isConnecting || connectWhatsApp.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <SiWhatsapp className="h-4 w-4 mr-2" />
                  Se connecter à WhatsApp
                </>
              )}
            </Button>

            {/* QR Code Display */}
            {qrCode && (
              <div className="space-y-3">
                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-green-300 inline-block">
                    <img src={qrCode} alt="Code QR WhatsApp" className="w-48 h-48" />
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    Scannez ce code avec WhatsApp
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Connected State */}
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Connecté à WhatsApp avec le numéro {whatsappSession?.phoneNumber}
                </AlertDescription>
              </Alert>

              {/* Call Controls */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Numéro à appeler</label>
                <div className="flex gap-2">
                  <Input
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    className="flex-1"
                    id="contactNumber"
                  />
                  <Button
                    onClick={() => {
                      const contactInput = document.getElementById('contactNumber') as HTMLInputElement;
                      const contactNumber = contactInput?.value || "+33612345678";
                      handleStartCall(contactNumber);
                    }}
                    disabled={startWhatsAppCall.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {startWhatsAppCall.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <>
                        <Video className="h-4 w-4 mr-2" />
                        Appeler
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-slate-600">
                  L'utilisateur recevra un message WhatsApp avec boutons pour rejoindre directement l'appel
                </p>
              </div>

              {/* Direct Call Feature */}
              <div className="space-y-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <h4 className="text-sm font-semibold text-green-800 flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Appels Directs WhatsApp
                </h4>
                <p className="text-xs text-green-700">
                  • Les contacts reçoivent un message interactif
                  • Clic direct pour rejoindre l'appel
                  • Choix d'activer/désactiver le deepfake
                  • Pas besoin de liens compliqués
                </p>
              </div>

              {/* Status Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <Smartphone className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">WhatsApp</p>
                  <p className="text-xs text-slate-600">Connecté</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <Video className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">Appels Vidéo</p>
                  <p className="text-xs text-slate-600">Disponible</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <Settings className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">Deepfake</p>
                  <p className="text-xs text-slate-600">
                    {deepfakeActive ? "Activé" : "Désactivé"}
                  </p>
                </div>
              </div>

              {/* Disconnect Button */}
              <Button
                variant="outline"
                onClick={() => {
                  setIsConnected(false);
                  setWhatsappSession(null);
                  setQrCode(null);
                }}
                className="w-full"
              >
                Se déconnecter de WhatsApp
              </Button>
            </div>
          </>
        )}

        {/* Important Notice */}
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Note importante:</strong> Cette fonctionnalité nécessite l'accès à l'API WhatsApp Business. 
            Assurez-vous d'avoir les autorisations nécessaires et respectez les conditions d'utilisation de WhatsApp.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}