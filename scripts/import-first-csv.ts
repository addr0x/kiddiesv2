import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const CSV_PATH = resolve(process.env.HOME!, "Desktop/leads/first.csv");
const PICTURES_DIR = resolve(process.env.HOME!, "Desktop/pictures");
const API_URL = "http://localhost:3009/api/contestant";

function titlecase(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function parseAge(raw: string): string {
  const val = raw.trim().toLowerCase();

  // Pure number 0-8
  if (/^[0-8]$/.test(val)) return val;

  // Contains "week" or "day" → 0
  if (/\b(week|day)/.test(val)) return "0";

  // Contains month(s) — extract number, floor divide by 12
  const monthMatch = val.match(/(\d+)\s*months?/);
  if (monthMatch) {
    const months = parseInt(monthMatch[1], 10);
    return String(Math.floor(months / 12));
  }

  // Contains "month" (without plural or number) → 0
  if (/\bmonth\b/.test(val)) return "0";

  // Contains year(s) or yrs — extract leading digits
  const yearMatch = val.match(/(\d+)\s*(?:years?|yrs?)/);
  if (yearMatch) return yearMatch[1];

  // "FOUR YEAR", "ONE YEAR" etc — extract embedded digit
  const digitMatch = val.match(/\b(\d)\b/);
  if (digitMatch) return digitMatch[1];

  // "7+" — strip non-digits
  const plusMatch = val.match(/^(\d)\+/);
  if (plusMatch) return plusMatch[1];

  // Range like "0-2 years" — take lower bound
  const rangeMatch = val.match(/^(\d)\s*-\s*\d/);
  if (rangeMatch) return rangeMatch[1];

  // Fallback: any digit found
  const anyDigit = val.match(/(\d)/);
  if (anyDigit) return anyDigit[1];

  return "0";
}

function splitName(fullName: string): [string, string] {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return ["Contestant", parts[0]];
  }
  return [parts[0], parts.slice(1).join(" ")];
}

function picturePath(id: string, gender: string): string | null {
  const padded = id.padStart(3, "0");
  const specific = resolve(PICTURES_DIR, `${padded}.jpeg`);
  if (existsSync(specific)) return specific;

  const def = gender === "female" ? "fe.jpg" : "ma.jpg";
  const fallback = resolve(PICTURES_DIR, def);
  if (existsSync(fallback)) return fallback;

  return null;
}

interface Row {
  id: string;
  name: string;
  gender: string;
  age: string;
  parent: string;
  phone: string;
  whatsapp: string;
}

function parseCSV(): Row[] {
  const raw = readFileSync(CSV_PATH, { encoding: "utf-16le" });
  const lines = raw.replace(/\r/g, "").split("\n").filter(Boolean);
  const header = lines[0].replace(/^\uFEFF/, "").split("\t");

  return lines.slice(1).map((line) => {
    const cols = line.split("\t");
    const obj: Record<string, string> = {};
    header.forEach((h, i) => {
      obj[h.trim()] = (cols[i] || "").trim();
    });
    return {
      id: obj["ID"],
      name: obj["Name"],
      gender: obj["Gender"],
      age: obj["Age"],
      parent: obj["Parent"],
      phone: obj["Phone"],
      whatsapp: obj["WhatsApp"],
    };
  });
}

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const rows = parseCSV();
  console.log(`Total rows: ${rows.length}\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const id = row.id.padStart(3, "0");

    const [firstName, lastName] = splitName(row.name);
    const firstNameClean = titlecase(firstName);
    const lastNameClean = titlecase(lastName);
    const age = parseAge(row.age);
    const parentClean = titlecase(row.parent);
    const genderClean = row.gender.trim().toLowerCase();
    const pic = picturePath(row.id, genderClean);

    if (!pic) {
      console.log(`✗ ID ${id}: No picture found`);
      failed++;
      continue;
    }

    try {
      const form = new FormData();
      form.append("firstName", firstNameClean);
      form.append("lastName", lastNameClean);
      form.append("gender", genderClean);
      form.append("age", age);
      form.append("parent", parentClean);
      form.append("phone", row.phone);
      form.append("whatsapp", row.whatsapp);

      const fileBuffer = readFileSync(pic);
      const blob = new Blob([fileBuffer], {
        type: pic.endsWith(".png") ? "image/png" : "image/jpeg",
      });
      form.append("picture", blob, `pic-${id}.jpg`);

      const res = await fetch(API_URL, { method: "POST", body: form });
      const body = await res.json();

      if (res.ok) {
        console.log(`✓ ID ${id}: ${body.name} (${body.id})`);
        success++;
      } else {
        console.log(`✗ ID ${id}: ${body.error}`);
        failed++;
      }
    } catch (err: any) {
      console.log(`✗ ID ${id}: ${err.message}`);
      failed++;
    }

    // Small delay between requests
    await delay(200);
  }

  console.log(`\nDone. ${success} succeeded, ${failed} failed out of ${rows.length}`);
}

main().catch(console.error);
