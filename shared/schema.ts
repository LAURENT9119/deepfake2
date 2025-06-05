import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const uploads = pgTable("uploads", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimetype: text("mimetype").notNull(),
  size: integer("size").notNull(),
  path: text("path").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const processes = pgTable("processes", {
  id: serial("id").primaryKey(),
  sourceImageId: integer("source_image_id").references(() => uploads.id).notNull(),
  targetImageId: integer("target_image_id").references(() => uploads.id),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  resultPath: text("result_path"),
  options: text("options"), // JSON string of processing options
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const videoSessions = pgTable("video_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  userId: text("user_id").notNull(),
  status: text("status").notNull().default("active"), // active, ended
  faceModelId: integer("face_model_id").references(() => uploads.id),
  voiceModelId: integer("voice_model_id").references(() => uploads.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
});

export const faceModels = pgTable("face_models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  uploadId: integer("upload_id").references(() => uploads.id).notNull(),
  isPublic: boolean("is_public").default(false),
  category: text("category").default("user"), // user, celebrity, character
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const voiceModels = pgTable("voice_models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  uploadId: integer("upload_id").references(() => uploads.id).notNull(),
  isPublic: boolean("is_public").default(false),
  category: text("category").default("user"), // user, celebrity, character
  language: text("language").default("fr"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUploadSchema = createInsertSchema(uploads).omit({
  id: true,
  uploadedAt: true,
});

export const insertProcessSchema = createInsertSchema(processes).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertVideoSessionSchema = createInsertSchema(videoSessions).omit({
  id: true,
  createdAt: true,
  endedAt: true,
});

export const insertFaceModelSchema = createInsertSchema(faceModels).omit({
  id: true,
  createdAt: true,
});

export const insertVoiceModelSchema = createInsertSchema(voiceModels).omit({
  id: true,
  createdAt: true,
});

export type Upload = typeof uploads.$inferSelect;
export type InsertUpload = z.infer<typeof insertUploadSchema>;
export type Process = typeof processes.$inferSelect;
export type InsertProcess = z.infer<typeof insertProcessSchema>;
export type VideoSession = typeof videoSessions.$inferSelect;
export type InsertVideoSession = z.infer<typeof insertVideoSessionSchema>;
export type FaceModel = typeof faceModels.$inferSelect;
export type InsertFaceModel = z.infer<typeof insertFaceModelSchema>;
export type VoiceModel = typeof voiceModels.$inferSelect;
export type InsertVoiceModel = z.infer<typeof insertVoiceModelSchema>;
