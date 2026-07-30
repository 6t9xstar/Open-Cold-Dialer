import { Router } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import db from "../db/database.js";
import { generateToken, authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const existing = db.prepare("SELECT id FROM profiles WHERE email = ?").get(email);
    if (existing) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const id = uuid();
    const passwordHash = await bcrypt.hash(password, 10);

    db.prepare(
      "INSERT INTO profiles (id, email, full_name, role) VALUES (?, ?, ?, 'agent')"
    ).run(id, email, fullName || null);

    const token = generateToken(id);
    res.json({
      user: { id, email, fullName: fullName || null, role: "agent" },
      token,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = db.prepare("SELECT * FROM profiles WHERE email = ?").get(email) as any;
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = generateToken(user.id);
    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
      token,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/me", authMiddleware, (req: AuthRequest, res) => {
  const user = db.prepare("SELECT * FROM profiles WHERE id = ?").get(req.userId!) as any;
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    role: user.role,
  });
});

export default router;
