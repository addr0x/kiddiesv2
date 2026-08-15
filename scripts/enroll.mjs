#!/usr/bin/env node

import { readFile, readdir, stat } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { parse } from "csv-parse/sync";

const DEFAULT_CSV_PATH = path.join(homedir(), "Desktop/leads/contestants.csv");
const DEFAULT_PICTURES_DIR = path.join(homedir(), "Desktop/leads/pictures");
const DEFAULT_API_URL = "http://localhost:3009";
const EXPECTED_CONTESTANT_COUNT = 226;
const IMAGE_EXTENSIONS = new Set([".jpeg", ".jpg", ".png", ".webp"]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function usage() {
  console.log(`
Usage:
  scripts/enroll.mjs [--execute] [--csv PATH] [--pictures DIR] [--api-url URL]

Without --execute, the script only validates and previews the import.

Defaults:
  CSV:       ${DEFAULT_CSV_PATH}
  Pictures:  ${DEFAULT_PICTURES_DIR}
  API URL:   ${DEFAULT_API_URL}
`);
}

function parseArguments(argv) {
  const options = {
    execute: false,
    csvPath: DEFAULT_CSV_PATH,
    picturesDir: DEFAULT_PICTURES_DIR,
    apiUrl: process.env.API_URL?.replace(/\/$/, "") || DEFAULT_API_URL,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === "--execute") {
      options.execute = true;
      continue;
    }

    if (argument === "--help" || argument === "-h") {
      usage();
      process.exit(0);
    }

    const valueOptions = {
      "--csv": "csvPath",
      "--pictures": "picturesDir",
      "--api-url": "apiUrl",
    };
    const property = valueOptions[argument];
    if (!property || !argv[index + 1]) {
      throw new Error(`Unknown or incomplete argument: ${argument}`);
    }

    options[property] = argv[index + 1];
    index += 1;
  }

  options.csvPath = path.resolve(options.csvPath);
  options.picturesDir = path.resolve(options.picturesDir);
  options.apiUrl = options.apiUrl.replace(/\/$/, "");
  return options;
}

function normalizeHeaders(record) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key.trim().toLowerCase(), String(value).trim()]),
  );
}

