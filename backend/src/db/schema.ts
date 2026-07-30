import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  role: text("role", { enum: ["admin", "agent", "manager"] })
    .notNull()
    .default("agent"),
  createdAt: text("created_at")
    .notNull()
    .default(new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .default(new Date().toISOString()),
});

export const campaigns = sqliteTable("campaigns", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ["outbound", "inbound", "blended"] })
    .notNull()
    .default("outbound"),
  status: text("status", { enum: ["active", "paused", "completed"] })
    .notNull()
    .default("active"),
  settings: text("settings"),
  createdBy: text("created_by"),
  createdAt: text("created_at")
    .notNull()
    .default(new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .default(new Date().toISOString()),
});

export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  company: text("company"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zip: text("zip"),
  status: text("status", {
    enum: [
      "new",
      "contacted",
      "interested",
      "not_interested",
      "callback",
      "converted",
      "do_not_contact",
    ],
  })
    .notNull()
    .default("new"),
  source: text("source"),
  campaignId: text("campaign_id"),
  assignedTo: text("assigned_to"),
  tags: text("tags"),
  notes: text("notes"),
  dnc: integer("dnc", { mode: "boolean" }).notNull().default(false),
  lastCalledAt: text("last_called_at"),
  callCount: integer("call_count").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .default(new Date().toISOString()),
});

export const callScripts = sqliteTable("call_scripts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category"),
  content: text("content"),
  objectionResponses: text("objection_responses"),
  campaignId: text("campaign_id"),
  createdBy: text("created_by"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at")
    .notNull()
    .default(new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .default(new Date().toISOString()),
});

export const callLogs = sqliteTable("call_logs", {
  id: text("id").primaryKey(),
  leadId: text("lead_id"),
  userId: text("user_id"),
  campaignId: text("campaign_id"),
  direction: text("direction", { enum: ["outbound", "inbound"] })
    .notNull()
    .default("outbound"),
  outcome: text("outcome", {
    enum: [
      "no_answer",
      "answered",
      "busy",
      "voicemail",
      "dnc",
      "wrong_number",
      "disconnected",
    ],
  }).notNull(),
  durationSeconds: integer("duration_seconds").notNull().default(0),
  recordingUrl: text("recording_url"),
  notes: text("notes"),
  transcript: text("transcript"),
  sipCallId: text("sip_call_id"),
  startedAt: text("started_at"),
  endedAt: text("ended_at"),
  createdAt: text("created_at")
    .notNull()
    .default(new Date().toISOString()),
});

export const appointments = sqliteTable("appointments", {
  id: text("id").primaryKey(),
  leadId: text("lead_id").notNull(),
  userId: text("user_id").notNull(),
  scheduledAt: text("scheduled_at").notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(30),
  type: text("type", {
    enum: ["sales_call", "demo", "follow_up", "consultation", "check_in"],
  }).notNull(),
  status: text("status", {
    enum: ["scheduled", "completed", "cancelled", "rescheduled"],
  })
    .notNull()
    .default("scheduled"),
  notes: text("notes"),
  createdAt: text("created_at")
    .notNull()
    .default(new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .default(new Date().toISOString()),
});

export const dncList = sqliteTable("dnc_list", {
  id: text("id").primaryKey(),
  phone: text("phone").notNull().unique(),
  reason: text("reason"),
  source: text("source"),
  createdBy: text("created_by"),
  createdAt: text("created_at")
    .notNull()
    .default(new Date().toISOString()),
});
