import { 
  uploads, processes, videoSessions, faceModels, voiceModels,
  type Upload, type Process, type InsertUpload, type InsertProcess,
  type VideoSession, type InsertVideoSession, type FaceModel, type InsertFaceModel,
  type VoiceModel, type InsertVoiceModel
} from "@shared/schema";

export interface IStorage {
  // Upload operations
  createUpload(upload: InsertUpload): Promise<Upload>;
  getUpload(id: number): Promise<Upload | undefined>;
  getAllUploads(): Promise<Upload[]>;

  // Process operations
  createProcess(process: InsertProcess): Promise<Process>;
  getProcess(id: number): Promise<Process | undefined>;
  updateProcessStatus(id: number, status: string, resultPath?: string): Promise<Process | undefined>;
  getAllProcesses(): Promise<Process[]>;

  // Video session operations
  createVideoSession(session: InsertVideoSession): Promise<VideoSession>;
  getVideoSession(id: number): Promise<VideoSession | undefined>;
  getVideoSessionBySessionId(sessionId: string): Promise<VideoSession | undefined>;
  updateVideoSession(id: number, updates: Partial<VideoSession>): Promise<VideoSession | undefined>;

  // Face model operations
  createFaceModel(model: InsertFaceModel): Promise<FaceModel>;
  getFaceModel(id: number): Promise<FaceModel | undefined>;
  getAllFaceModels(): Promise<FaceModel[]>;
  getPublicFaceModels(): Promise<FaceModel[]>;

  // Voice model operations
  createVoiceModel(model: InsertVoiceModel): Promise<VoiceModel>;
  getVoiceModel(id: number): Promise<VoiceModel | undefined>;
  getAllVoiceModels(): Promise<VoiceModel[]>;
  getPublicVoiceModels(): Promise<VoiceModel[]>;
}

export class MemStorage implements IStorage {
  private uploads: Map<number, Upload>;
  private processes: Map<number, Process>;
  private videoSessions: Map<number, VideoSession>;
  private faceModels: Map<number, FaceModel>;
  private voiceModels: Map<number, VoiceModel>;
  private uploadIdCounter: number;
  private processIdCounter: number;
  private videoSessionIdCounter: number;
  private faceModelIdCounter: number;
  private voiceModelIdCounter: number;

  constructor() {
    this.uploads = new Map();
    this.processes = new Map();
    this.videoSessions = new Map();
    this.faceModels = new Map();
    this.voiceModels = new Map();
    this.uploadIdCounter = 1;
    this.processIdCounter = 1;
    this.videoSessionIdCounter = 1;
    this.faceModelIdCounter = 1;
    this.voiceModelIdCounter = 1;
    this.initializeCelebrityModels();
  }

  async createUpload(insertUpload: InsertUpload): Promise<Upload> {
    const id = this.uploadIdCounter++;
    const upload: Upload = {
      ...insertUpload,
      id,
      uploadedAt: new Date(),
    };
    this.uploads.set(id, upload);
    return upload;
  }

  async getUpload(id: number): Promise<Upload | undefined> {
    return this.uploads.get(id);
  }

  async getAllUploads(): Promise<Upload[]> {
    return Array.from(this.uploads.values());
  }

  async createProcess(insertProcess: InsertProcess): Promise<Process> {
    const id = this.processIdCounter++;
    const process: Process = {
      id,
      sourceImageId: insertProcess.sourceImageId,
      targetImageId: insertProcess.targetImageId || null,
      status: insertProcess.status || "pending",
      resultPath: insertProcess.resultPath || null,
      options: insertProcess.options || null,
      createdAt: new Date(),
      completedAt: null,
    };
    this.processes.set(id, process);
    return process;
  }

  async getProcess(id: number): Promise<Process | undefined> {
    return this.processes.get(id);
  }

  async updateProcessStatus(id: number, status: string, resultPath?: string): Promise<Process | undefined> {
    const process = this.processes.get(id);
    if (!process) return undefined;

    const updatedProcess: Process = {
      ...process,
      status,
      resultPath: resultPath || process.resultPath,
      completedAt: status === "completed" || status === "failed" ? new Date() : process.completedAt,
    };

    this.processes.set(id, updatedProcess);
    return updatedProcess;
  }

  async getAllProcesses(): Promise<Process[]> {
    return Array.from(this.processes.values());
  }

  // Video session operations
  async createVideoSession(insertSession: InsertVideoSession): Promise<VideoSession> {
    const id = this.videoSessionIdCounter++;
    const session: VideoSession = {
      id,
      sessionId: insertSession.sessionId,
      userId: insertSession.userId,
      status: insertSession.status || "active",
      faceModelId: insertSession.faceModelId || null,
      voiceModelId: insertSession.voiceModelId || null,
      createdAt: new Date(),
      endedAt: null,
    };
    this.videoSessions.set(id, session);
    return session;
  }

  async getVideoSession(id: number): Promise<VideoSession | undefined> {
    return this.videoSessions.get(id);
  }

