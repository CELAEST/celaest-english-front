#!/usr/bin/env node

/**
 * CELAEST Lingua — Anti-Hardcoded Data & Anti-Mock Quality Gate
 * 
 * Scans production source code for forbidden hardcoded defaults,
 * closed question banks, and role-biased fallbacks.
 * 
 * Exit code 0: 100% clean, zero hardcoded bias detected.
 * Exit code 1: Violation found. Build fails immediately.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, "../src");

const FORBIDDEN_PATTERNS = [
  {
    regex: /"Software & Technology"/,
    description: 'Hardcoded default role "Software & Technology" is forbidden. Use dynamic inference or "Professional".',
  },
  {
    regex: /roleName\s*=\s*["']Product Manager["']/,
    description: 'Hardcoded default prop roleName = "Product Manager" is forbidden. Default to "Professional".',
  },
  {
    regex: /roleName:\s*string\s*=\s*["']Product Manager["']/,
    description: 'Hardcoded default parameter roleName: string = "Product Manager" is forbidden. Default to "Professional".',
  },
  {
    regex: /const\s+[A-Z_]+_POOL\s*=\s*\[/,
    description: 'Closed static content pools (e.g. TECH_POOL = [...]) are forbidden. Use procedural generation.',
  },
  {
    regex: /COALESCE\(profession,\s*['"]Software & Technology['"]\)/,
    description: 'Database role-biased default is forbidden. Use COALESCE(profession, \'\').',
  },
];

const IGNORED_DIRECTORIES = ["__tests__", "test", "node_modules", ".git", "dist"];

let violationsCount = 0;

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORED_DIRECTORIES.includes(entry.name)) {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      if (entry.name.includes(".test.") || entry.name.includes(".spec.")) {
        continue;
      }
      checkFile(fullPath);
    }
  }
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];

    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.regex.test(line)) {
        console.error(`\x1b[31m[ANTI-HARDCODE VIOLATION]\x1b[0m ${path.relative(process.cwd(), filePath)}:${lineNum + 1}`);
        console.error(`   Line: ${line.trim()}`);
        console.error(`   Rule: ${pattern.description}\n`);
        violationsCount++;
      }
    }
  }
}

console.log("\x1b[36m[CELAEST Gate]\x1b[0m Scanning src/ for hardcoded role defaults and closed pools...");
scanDirectory(srcDir);

if (violationsCount > 0) {
  console.error(`\x1b[31m❌ QUALITY GATE FAILED:\x1b[0m ${violationsCount} hardcoded data violation(s) detected.`);
  process.exit(1);
} else {
  console.log("\x1b[32m✅ QUALITY GATE PASSED:\x1b[0m 100% clean. Zero hardcoded bias or closed pools found in production code.");
  process.exit(0);
}
