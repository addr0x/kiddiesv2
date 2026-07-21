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

  if (/^[0-8]$/.test(val)) return val;

  if (/\b(week|day)/.test(val)) return "0";

  const monthMatch = val.match(/(\d+)\s*months?/);
  if (monthMatch) {
    const months = parseInt(monthMatch[1], 10);
    return String(Math.floor(months / 12));
  }

  if (/\bmonth\b/.test(val)) return "0";

  const yearMatch = val.match(/(\d+)\s*(?:years?|yrs?)/);
  if (yearMatch) return yearMatch[1];

  const digitMatch = val.match(/\b(\d)\b/);
  if (digitMatch) return digitMatch[1];

  const plusMatch = val.match(/^(\d)\+/);
  if (plusMatch) return plusMatch[1];

  const rangeMatch = val.match(/^(\d)\s*-\s*\d/);
  if (rangeMatch) return rangeMatch[1];

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
  const allRows = parseCSV();
  const rows = allRows.filter((r) => {
    const n = parseInt(r.id, 10);
    return n >= 85 && n <= 96;
  });

  console.log(`Importing ${rows.length} contestants (IDs 085-096)...\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const id = row.id.padStart(3, "0");

    const [firstName, lastName] = splitName(row.name);
    const firstNameClean = titlecase(firstName);
    const lastNameClean = titlecase(lastName);
    const age = parseAge(row.age);
    const sanitizedParent = row.parent.replace(/[^A-Za-z\s'-]/g, "").trim();
    const parentClean = titlecase(sanitizedParent);
    const genderClean = row.gender.trim().toLowerCase();
    const pic = picturePath(row.id, genderClean);

    if (!pic) {
      console.log(`✗ ID ${id}: No picture found (no fallback either)`);
      failed++;
      console.log("\nStopping due to error. Fix and resume.");
      process.exit(1);
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
        console.log(`\nStopping at ID ${id}. Error: ${body.error}`);
        console.log("Row data:", JSON.stringify(row, null, 2));
        console.log("Fix the issue and I'll resume from this row.");
        process.exit(1);
      }
    } catch (err: any) {
      console.log(`✗ ID ${id}: ${err.message}`);
      failed++;
      console.log(`\nStopping at ID ${id}. Error: ${err.message}`);
      console.log("Row data:", JSON.stringify(row, null, 2));
      console.log("Fix the issue and I'll resume from this row.");
      process.exit(1);
    }

    await delay(200);
  }

  console.log(`\nDone. ${success} succeeded, ${failed} failed.`);
}

main().catch(console.error);