  async getVideoSessionBySessionId(sessionId: string): Promise<VideoSession | undefined> {
    return Array.from(this.videoSessions.values()).find(s => s.sessionId === sessionId);
  }

  async updateVideoSession(id: number, updates: Partial<VideoSession>): Promise<VideoSession | undefined> {
    const session = this.videoSessions.get(id);
    if (!session) return undefined;

    const updatedSession: VideoSession = { ...session, ...updates };
    this.videoSessions.set(id, updatedSession);
    return updatedSession;
  }

  // Face model operations
  async createFaceModel(insertModel: InsertFaceModel): Promise<FaceModel> {
    const id = this.faceModelIdCounter++;
    const model: FaceModel = {
      id,
      name: insertModel.name,
      uploadId: insertModel.uploadId,
      isPublic: insertModel.isPublic || false,
      category: insertModel.category || "user",
      createdAt: new Date(),
    };
    this.faceModels.set(id, model);
    return model;
  }

  async getFaceModel(id: number): Promise<FaceModel | undefined> {
    return this.faceModels.get(id);
  }

  async getAllFaceModels(): Promise<FaceModel[]> {
    return Array.from(this.faceModels.values());
  }

  async getPublicFaceModels(): Promise<FaceModel[]> {
    return Array.from(this.faceModels.values()).filter(m => m.isPublic);
  }

  // Voice model operations
  async createVoiceModel(insertModel: InsertVoiceModel): Promise<VoiceModel> {
    const id = this.voiceModelIdCounter++;
    const model: VoiceModel = {
      id,
      name: insertModel.name,
      uploadId: insertModel.uploadId,
      isPublic: insertModel.isPublic || false,
      category: insertModel.category || "user",
      language: insertModel.language || "fr",
      createdAt: new Date(),
    };
    this.voiceModels.set(id, model);
    return model;
  }

  async getVoiceModel(id: number): Promise<VoiceModel | undefined> {
    return this.voiceModels.get(id);
  }

  async getAllVoiceModels(): Promise<VoiceModel[]> {
    return Array.from(this.voiceModels.values());
  }

  async getPublicVoiceModels(): Promise<VoiceModel[]> {
    return Array.from(this.voiceModels.values()).filter(m => m.isPublic);
  }

  // Initialize with face models based on provided reference images
  private initializeCelebrityModels() {
    // Create face models based on the provided reference images
    const faceModels = [
      { name: "Modèle Féminin Classique", category: "professional", description: "Style élégant et naturel" },
      { name: "Modèle Masculin Moderne", category: "professional", description: "Apparence contemporaine" },
      { name: "Modèle Masculin Jeune", category: "professional", description: "Style décontracté" },
      { name: "Modèle Féminin Élégant", category: "professional", description: "Look sophistiqué" },
      { name: "Modèle Féminin Décontracté", category: "professional", description: "Style naturel" },
      { name: "Modèle Féminin Professionnel", category: "professional", description: "Apparence business" },
      { name: "Modèle Féminin Sportif", category: "professional", description: "Look athlétique" },
      { name: "Modèle Féminin Vintage", category: "professional", description: "Style rétro" },
      { name: "Modèle Féminin Naturel", category: "professional", description: "Beauté authentique" },
      { name: "Modèle Féminin Glamour", category: "professional", description: "Look sophistiqué" },
      { name: "Modèle Féminin Contemporain", category: "professional", description: "Style moderne" },
      { name: "Modèle Féminin Sophistiqué", category: "professional", description: "Élégance raffinée" },
    ];

    faceModels.forEach((model, index) => {
      const id = this.faceModelIdCounter++;
      const uploadId = index + 1000;
      this.faceModels.set(id, {
        id,
        name: model.name,
        uploadId: uploadId,
        isPublic: true,
        category: model.category,
        createdAt: new Date(),
      });
    });

    // Create diverse voice models
    const voiceModels = [
      { name: "Voix Féminine Douce", category: "professional", language: "fr" },
      { name: "Voix Masculine Grave", category: "professional", language: "fr" },
      { name: "Voix Narrative", category: "professional", language: "fr" },
      { name: "Voix Féminine Énergique", category: "professional", language: "fr" },
      { name: "Voix Masculine Jeune", category: "professional", language: "fr" },
      { name: "Voix Féminine Professionnelle", category: "professional", language: "fr" },
      { name: "Voix Masculine Profonde", category: "professional", language: "fr" },
      { name: "Voix Féminine Chaleureuse", category: "professional", language: "fr" },
    ];

    voiceModels.forEach((voice, index) => {
      const id = this.voiceModelIdCounter++;
      const uploadId = index + 2000;
      this.voiceModels.set(id, {
        id,
        name: voice.name,
        uploadId: uploadId,
        isPublic: true,
        category: voice.category,
        language: voice.language,
        createdAt: new Date(),
      });
    });
  }
}

export const storage = new MemStorage();