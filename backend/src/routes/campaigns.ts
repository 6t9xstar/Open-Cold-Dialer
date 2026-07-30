import { Router } from "express";
import { v4 as uuid } from "uuid";
import db from "../db/database.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM campaigns ORDER BY created_at DESC").all();
  res.json(rows.map(mapCampaign));
});

router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM campaigns WHERE id = ?").get(req.params.id) as any;
  if (!row) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }
  res.json(mapCampaign(row));
});

router.post("/", (req: AuthRequest, res) => {
  const id = uuid();
  const now = new Date().toISOString();
  const { name, type, status, settings } = req.body;

  db.prepare(
    "INSERT INTO campaigns (id, name, type, status, settings, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(
    id,
    name,
    type || "outbound",
    status || "active",
    settings ? JSON.stringify(settings) : null,
    req.userId || null,
    now,
    now
  );

  const row = db.prepare("SELECT * FROM campaigns WHERE id = ?").get(id) as any;
  res.status(201).json(mapCampaign(row));
});

router.patch("/:id", (req, res) => {
  const existing = db.prepare("SELECT * FROM campaigns WHERE id = ?").get(req.params.id) as any;
  if (!existing) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }

  const { name, type, status, settings } = req.body;
  const updates: string[] = [];
  const values: any[] = [];

  if (name !== undefined) { updates.push("name = ?"); values.push(name); }
  if (type !== undefined) { updates.push("type = ?"); values.push(type); }
  if (status !== undefined) { updates.push("status = ?"); values.push(status); }
  if (settings !== undefined) { updates.push("settings = ?"); values.push(JSON.stringify(settings)); }

  if (updates.length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  updates.push("updated_at = ?");
  values.push(new Date().toISOString());
  values.push(req.params.id);

  db.prepare(`UPDATE campaigns SET ${updates.join(", ")} WHERE id = ?`).run(...values);
  const row = db.prepare("SELECT * FROM campaigns WHERE id = ?").get(req.params.id) as any;
  res.json(mapCampaign(row));
});

router.delete("/:id", (req, res) => {
  const result = db.prepare("DELETE FROM campaigns WHERE id = ?").run(req.params.id);
  if (result.changes === 0) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }
  res.status(204).end();
});

function mapCampaign(row: any) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    status: row.status,
    settings: row.settings ? JSON.parse(row.settings) : null,
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export default router;
