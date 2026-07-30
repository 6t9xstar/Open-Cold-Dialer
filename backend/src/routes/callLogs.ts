import { Router } from "express";
import { v4 as uuid } from "uuid";
import db from "../db/database.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM call_logs ORDER BY created_at DESC").all();
  res.json(rows.map(mapCallLog));
});

router.get("/lead/:leadId", (req, res) => {
  const rows = db.prepare(
    "SELECT * FROM call_logs WHERE lead_id = ? ORDER BY created_at DESC"
  ).all(req.params.leadId);
  res.json(rows.map(mapCallLog));
});

router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM call_logs WHERE id = ?").get(req.params.id) as any;
  if (!row) {
    res.status(404).json({ error: "Call log not found" });
    return;
  }
  res.json(mapCallLog(row));
});

router.post("/", (req: AuthRequest, res) => {
  const id = uuid();
  const {
    lead_id, user_id, campaign_id, direction, outcome,
    duration_seconds, recording_url, notes, transcript,
    sip_call_id, started_at, ended_at,
  } = req.body;

  db.prepare(
    `INSERT INTO call_logs (id, lead_id, user_id, campaign_id, direction, outcome, duration_seconds, recording_url, notes, transcript, sip_call_id, started_at, ended_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    lead_id || null,
    user_id || req.userId || null,
    campaign_id || null,
    direction || "outbound",
    outcome || "no_answer",
    duration_seconds || 0,
    recording_url || null,
    notes || null,
    transcript || null,
    sip_call_id || null,
    started_at || null,
    ended_at || null
  );

  if (lead_id) {
    db.prepare(
      "UPDATE leads SET last_called_at = datetime('now'), call_count = call_count + 1 WHERE id = ?"
    ).run(lead_id);
  }

  const row = db.prepare("SELECT * FROM call_logs WHERE id = ?").get(id) as any;
  res.status(201).json(mapCallLog(row));
});

router.delete("/:id", (req, res) => {
  const result = db.prepare("DELETE FROM call_logs WHERE id = ?").run(req.params.id);
  if (result.changes === 0) {
    res.status(404).json({ error: "Call log not found" });
    return;
  }
  res.status(204).end();
});

function mapCallLog(row: any) {
  return {
    id: row.id,
    lead_id: row.lead_id,
    user_id: row.user_id,
    campaign_id: row.campaign_id,
    direction: row.direction,
    outcome: row.outcome,
    duration_seconds: row.duration_seconds,
    recording_url: row.recording_url,
    notes: row.notes,
    transcript: row.transcript,
    sip_call_id: row.sip_call_id,
    started_at: row.started_at,
    ended_at: row.ended_at,
    created_at: row.created_at,
  };
}

export default router;
