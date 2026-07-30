import db from "./database.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";

const FIRST_NAMES = [
  "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael",
  "Linda", "David", "Elizabeth", "William", "Barbara", "Richard", "Susan",
  "Joseph", "Jessica", "Thomas", "Sarah", "Christopher", "Karen",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
  "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
  "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
];

const COMPANIES = [
  "Apex Medical Group", "Summit Healthcare", "Valley Clinic", "Pinnacle Health",
  "Harbor Medical Associates", "Ridgeview Practice", "Coastal Health Partners",
  "Metro Wellness Center", "Lakeside Medical", "Gateway Health Systems",
  "Prairie Health Clinic", "Mountain View Practice", "River Valley Medical",
  "Sunrise Health Group", "Horizon Medical", "Oakwood Health Center",
  "Bayshore Medical", "Cedar Creek Practice", "Stonegate Health", "Maplewood Clinic",
];

const CITIES = [
  { city: "Newark", state: "NJ", zip: "07101" },
  { city: "Jersey City", state: "NJ", zip: "07302" },
  { city: "Paterson", state: "NJ", zip: "07501" },
  { city: "Elizabeth", state: "NJ", zip: "07201" },
  { city: "Trenton", state: "NJ", zip: "08608" },
  { city: "Camden", state: "NJ", zip: "08102" },
  { city: "Hackensack", state: "NJ", zip: "07601" },
  { city: "Morristown", state: "NJ", zip: "07960" },
];

const STATUSES = ["new", "contacted", "interested", "not_interested", "callback", "converted", "do_not_contact"] as const;
const OUTCOMES = ["no_answer", "answered", "busy", "voicemail", "dnc", "wrong_number", "disconnected"] as const;

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone(): string {
  const area = Math.floor(Math.random() * 900) + 100;
  const mid = Math.floor(Math.random() * 900) + 100;
  const last = Math.floor(Math.random() * 9000) + 1000;
  return `+1${area}${mid}${last}`;
}

function seed() {
  console.log("Seeding database...");

  const userId = uuid();
  const passwordHash = bcrypt.hashSync("password123", 10);
  db.prepare(
    "INSERT INTO profiles (id, email, full_name, role) VALUES (?, ?, ?, ?)"
  ).run(userId, "admin@example.com", "Admin User", "admin");

  const campaignIds: string[] = [];
  const campaignNames = ["Q1 Outreach", "Medical Practices NJ"];
  for (const name of campaignNames) {
    const id = uuid();
    campaignIds.push(id);
    db.prepare(
      "INSERT INTO campaigns (id, name, type, status, created_by) VALUES (?, ?, 'outbound', 'active', ?)"
    ).run(id, name, userId);
  }

  const scriptId = uuid();
  db.prepare(
    "INSERT INTO call_scripts (id, title, category, content, objection_responses, created_by) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(
    scriptId,
    "Cold Outreach Script",
    "General",
    "Good morning, this is Luke from your company. I'm reaching out because we help specialty practices like yours streamline operations and reduce overhead. Do you have a few minutes to discuss how we can save your practice time and money each month?",
    JSON.stringify({
      "We're happy with our current setup": {
        response: "That's great to hear. Many of our clients felt the same way until they saw our average 30% reduction in overhead. Could I show you a quick comparison?",
        category: "satisfaction",
      },
      "I don't have time right now": {
        response: "I completely understand. This is a 15-minute conversation that could save hours each week. When would be a better time?",
        category: "time",
      },
      "Send me an email instead": {
        response: "I'd love to send over our case study, but a quick call is much faster. I can show you real numbers from practices just like yours. Would 10 minutes tomorrow work?",
        category: "deferral",
      },
    }),
    userId
  );

  for (let i = 0; i < 20; i++) {
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);
    const location = pick(CITIES);
    const status = pick(STATUSES);
    const campaignId = campaignIds[i % campaignIds.length];

    db.prepare(
      `INSERT INTO leads (id, first_name, last_name, company, phone, email, city, state, zip, status, source, campaign_id, call_count, dnc)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'import', ?, ?, ?)`
    ).run(
      uuid(),
      firstName,
      lastName,
      pick(COMPANIES),
      randomPhone(),
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      location.city,
      location.state,
      location.zip,
      status,
      campaignId,
      Math.floor(Math.random() * 5),
      status === "do_not_contact" ? 1 : 0
    );
  }

  const leadIds = db
    .prepare("SELECT id FROM leads LIMIT 5")
    .all()
    .map((r: any) => r.id);

  for (const leadId of leadIds) {
    const outcome = pick(OUTCOMES);
    db.prepare(
      `INSERT INTO call_logs (id, lead_id, user_id, direction, outcome, duration_seconds, notes, created_at)
       VALUES (?, ?, ?, 'outbound', ?, ?, ?, datetime('now', '-' || ? || ' hours'))`
    ).run(
      uuid(),
      leadId,
      userId,
      outcome,
      Math.floor(Math.random() * 180),
      outcome === "answered" ? "Spoke with decision maker" : "No response",
      Math.floor(Math.random() * 72)
    );
  }

  console.log("Seeded: 1 admin user, 2 campaigns, 1 script, 20 leads, 5 call logs");
}

seed();
