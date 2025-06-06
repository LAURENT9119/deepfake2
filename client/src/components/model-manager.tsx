
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadZone } from "./upload-zone";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  User, Volume2, Upload, Trash2, Edit, 
  Image, Music, Eye, EyeOff, Globe, Lock,
  CheckCircle, AlertCircle, Loader2
} from "lucide-react";

interface ModelManagerProps {
  onFaceModelSelected?: (modelId: number) => void;
  onVoiceModelSelected?: (modelId: number) => void;
  selectedFaceModel?: number | null;
  selectedVoiceModel?: number | null;
}

export function ModelManager({
  onFaceModelSelected,
  onVoiceModelSelected,
  selectedFaceModel,
  selectedVoiceModel
}: ModelManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState<'face' | 'voice'>('face');
  const [isCreating, setIsCreating] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  const [newModelPublic, setNewModelPublic] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processingFile, setProcessingFile] = useState(false);

  // Fetch face models
  const { data: faceModels, isLoading: loadingFaceModels } = useQuery({
    queryKey: ["/api/face-models"],
  });

  // Fetch voice models
  const { data: voiceModels, isLoading: loadingVoiceModels } = useQuery({
    queryKey: ["/api/voice-models"],
  });

  // Upload file mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    }
  });

  // Create face model mutation
  const createFaceModelMutation = useMutation({
    mutationFn: async (data: { name: string, uploadId: number, isPublic: boolean }) => {
      return apiRequest('/api/face-models', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/face-models"] });
      toast({
        title: "Modèle de visage créé",
        description: "Le modèle a été créé avec succès",
      });
      resetForm();
    }
  });

  // Create voice model mutation
  const createVoiceModelMutation = useMutation({
    mutationFn: async (data: { name: string, uploadId: number, isPublic: boolean, language: string }) => {
      return apiRequest('/api/voice-models', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/voice-models"] });
      toast({
        title: "Modèle de voix créé",
        description: "Le modèle a été créé avec succès",
      });
      resetForm();
    }
  });

  const handleFileUpload = async (file: File, type: 'image' | 'audio') => {
    if ((activeTab === 'face' && type !== 'image') || (activeTab === 'voice' && type !== 'audio')) {
      toast({
        title: "Type de fichier incorrect",
        description: `Veuillez uploader un fichier ${activeTab === 'face' ? 'image' : 'audio'}`,
        variant: "destructive",
      });
      return;
    }

    setProcessingFile(true);
    setUploadedFile(file);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation du traitement
      
      toast({
        title: "Fichier traité",
        description: `${type === 'image' ? 'Image' : 'Audio'} prêt pour la création du modèle`,
      });
    } catch (error) {
      toast({
        title: "Erreur de traitement",
        description: "Impossible de traiter le fichier",
        variant: "destructive",
      });
    } finally {
      setProcessingFile(false);
    }
  };

  const handleCreateModel = async () => {
    if (!uploadedFile || !newModelName.trim()) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez fournir un nom et un fichier",
        variant: "destructive",
      });
      return;
    }

    try {
      // Upload file first
      const uploadResult = await uploadMutation.mutateAsync(uploadedFile);
      
      // Create model
      if (activeTab === 'face') {
        await createFaceModelMutation.mutateAsync({
          name: newModelName,
          uploadId: uploadResult.id,
          isPublic: newModelPublic
        });
      } else {
        await createVoiceModelMutation.mutateAsync({
          name: newModelName,
          uploadId: uploadResult.id,
          isPublic: newModelPublic,
          language: 'fr'
        });
      }
    } catch (error) {
      toast({
        title: "Erreur de création",
        description: "Impossible de créer le modèle",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setIsCreating(false);
    setNewModelName('');
    setNewModelPublic(false);
    setUploadedFile(null);
    setProcessingFile(false);
  };

  const handleModelSelect = (modelId: string, type: 'face' | 'voice') => {
    const id = parseInt(modelId);
    if (type === 'face') {
      onFaceModelSelected?.(id);
    } else {
      onVoiceModelSelected?.(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {activeTab === 'face' ? <User className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          Gestionnaire de Modèles
        </CardTitle>
        
        {/* Tab Switcher */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
          <Button
            variant={activeTab === 'face' ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab('face')}
            className="flex-1"
          >
            <User className="h-4 w-4 mr-1" />
            Visages
          </Button>
          <Button
            variant={activeTab === 'voice' ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab('voice')}
            className="flex-1"
          >
            <Volume2 className="h-4 w-4 mr-1" />
            Voix
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        
        {/* Model Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Sélectionner un modèle {activeTab === 'face' ? 'de visage' : 'de voix'}
          </Label>
          
          {activeTab === 'face' ? (
            <Select
              value={selectedFaceModel?.toString() || ''}
              onValueChange={(value) => handleModelSelect(value, 'face')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un visage" />
              </SelectTrigger>
              <SelectContent>
                {faceModels?.map((model: any) => (
                  <SelectItem key={model.id} value={model.id.toString()}>
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      {model.name}
                      {model.isPublic ? (
                        <Globe className="h-3 w-3 text-blue-500" />
                      ) : (
                        <Lock className="h-3 w-3 text-slate-400" />
                      )}
                      {model.category === 'celebrity' && (
                        <Badge variant="outline" className="text-xs">Célébrité</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Select
              value={selectedVoiceModel?.toString() || ''}
              onValueChange={(value) => handleModelSelect(value, 'voice')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une voix" />
              </SelectTrigger>
              <SelectContent>
                {voiceModels?.map((model: any) => (
                  <SelectItem key={model.id} value={model.id.toString()}>
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4" />
                      {model.name}
                      <Badge variant="outline" className="text-xs">{model.language}</Badge>
                      {model.isPublic ? (
                        <Globe className="h-3 w-3 text-blue-500" />
                      ) : (
                        <Lock className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Create New Model Section */}
        <div className="border-t pt-4">
          <Button
            onClick={() => setIsCreating(!isCreating)}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Créer un nouveau modèle {activeTab === 'face' ? 'de visage' : 'de voix'}
          </Button>

          {isCreating && (
            <div className="mt-4 space-y-4 p-4 bg-slate-50 rounded-lg">
              
              {/* File Upload */}
              <div className="space-y-2">
                <Label>
                  {activeTab === 'face' ? 'Photo de référence' : 'Échantillon audio'}
                </Label>
                <UploadZone
                  onFileSelect={handleFileUpload}
                  type={activeTab === 'face' ? 'image' : 'audio'}
                  placeholder={
                    activeTab === 'face' 
                      ? "Uploader une photo claire du visage"
                      : "Uploader un échantillon de voix (min 30s)"
                  }
                  subtext={
                    activeTab === 'face'
                      ? "JPG, PNG - Visage bien visible, éclairage uniforme"
                      : "MP3, WAV - Voix claire, sans bruit de fond"
                  }
                  icon={activeTab === 'face' ? 'image' : 'audio'}
                />
                
                {processingFile && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyse et optimisation du fichier en cours...
                  </div>
                )}
                
                {uploadedFile && !processingFile && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    {uploadedFile.name} - Prêt pour l'entraînement
                  </div>
                )}
              </div>

              {/* Model Name */}
              <div className="space-y-2">
                <Label htmlFor="model-name">Nom du modèle</Label>
                <Input
                  id="model-name"
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  placeholder={`Mon ${activeTab === 'face' ? 'visage' : 'modèle de voix'}`}
                />
              </div>

              {/* Public Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Modèle public</Label>
                  <p className="text-xs text-slate-500">
                    Permettre aux autres utilisateurs d'utiliser ce modèle
                  </p>
                </div>
                <Switch
                  checked={newModelPublic}
                  onCheckedChange={setNewModelPublic}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateModel}
                  disabled={!uploadedFile || !newModelName.trim() || processingFile}
                  className="flex-1"
                >
                  {createFaceModelMutation.isPending || createVoiceModelMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Créer le modèle
                    </>
                  )}
                </Button>
                <Button
                  onClick={resetForm}
                  variant="outline"
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Models List */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Mes modèles {activeTab === 'face' ? 'de visage' : 'de voix'}
          </Label>
          
          <div className="max-h-40 overflow-y-auto space-y-2">
            {(activeTab === 'face' ? faceModels : voiceModels)?.filter((model: any) => !model.isPublic).map((model: any) => (
              <div key={model.id} className="flex items-center justify-between p-2 bg-white border rounded">
                <div className="flex items-center gap-2">
                  {activeTab === 'face' ? <Image className="h-4 w-4" /> : <Music className="h-4 w-4" />}
                  <span className="text-sm">{model.name}</span>
                  <Lock className="h-3 w-3 text-slate-400" />
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Info */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
            <span>Modèles disponibles:</span>
            <Badge variant="outline">
              {(activeTab === 'face' ? faceModels?.length : voiceModels?.length) || 0}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
            <span>Sélectionné:</span>
            <Badge variant={
              (activeTab === 'face' ? selectedFaceModel : selectedVoiceModel) ? "default" : "secondary"
            }>
              {(activeTab === 'face' ? selectedFaceModel : selectedVoiceModel) ? "Oui" : "Non"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
