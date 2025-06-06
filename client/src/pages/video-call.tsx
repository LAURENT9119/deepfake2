import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Video, VideoOff, Mic, MicOff, Phone, PhoneOff, 
  Settings, User, Volume2, Camera, MonitorSpeaker,
  Palette, Lightbulb, Zap, Users, ArrowLeft, Home, UserPlus
} from "lucide-react";
import io from "socket.io-client";
import { Link } from "wouter";
import { WhatsAppIntegration } from "@/components/whatsapp-integration";
import { ModelManager } from "@/components/model-manager";

interface FaceModel {
  id: number;
  name: string;
  category: string;
  isPublic: boolean;
}

interface VoiceModel {
  id: number;
  name: string;
  category: string;
  language: string;
  isPublic: boolean;
}

export default function VideoCall() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<any>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userId] = useState(Math.random().toString(36).substr(2, 9));
  const [isFromWhatsApp, setIsFromWhatsApp] = useState(false);
  
  // Deepfake settings
  const [selectedFaceModel, setSelectedFaceModel] = useState<number | null>(null);
  const [selectedVoiceModel, setSelectedVoiceModel] = useState<number | null>(null);
  const [deepfakeEnabled, setDeepfakeEnabled] = useState(false);
  const [faceSwapIntensity, setFaceSwapIntensity] = useState([80]);
  const [voiceChangeIntensity, setVoiceChangeIntensity] = useState([70]);
  const [lightingAdaptation, setLightingAdaptation] = useState(true);
  const [realTimeProcessing, setRealTimeProcessing] = useState(true);

  // Fetch available face models
  const { data: faceModels } = useQuery<FaceModel[]>({
    queryKey: ["/api/face-models/public"],
    enabled: true
  });

  // Fetch available voice models
  const { data: voiceModels } = useQuery<VoiceModel[]>({
    queryKey: ["/api/voice-models/public"],
    enabled: true
  });

  // Initialize WebRTC and Socket.IO
  useEffect(() => {
    // Vérifier les paramètres URL pour les appels directs WhatsApp
    const urlParams = new URLSearchParams(window.location.search);
    const sessionParam = urlParams.get('session');
    const deepfakeParam = urlParams.get('deepfake');
    const autostartParam = urlParams.get('autostart');

    if (sessionParam) {
      setRoomId(sessionParam);
      setIsFromWhatsApp(true);
      
      if (deepfakeParam === 'true') {
        setDeepfakeEnabled(true);
      }

      toast({
        title: "Appel WhatsApp détecté",
        description: `Session: ${sessionParam.substring(0, 8)}... - Deepfake: ${deepfakeParam === 'true' ? 'Activé' : 'Désactivé'}`,
      });

      // Auto-démarrer l'appel si demandé
      if (autostartParam === 'true') {
        setTimeout(() => {
          startCall();
        }, 2000);
      }
    }

    initializeMedia();
    initializeSocket();
    
    return () => {
      cleanup();
    };
  }, []);

  const initializeSocket = () => {
    socketRef.current = io(window.location.origin);
    
    socketRef.current.on('user-connected', (userId: string) => {
      toast({
        title: "Utilisateur connecté",
        description: `L'utilisateur ${userId} a rejoint l'appel`,
      });
    });

    socketRef.current.on('offer', async (offer: RTCSessionDescriptionInit) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(offer);
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socketRef.current.emit('answer', answer, roomId);
      }
    });

    socketRef.current.on('answer', async (answer: RTCSessionDescriptionInit) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(answer);
      }
    });

    socketRef.current.on('ice-candidate', async (candidate: RTCIceCandidateInit) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(candidate);
      }
    });

    socketRef.current.on('processed-frame', (processedFrame: string) => {
      // Apply processed frame to video element
      if (videoRef.current && deepfakeEnabled) {
        // In real implementation, this would update the video stream
        console.log('Received processed frame');
      }
    });

    socketRef.current.on('face-model-update', (data: { faceModelId: number }) => {
      toast({
        title: "Modèle de visage mis à jour",
        description: "L'autre participant a changé de visage",
      });
    });

    socketRef.current.on('voice-model-update', (data: { voiceModelId: number }) => {
      toast({
        title: "Modèle de voix mis à jour", 
        description: "L'autre participant a changé de voix",
      });
    });
  };

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Setup peer connection
      setupPeerConnection();
      
      // Start real-time processing if enabled
      if (realTimeProcessing) {
        startFrameProcessing();
      }

    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: "Erreur d'accès à la caméra",
        description: "Impossible d'accéder à votre caméra ou microphone",
        variant: "destructive",
      });
    }
  };

  const setupPeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    peerConnectionRef.current = new RTCPeerConnection(configuration);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        peerConnectionRef.current?.addTrack(track, streamRef.current!);
      });
    }

    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', event.candidate, roomId);
      }
    };
  };

  const startFrameProcessing = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    const processFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        
        if (ctx) {
          // Toujours dessiner la frame de base
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          if (deepfakeEnabled && selectedFaceModel) {
            // Appliquer l'effet deepfake visuellement
            ctx.save();
            
            // Simuler la transformation faciale
            ctx.globalAlpha = faceSwapIntensity[0] / 100;
            ctx.fillStyle = 'rgba(100, 150, 255, 0.1)';
            
            // Dessiner un overlay pour simuler la transformation
            const faceRegions = detectFaceRegions(canvas.width, canvas.height);
            faceRegions.forEach(region => {
              ctx.fillRect(region.x, region.y, region.width, region.height);
            });
            
            // Ajouter un filigrane éducatif
            ctx.restore();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillRect(10, canvas.height - 30, 200, 20);
            ctx.fillStyle = 'black';
            ctx.font = '12px Arial';
            ctx.fillText('ÉDUCATIF - DÉMONSTRATION', 15, canvas.height - 15);
            
            // Envoyer la frame transformée au serveur pour traitement
            if (socketRef.current && realTimeProcessing) {
              const frameData = canvas.toDataURL('image/jpeg', 0.8);
              socketRef.current.emit('video-frame', {
                frameData,
                sessionId: roomId,
                faceModelId: selectedFaceModel,
                intensity: faceSwapIntensity[0],
                voiceSettings: {
                  modelId: selectedVoiceModel,
                  intensity: voiceChangeIntensity[0],
                  enabled: !!selectedVoiceModel
                }
              });
            }
          }
          
          // Appliquer la frame transformée à la vidéo locale
          if (deepfakeEnabled) {
            const stream = canvas.captureStream(30);
            if (videoRef.current && stream) {
              videoRef.current.srcObject = stream;
            }
          }
        }
      }
      
      requestAnimationFrame(processFrame);
    };

    processFrame();
  };

  // Fonction pour détecter les régions de visage (simulation)
  const detectFaceRegions = (width: number, height: number) => {
    return [
      {
        x: width * 0.3,
        y: height * 0.2,
        width: width * 0.4,
        height: height * 0.5
      }
    ];
  };

  const startCall = async () => {
    if (!roomId.trim()) {
      toast({
        title: "ID de salle requis",
        description: "Veuillez entrer un ID de salle pour commencer l'appel",
        variant: "destructive",
      });
      return;
    }

    setIsCallActive(true);
    
    // Join room via socket
    socketRef.current.emit('join-room', roomId, userId);

    // Create offer if initiating call
    if (peerConnectionRef.current) {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socketRef.current.emit('offer', offer, roomId);
    }

    toast({
      title: "Appel démarré",
      description: `Salle: ${roomId}`,
    });
  };

  const endCall = () => {
    setIsCallActive(false);
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      setupPeerConnection();
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    toast({
      title: "Appel terminé",
      description: "L'appel vidéo a été interrompu",
    });
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const handleFaceModelChange = (modelId: string) => {
    const id = parseInt(modelId);
    setSelectedFaceModel(id);
    
    if (socketRef.current && isCallActive) {
      socketRef.current.emit('face-model-changed', {
        roomId,
        faceModelId: id
      });
    }

    toast({
      title: "Modèle de visage changé",
      description: `Nouveau visage appliqué: ${faceModels?.find(m => m.id === id)?.name}`,
    });
  };

  const handleVoiceModelChange = (modelId: string) => {
    const id = parseInt(modelId);
    setSelectedVoiceModel(id);
    
    if (socketRef.current && isCallActive) {
      socketRef.current.emit('voice-model-changed', {
        roomId,
        voiceModelId: id
      });
    }

    toast({
      title: "Modèle de voix changé",
      description: `Nouvelle voix appliquée: ${voiceModels?.find(m => m.id === id)?.name}`,
    });
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Appel Vidéo Deepfake</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Video Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Appel Vidéo Deepfake en Temps Réel
                  {deepfakeEnabled && (
                    <Badge variant="secondary" className="ml-2">
                      <Zap className="h-3 w-3 mr-1" />
                      Deepfake Actif
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Local Video */}
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <canvas
                      ref={canvasRef}
                      className="hidden"
                    />
                    <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                      Vous {deepfakeEnabled ? "(Deepfake)" : ""}
                    </div>
                    {!isVideoEnabled && (
                      <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                        <VideoOff className="h-12 w-12 text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Remote Video */}
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                      {isCallActive ? "Participant distant" : "En attente..."}
                    </div>
                    {!isCallActive && (
                      <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                        <Users className="h-12 w-12 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Call Controls */}
                <div className="flex items-center justify-center gap-4">
                  <input
                    type="text"
                    placeholder="ID de la salle"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                    disabled={isCallActive}
                  />
                  
                  <Button
                    onClick={toggleVideo}
                    variant={isVideoEnabled ? "outline" : "destructive"}
                    size="icon"
                  >
                    {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>

                  <Button
                    onClick={toggleAudio}
                    variant={isAudioEnabled ? "outline" : "destructive"}
                    size="icon"
                  >
                    {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>

                  <Button
                    onClick={isCallActive ? endCall : startCall}
                    variant={isCallActive ? "destructive" : "default"}
                    className="min-w-[120px]"
                  >
                    {isCallActive ? (
                      <>
                        <PhoneOff className="h-4 w-4 mr-2" />
                        Raccrocher
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4 mr-2" />
                        Appeler
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Connection Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Configuration d'Appel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roomId">ID de Salle / Code d'Appel</Label>
                  <Input
                    id="roomId"
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Ex: room123 ou code généré"
                    disabled={isCallActive}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Numéro de Téléphone (Optionnel)</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    disabled={isCallActive}
                  />
                  <p className="text-xs text-slate-500">
                    Pour les appels WhatsApp ou notifications
                  </p>
                </div>

                {!isCallActive && (
                  <Button
                    onClick={() => {
                      if (!roomId.trim()) {
                        setRoomId(`room_${Date.now()}`);
                      }
                      startCall();
                    }}
                    className="w-full"
                    disabled={!roomId.trim()}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {phoneNumber ? 'Appeler le Contact' : 'Rejoindre la Salle'}
                  </Button>
                )}
              </CardContent>
            </Card>
            
            {/* Deepfake Toggle */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Contrôles Deepfake
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Deepfake activé</span>
                  <Switch
                    checked={deepfakeEnabled}
                    onCheckedChange={setDeepfakeEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Traitement temps réel</span>
                  <Switch
                    checked={realTimeProcessing}
                    onCheckedChange={setRealTimeProcessing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Adaptation lumière</span>
                  <Switch
                    checked={lightingAdaptation}
                    onCheckedChange={setLightingAdaptation}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Model Manager */}
            <ModelManager
              onFaceModelSelected={(modelId) => {
                setSelectedFaceModel(modelId);
                handleFaceModelChange(modelId.toString());
              }}
              onVoiceModelSelected={(modelId) => {
                setSelectedVoiceModel(modelId);
                handleVoiceModelChange(modelId.toString());
              }}
              selectedFaceModel={selectedFaceModel}
              selectedVoiceModel={selectedVoiceModel}
            />

            {/* Transformation Intensity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Intensité de Transformation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium">Changement de visage</span>
                  <Slider
                    value={faceSwapIntensity}
                    onValueChange={setFaceSwapIntensity}
                    max={100}
                    min={0}
                    step={5}
                    disabled={!deepfakeEnabled}
                  />
                  <div className="text-xs text-slate-500">{faceSwapIntensity[0]}%</div>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">Changement de voix</span>
                  <Slider
                    value={voiceChangeIntensity}
                    onValueChange={setVoiceChangeIntensity}
                    max={100}
                    min={0}
                    step={5}
                    disabled={!deepfakeEnabled}
                  />
                  <div className="text-xs text-slate-500">{voiceChangeIntensity[0]}%</div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Integration */}
            <WhatsAppIntegration
              onConnectionEstablished={(sessionData) => {
                toast({
                  title: "WhatsApp connecté",
                  description: "Vous pouvez maintenant passer des appels avec deepfake",
                });
              }}
              deepfakeEnabled={deepfakeEnabled}
            />

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MonitorSpeaker className="h-5 w-5" />
                  État du Système
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Connexion:</span>
                  <Badge variant={isCallActive ? "default" : "secondary"}>
                    {isCallActive ? "Connecté" : "Déconnecté"}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Deepfake:</span>
                  <Badge variant={deepfakeEnabled ? "default" : "secondary"}>
                    {deepfakeEnabled ? "Actif" : "Inactif"}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Modèle visage:</span>
                  <Badge variant={selectedFaceModel ? "default" : "secondary"}>
                    {selectedFaceModel ? "Sélectionné" : "Aucun"}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Modèle voix:</span>
                  <Badge variant={selectedVoiceModel ? "default" : "secondary"}>
                    {selectedVoiceModel ? "Sélectionné" : "Aucun"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}