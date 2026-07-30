import { Router } from "express";
import { v4 as uuid } from "uuid";
import db from "../db/database.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM call_scripts ORDER BY created_at DESC").all();
  res.json(rows.map(mapScript));
});

router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM call_scripts WHERE id = ?").get(req.params.id) as any;
  if (!row) {
    res.status(404).json({ error: "Script not found" });
    return;
  }
  res.json(mapScript(row));
});

router.post("/", (req: AuthRequest, res) => {
  const id = uuid();
  const now = new Date().toISOString();
  const { title, category, content, objection_responses, campaign_id, is_active } = req.body;

  db.prepare(
    `INSERT INTO call_scripts (id, title, category, content, objection_responses, campaign_id, created_by, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    title,
    category || null,
    content || null,
    objection_responses ? JSON.stringify(objection_responses) : null,
    campaign_id || null,
    req.userId || null,
    is_active !== undefined ? (is_active ? 1 : 0) : 1,
    now,
    now
  );

  const row = db.prepare("SELECT * FROM call_scripts WHERE id = ?").get(id) as any;
  res.status(201).json(mapScript(row));
});

router.patch("/:id", (req, res) => {
  const existing = db.prepare("SELECT * FROM call_scripts WHERE id = ?").get(req.params.id) as any;
  if (!existing) {
    res.status(404).json({ error: "Script not found" });
    return;
  }

  const { title, category, content, objection_responses, campaign_id, is_active } = req.body;
  const updates: string[] = [];
  const values: any[] = [];

  if (title !== undefined) { updates.push("title = ?"); values.push(title); }
  if (category !== undefined) { updates.push("category = ?"); values.push(category); }
  if (content !== undefined) { updates.push("content = ?"); values.push(content); }
  if (objection_responses !== undefined) { updates.push("objection_responses = ?"); values.push(JSON.stringify(objection_responses)); }
  if (campaign_id !== undefined) { updates.push("campaign_id = ?"); values.push(campaign_id); }
  if (is_active !== undefined) { updates.push("is_active = ?"); values.push(is_active ? 1 : 0); }

  if (updates.length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  updates.push("updated_at = ?");
  values.push(new Date().toISOString());
  values.push(req.params.id);

  db.prepare(`UPDATE call_scripts SET ${updates.join(", ")} WHERE id = ?`).run(...values);
  const row = db.prepare("SELECT * FROM call_scripts WHERE id = ?").get(req.params.id) as any;
  res.json(mapScript(row));
});

router.delete("/:id", (req, res) => {
  const result = db.prepare("DELETE FROM call_scripts WHERE id = ?").run(req.params.id);
  if (result.changes === 0) {
    res.status(404).json({ error: "Script not found" });
    return;
  }
  res.status(204).end();
});

function mapScript(row: any) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    content: row.content,
    objection_responses: row.objection_responses ? JSON.parse(row.objection_responses) : null,
    campaign_id: row.campaign_id,
    created_by: row.created_by,
    is_active: Boolean(row.is_active),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export default router;
