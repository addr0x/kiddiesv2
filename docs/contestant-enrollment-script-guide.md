# Contestant Enrollment Script

Location, prerequisites, commands, defaults, and safe usage for the bulk contestant importer.

> **Current status:** All 226 contestants have already been enrolled and independently verified with IDs `001–226`. Do not run the execute command again against the current database. The script will refuse to proceed while contestants already exist.

## Script location

```text
/Users/kinngdann/Desktop/LAB/kiddiesv2/scripts/enroll.mjs
```

From the project directory, the relative path is:

```text
scripts/enroll.mjs
```

## Prerequisite

Open a terminal in the project directory and start the application:

```bash
cd /Users/kinngdann/Desktop/LAB/kiddiesv2
pnpm dev
```

## Run a safe validation

This checks the CSV, IDs, fields, and pictures without registering anyone:

```bash
./scripts/enroll.mjs
```

## Perform enrollment

Use this only for a fresh import after confirming that the contestant collection is empty and the contestant counter is set to `0`:

```bash
./scripts/enroll.mjs --execute
```

## Default inputs

| Input | Default location |
| --- | --- |
| CSV | `~/Desktop/leads/contestants.csv` |
| Pictures | `~/Desktop/leads/pictures` |
| API | `http://localhost:3009` |

## Override the defaults

```bash
./scripts/enroll.mjs \
  --execute \
  --csv /path/to/contestants.csv \
  --pictures /path/to/pictures \
  --api-url http://localhost:3009
```

## Safety behavior

- Enrollment is sequential, and each returned backend ID must match the CSV ID.
- The script stops immediately if a registration fails or an ID does not match.
- The script refuses to begin when the API already returns contestants.
- Without `--execute`, the script performs a non-mutating dry run.
- The normal five-registrations-per-hour rate limit is currently restored.

## Current enrollment result

- Contestants enrolled: `226`
- Backend ID range: `001–226`
- Missing IDs: none
- Duplicate IDs: none
- ID-matched pictures: `42`
- Gender fallback pictures: `184`
