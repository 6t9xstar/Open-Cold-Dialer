import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import leadsRoutes from "./routes/leads.js";
import campaignsRoutes from "./routes/campaigns.js";
import callLogsRoutes from "./routes/callLogs.js";
import scriptsRoutes from "./routes/scripts.js";

const app = express();
const PORT = parseInt(process.env.PORT || "4000", 10);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/campaigns", campaignsRoutes);
app.use("/api/call-logs", callLogsRoutes);
app.use("/api/scripts", scriptsRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Cold Dialer API running on http://localhost:${PORT}`);
});