function titleCase(value) {
  return value
    .toLowerCase()
    .replace(/(^|[\s'-])([a-z])/g, (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`);
}

function asciiLetters(value) {
  return value
    .replaceAll("Ł", "L")
    .replaceAll("ł", "l")
    .replaceAll("Œ", "Oe")
    .replaceAll("œ", "oe")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitContestantName(rawName) {
  const cleaned = titleCase(asciiLetters(rawName));
  const parts = cleaned.split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    throw new Error("Contestant name is empty after cleaning");
  }

  if (parts.length === 1) {
    return { firstName: "Contestant", lastName: parts[0] };
  }

  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function cleanParentName(rawParent) {
  const withoutDescription = rawParent.split("|")[0];
  const cleaned = titleCase(asciiLetters(withoutDescription));
  if (!cleaned) throw new Error("Parent name is empty after cleaning");
  return cleaned;
}

const NUMBER_WORDS = new Map([
  ["zero", 0],
  ["one", 1],
  ["two", 2],
  ["three", 3],
  ["four", 4],
  ["five", 5],
  ["six", 6],
  ["seven", 7],
  ["eight", 8],
  ["nine", 9],
]);

function firstWrittenNumber(value) {
  for (const [word, number] of NUMBER_WORDS) {
    if (new RegExp(`\\b${word}\\b`).test(value)) return number;
  }
  return null;
}

function parseAge(rawAge) {
  const value = rawAge.toLowerCase().trim().replace(/\b0ne\b/g, "one");

  const range = value.match(/^(\d+)\s*-/);
  if (range) return Math.min(Number(range[1]), 8);

  const yearNumber = value.match(/(\d+)\s*(?:years?|yrs?|yr)(?![a-z])/);
  if (yearNumber) return Math.min(Number(yearNumber[1]), 8);

  const writtenNumber = firstWrittenNumber(value);
  if (/years?|yrs?|\byr\b/.test(value) && writtenNumber !== null) {
    return Math.min(writtenNumber, 8);
  }

  const monthNumber = value.match(/(\d+)\s*:?[\s-]*months?/);
  if (monthNumber) return Math.min(Math.floor(Number(monthNumber[1]) / 12), 8);

  if (/months?/.test(value) && writtenNumber !== null) {
    return Math.min(Math.floor(writtenNumber / 12), 8);
  }

  if (/^months?(?:\s+old)?$/.test(value)) return 0;

  if (/weeks?|days?/.test(value)) return 0;

  const bareNumber = value.match(/^\d+/);
  if (bareNumber) return Math.min(Number(bareNumber[0]), 8);

  if (writtenNumber !== null) return Math.min(writtenNumber, 8);

  throw new Error(`Cannot interpret age: ${rawAge}`);
}

function mimeTypeFor(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  throw new Error(`Unsupported image extension: ${extension}`);
}

function validateApiFields(contestant) {
  const validName = /^[A-Za-z][A-Za-z\s'-]{0,49}$/;
  const validPhone = /^\+?[0-9\s()-]{7,20}$/;

  if (!validName.test(contestant.firstName)) {
    throw new Error(`ID ${contestant.id} has an invalid first name: ${contestant.firstName}`);
  }
  if (!validName.test(contestant.lastName)) {
    throw new Error(`ID ${contestant.id} has an invalid last name: ${contestant.lastName}`);
  }
  if (!validName.test(contestant.parent)) {
    throw new Error(`ID ${contestant.id} has an invalid parent name: ${contestant.parent}`);
  }
  if (!validPhone.test(contestant.phone)) {
    throw new Error(`ID ${contestant.id} has an invalid phone number: ${contestant.phone}`);
  }
  if (!validPhone.test(contestant.whatsapp)) {
    throw new Error(`ID ${contestant.id} has an invalid WhatsApp number: ${contestant.whatsapp}`);
  }
}

async function buildImageIndex(picturesDir) {
  const files = await readdir(picturesDir);
  const index = new Map();

  for (const file of files) {
    const extension = path.extname(file).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(extension)) continue;

    const stem = path.parse(file).name;
    if (!/^\d+$/.test(stem)) continue;

    const id = String(Number(stem)).padStart(3, "0");
    if (index.has(id)) {
      throw new Error(`Multiple pictures match contestant ID ${id}`);
    }
    index.set(id, path.join(picturesDir, file));
  }

  return index;
}

async function validateImage(filePath) {
  const metadata = await stat(filePath);
  if (!metadata.isFile()) throw new Error(`Image is not a file: ${filePath}`);
  if (metadata.size > MAX_IMAGE_BYTES) {
    throw new Error(`Image exceeds 5 MB: ${filePath}`);
  }
  mimeTypeFor(filePath);
}

async function loadContestants(csvPath, picturesDir) {
  const csv = (await readFile(csvPath, "utf8")).replace(/^\uFEFF/, "");
  const rawRecords = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  const records = rawRecords.map(normalizeHeaders);

  if (records.length !== EXPECTED_CONTESTANT_COUNT) {
    throw new Error(
      `Expected ${EXPECTED_CONTESTANT_COUNT} CSV rows but found ${records.length}`,
    );
  }

  const imageIndex = await buildImageIndex(picturesDir);
  const fallbackPictures = {
    female: path.join(picturesDir, "fe.jpg"),
    male: path.join(picturesDir, "ma.jpg"),
  };
  await Promise.all(Object.values(fallbackPictures).map(validateImage));

  const seenIds = new Set();
  const contestants = records.map((record) => {
    const numericId = Number(record.id);
    if (!Number.isSafeInteger(numericId) || numericId < 1) {
      throw new Error(`Invalid contestant ID: ${record.id}`);
    }

    const id = String(numericId).padStart(3, "0");
    if (seenIds.has(id)) throw new Error(`Duplicate contestant ID: ${id}`);
    seenIds.add(id);

    if (record.gender !== "female" && record.gender !== "male") {
      throw new Error(`ID ${id} has invalid gender: ${record.gender}`);
    }

    const { firstName, lastName } = splitContestantName(record.name);
    const parent = cleanParentName(record.parent);
    const age = String(parseAge(record.age));
    const matchedPicture = imageIndex.get(id);

    return {
      id,
      firstName,
      lastName,
      gender: record.gender,
      age,
      parent,
      phone: record.phone,
      whatsapp: record.whatsapp,
      picturePath: matchedPicture || fallbackPictures[record.gender],
      pictureSource: matchedPicture ? "matched" : "fallback",
    };
  });

  contestants.sort((left, right) => Number(left.id) - Number(right.id));

  contestants.forEach((contestant, index) => {
    const expectedId = String(index + 1).padStart(3, "0");
    if (contestant.id !== expectedId) {
      throw new Error(`Expected sequential ID ${expectedId}, found ${contestant.id}`);
    }
    validateApiFields(contestant);
  });

  await Promise.all([...new Set(contestants.map((row) => row.picturePath))].map(validateImage));
  return contestants;
}

async function assertEmptyContestantList(apiUrl) {
  const response = await fetch(`${apiUrl}/api/contestant`);
  if (!response.ok) {
    throw new Error(`Could not inspect existing contestants: HTTP ${response.status}`);
  }

  const contestants = await response.json();
  if (!Array.isArray(contestants)) {
    throw new Error("Contestant API returned an unexpected response");
  }
  if (contestants.length > 0) {
    throw new Error(
      `Enrollment aborted: the API already returns ${contestants.length} contestant(s)`,
    );
  }
}

async function enrollContestant(apiUrl, contestant) {
  const imageBytes = await readFile(contestant.picturePath);
  const form = new FormData();
  form.append("firstName", contestant.firstName);
  form.append("lastName", contestant.lastName);
  form.append("gender", contestant.gender);
  form.append("age", contestant.age);
  form.append("parent", contestant.parent);
  form.append("phone", contestant.phone);
  form.append("whatsapp", contestant.whatsapp);
  form.append(
    "picture",
    new Blob([imageBytes], { type: mimeTypeFor(contestant.picturePath) }),
    path.basename(contestant.picturePath),
  );

  const response = await fetch(`${apiUrl}/api/contestant`, {
    method: "POST",
    body: form,
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error || `HTTP ${response.status}`);
  }
  if (body.id !== contestant.id) {
    throw new Error(`assigned ID ${body.id ?? "<missing>"}; expected ${contestant.id}`);
  }

  return body;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const contestants = await loadContestants(options.csvPath, options.picturesDir);
  const matchedPictures = contestants.filter((row) => row.pictureSource === "matched").length;
  const fallbackPictures = contestants.length - matchedPictures;

  console.log(`Validated ${contestants.length} contestants (${contestants[0].id}-${contestants.at(-1).id}).`);
  console.log(`Pictures: ${matchedPictures} ID-matched, ${fallbackPictures} gender fallback.`);
  console.log(`Target: ${options.apiUrl}`);

  if (!options.execute) {
    console.log("Dry run complete. No registrations were sent.");
    console.log("Run again with --execute to begin enrollment.");
    return;
  }

  await assertEmptyContestantList(options.apiUrl);
  console.log("API contestant list is empty. Beginning sequential enrollment.\n");

  for (const [index, contestant] of contestants.entries()) {
    try {
      const result = await enrollContestant(options.apiUrl, contestant);
      console.log(
        `[${index + 1}/${contestants.length}] ${contestant.id} ${result.name} (${contestant.pictureSource})`,
      );
    } catch (error) {
      throw new Error(
        `Stopped at CSV ID ${contestant.id}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  console.log(`\nEnrollment complete: ${contestants.length}/${contestants.length} registered with matching IDs.`);
}

main().catch((error) => {
  console.error(`\nEnrollment failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
