import { Router } from "express";
import { v4 as uuid } from "uuid";
import db from "../db/database.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM leads ORDER BY created_at DESC").all();
  res.json(rows.map(mapLead));
});

router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM leads WHERE id = ?").get(req.params.id) as any;
  if (!row) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }
  res.json(mapLead(row));
});

router.post("/", (req: AuthRequest, res) => {
  const id = uuid();
  const now = new Date().toISOString();
  const {
    first_name, last_name, company, phone, email, website,
    address, city, state, zip, status, source, campaign_id,
    assigned_to, tags, notes, dnc,
  } = req.body;

  db.prepare(
    `INSERT INTO leads (id, first_name, last_name, company, phone, email, website, address, city, state, zip, status, source, campaign_id, assigned_to, tags, notes, dnc, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id, first_name || null, last_name || null, company || null,
    phone || null, email || null, website || null, address || null,
    city || null, state || null, zip || null, status || "new",
    source || null, campaign_id || null, assigned_to || null,
    tags ? JSON.stringify(tags) : null, notes || null,
    dnc ? 1 : 0, now, now
  );

  const row = db.prepare("SELECT * FROM leads WHERE id = ?").get(id) as any;
  res.status(201).json(mapLead(row));
});

router.patch("/:id", (req, res) => {
  const existing = db.prepare("SELECT * FROM leads WHERE id = ?").get(req.params.id) as any;
  if (!existing) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }

  const fields = [
    "first_name", "last_name", "company", "phone", "email", "website",
    "address", "city", "state", "zip", "status", "source", "campaign_id",
    "assigned_to", "tags", "notes", "dnc", "last_called_at", "call_count",
  ];

  const updates: string[] = [];
  const values: any[] = [];

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(field === "tags" ? JSON.stringify(req.body[field]) : req.body[field]);
    }
  }

  if (updates.length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  updates.push("updated_at = ?");
  values.push(new Date().toISOString());
  values.push(req.params.id);

  db.prepare(`UPDATE leads SET ${updates.join(", ")} WHERE id = ?`).run(...values);
  const row = db.prepare("SELECT * FROM leads WHERE id = ?").get(req.params.id) as any;
  res.json(mapLead(row));
});

router.delete("/:id", (req, res) => {
  const result = db.prepare("DELETE FROM leads WHERE id = ?").run(req.params.id);
  if (result.changes === 0) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }
  res.status(204).end();
});

router.post("/import", (req: AuthRequest, res) => {
  const { rows } = req.body;
  if (!Array.isArray(rows) || rows.length === 0) {
    res.status(400).json({ error: "No rows to import" });
    return;
  }

  const insert = db.prepare(
    `INSERT INTO leads (id, first_name, last_name, company, phone, email, website, address, city, state, zip, status, source, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
  );

  const insertMany = db.transaction((items: any[]) => {
    let count = 0;
    for (const row of items) {
      try {
        insert.run(
          uuid(),
          row.first_name || null,
          row.last_name || null,
          row.company || null,
          row.phone || null,
          row.email || null,
          row.website || null,
          row.address || null,
          row.city || null,
          row.state || null,
          row.zip || null,
          row.status || "new",
          row.source || "import"
        );
        count++;
      } catch {}
    }
    return count;
  });

  const imported = insertMany(rows);
  res.json({ imported, total: rows.length });
});

function mapLead(row: any) {
  return {
    id: row.id,
    first_name: row.first_name,
    last_name: row.last_name,
    company: row.company,
    phone: row.phone,
    email: row.email,
    website: row.website,
    address: row.address,
    city: row.city,
    state: row.state,
    zip: row.zip,
    status: row.status,
    source: row.source,
    campaign_id: row.campaign_id,
    assigned_to: row.assigned_to,
    tags: row.tags ? JSON.parse(row.tags) : null,
    notes: row.notes,
    dnc: Boolean(row.dnc),
    last_called_at: row.last_called_at,
    call_count: row.call_count,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export default router;
