import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, Mic, MicOff, Play, Square, Download, Upload } from "lucide-react";

interface VoiceModel {
  id: number;
  name: string;
  category: string;
  language: string;
}

interface VoiceTransformerProps {
  voiceModels?: VoiceModel[];
  onVoiceProcessed?: (audioData: ArrayBuffer) => void;
  enabled?: boolean;
}

export function VoiceTransformer({ 
  voiceModels = [], 
  onVoiceProcessed, 
  enabled = false 
}: VoiceTransformerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedVoiceModel, setSelectedVoiceModel] = useState<number | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(enabled);
  
  // Voice transformation parameters
  const [pitchShift, setPitchShift] = useState([0]);
  const [toneIntensity, setToneIntensity] = useState([70]);
  const [speedAdjustment, setSpeedAdjustment] = useState([100]);
  const [voiceClarity, setVoiceClarity] = useState([85]);
  const [backgroundNoise, setBackgroundNoise] = useState(true);
  const [realTimeMode, setRealTimeMode] = useState(true);
  
  // Audio processing refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Audio data
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [processedAudio, setProcessedAudio] = useState<string | null>(null);
  const [voiceLevel, setVoiceLevel] = useState(0);

  useEffect(() => {
    if (voiceEnabled && realTimeMode) {
      initializeAudioProcessing();
    } else {
      cleanupAudio();
    }
  }, [voiceEnabled, realTimeMode]);

  const initializeAudioProcessing = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: backgroundNoise,
          autoGainControl: true,
          sampleRate: 44100
        }
      });

      streamRef.current = stream;
      
      // Setup audio context for real-time processing
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 2048;
      
      // Start real-time audio analysis
      if (realTimeMode) {
        startAudioVisualization();
        startRealTimeProcessing();
      }

    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const startAudioVisualization = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    
    if (!canvas || !analyser) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      analyser.getByteFrequencyData(dataArray);
      
      ctx.fillStyle = 'rgb(20, 20, 20)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;
      
      // Calculate voice level
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      setVoiceLevel(Math.round((average / 255) * 100));
      
      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;
        
        const red = barHeight + 25 * (i / bufferLength);
        const green = 250 * (i / bufferLength);
        const blue = 50;
        
        ctx.fillStyle = `rgb(${red},${green},${blue})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
      
      if (voiceEnabled) {
        requestAnimationFrame(draw);
      }
    };
    
    draw();
  };

  const startRealTimeProcessing = () => {
    if (!audioContextRef.current || !selectedVoiceModel) return;
    
    // Simulate real-time voice transformation processing
    const processAudioFrame = () => {
      if (voiceEnabled && realTimeMode && selectedVoiceModel) {
        // Apply voice transformation parameters
        const transformedAudio = applyVoiceTransformation();
        onVoiceProcessed?.(transformedAudio);
      }
      
      if (voiceEnabled && realTimeMode) {
        setTimeout(processAudioFrame, 100); // Process every 100ms
      }
    };
    
    processAudioFrame();
  };

  const applyVoiceTransformation = (): ArrayBuffer => {
    // Simulate advanced voice transformation
    // Real implementation would use Web Audio API's complex processing
    
    const sampleRate = 44100;
    const duration = 0.1; // 100ms chunk
    const samples = sampleRate * duration;
    const buffer = new ArrayBuffer(samples * 4);
    const view = new Float32Array(buffer);
    
    // Generate processed audio based on transformation parameters
    for (let i = 0; i < samples; i++) {
      // Apply pitch shift
      const pitchFactor = Math.pow(2, pitchShift[0] / 12);
      
      // Apply tone modification
      const toneModifier = toneIntensity[0] / 100;
      
      // Apply speed adjustment  
      const speedFactor = speedAdjustment[0] / 100;
      
      // Simulate processed sample
      view[i] = Math.sin(2 * Math.PI * 440 * pitchFactor * i / sampleRate) * toneModifier * 0.1;
    }
    
    return buffer;
  };

  const startRecording = async () => {
    if (!streamRef.current) {
      await initializeAudioProcessing();
    }
    
    if (streamRef.current) {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };
      
      mediaRecorder.onstop = () => {
        processRecordedAudio();
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processRecordedAudio = async () => {
    if (audioChunks.length === 0 || !selectedVoiceModel) return;
    
    setIsProcessing(true);
    
    // Combine audio chunks
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    
    // Simulate voice transformation processing
    setTimeout(() => {
      // Create processed audio URL
      const processedUrl = URL.createObjectURL(audioBlob);
      setProcessedAudio(processedUrl);
      setIsProcessing(false);
      setAudioChunks([]);
    }, 2000);
  };

  const cleanupAudio = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const downloadProcessedAudio = () => {
    if (processedAudio) {
      const a = document.createElement('a');
      a.href = processedAudio;
      a.download = 'voice_transformed.wav';
      a.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Transformation Vocale Temps Réel
          {voiceEnabled && (
            <Badge variant="default" className="ml-2">
              Actif
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Audio Visualization */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Visualisation audio</span>
            <Badge variant="outline">Niveau: {voiceLevel}%</Badge>
          </div>
          <canvas
            ref={canvasRef}
            width={400}
            height={100}
            className="w-full h-24 bg-slate-900 rounded-lg"
          />
        </div>

        {/* Voice Model Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Modèle de voix</label>
          <Select
            onValueChange={(value) => setSelectedVoiceModel(parseInt(value))}
            disabled={!voiceEnabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une voix" />
            </SelectTrigger>
            <SelectContent>
              {voiceModels.map((model) => (
                <SelectItem key={model.id} value={model.id.toString()}>
                  <div className="flex items-center gap-2">
                    {model.name}
                    <Badge variant="outline" className="text-xs">
                      {model.language}
                    </Badge>
                    {model.category === "celebrity" && (
                      <Badge variant="secondary" className="text-xs">
                        Célébrité
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Voice Transformation Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Changement de ton</label>
              <Slider
                value={pitchShift}
                onValueChange={setPitchShift}
                max={12}
                min={-12}
                step={1}
                disabled={!voiceEnabled}
                className="mt-2"
              />
              <div className="text-xs text-slate-500 mt-1">
                {pitchShift[0] > 0 ? '+' : ''}{pitchShift[0]} demi-tons
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Intensité vocale</label>
              <Slider
                value={toneIntensity}
                onValueChange={setToneIntensity}
                max={100}
                min={0}
                step={5}
                disabled={!voiceEnabled}
                className="mt-2"
              />
              <div className="text-xs text-slate-500 mt-1">{toneIntensity[0]}%</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Vitesse de parole</label>
              <Slider
                value={speedAdjustment}
                onValueChange={setSpeedAdjustment}
                max={150}
                min={50}
                step={5}
                disabled={!voiceEnabled}
                className="mt-2"
              />
              <div className="text-xs text-slate-500 mt-1">{speedAdjustment[0]}%</div>
            </div>

            <div>
              <label className="text-sm font-medium">Clarté vocale</label>
              <Slider
                value={voiceClarity}
                onValueChange={setVoiceClarity}
                max={100}
                min={0}
                step={5}
                disabled={!voiceEnabled}
                className="mt-2"
              />
              <div className="text-xs text-slate-500 mt-1">{voiceClarity[0]}%</div>
            </div>
          </div>
        </div>

        {/* Processing Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Transformation activée</span>
              <Switch
                checked={voiceEnabled}
                onCheckedChange={setVoiceEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Mode temps réel</span>
              <Switch
                checked={realTimeMode}
                onCheckedChange={setRealTimeMode}
                disabled={!voiceEnabled}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Réduction bruit</span>
              <Switch
                checked={backgroundNoise}
                onCheckedChange={setBackgroundNoise}
                disabled={!voiceEnabled}
              />
            </div>
          </div>
        </div>

        {/* Recording Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              disabled={!voiceEnabled || !selectedVoiceModel}
            >
              {isRecording ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Arrêter
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>

            {processedAudio && (
              <>
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Écouter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadProcessedAudio}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </>
            )}
          </div>

          {isProcessing && (
            <div className="text-sm text-slate-600 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Traitement de la voix en cours...
            </div>
          )}
        </div>

        {/* Status Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
            <span>Micro:</span>
            <Badge variant={voiceEnabled ? "default" : "secondary"}>
              {voiceEnabled ? "Actif" : "Inactif"}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
            <span>Modèle:</span>
            <Badge variant={selectedVoiceModel ? "default" : "secondary"}>
              {selectedVoiceModel ? "Sélectionné" : "Aucun"}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
            <span>Mode:</span>
            <Badge variant="outline">
              {realTimeMode ? "Temps réel" : "Post-traitement"}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
            <span>Qualité:</span>
            <Badge variant="outline">44.1kHz</Badge>
          </div>
        </div>

        {/* Processed Audio Player */}
        {processedAudio && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Audio transformé:</label>
            <audio controls className="w-full">
              <source src={processedAudio} type="audio/wav" />
              Votre navigateur ne supporte pas la lecture audio.
            </audio>
          </div>
        )}
      </CardContent>
    </Card>
  );
}