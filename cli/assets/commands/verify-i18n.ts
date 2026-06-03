import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname, join, sep, extname } from "path";

interface VerifyOptions {
  srcDir: string;
  messagesDir: string;
}

interface KeyLocation {
  key: string;
  file: string;
  line: number;
}

function findMessagesDir(startDir: string): string | null {
  let dir = resolve(startDir);
  while (dir !== dirname(dir)) {
    const messagesPath = join(dir, "messages");
    if (existsSync(messagesPath)) return messagesPath;
    dir = dirname(dir);
  }
  return null;
}

function getSourceFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name === "node_modules" ||
        entry.name === "dist" ||
        entry.name === "build" ||
        entry.name === ".next" ||
        entry.name.startsWith(".")
      ) {
        continue;
      }
      results.push(...getSourceFiles(fullPath));
    } else if (entry.isFile()) {
      const ext = extname(entry.name);
      if (ext === ".ts" || ext === ".tsx" || ext === ".js" || ext === ".jsx") {
        results.push(fullPath);
      }
    }
  }

  return results;
}

function loadTranslations(messagesDir: string): Record<string, Record<string, unknown>> {
  const files = readdirSync(messagesDir).filter((f) => f.endsWith(".json"));
  const translations: Record<string, Record<string, unknown>> = {};

  for (const file of files) {
    const locale = file.replace(".json", "");
    const content = readFileSync(join(messagesDir, file), "utf-8");
    translations[locale] = JSON.parse(content);
  }

  return translations;
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

function extractNamespace(content: string): string | null {
  const match = /useTranslations\s*\(\s*["'`]([^"'`]+)["'`]\s*\)/.exec(content);
  return match ? match[1] : null;
}

function isInsideStringLiteral(line: string, matchIndex: number): boolean {
  // Check if the character before t( is inside a string literal
  const before = line.slice(0, matchIndex);
  let inSingle = false;
  let inDouble = false;
  let escaped = false;

  for (const ch of before) {
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      continue;
    }
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
    } else if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
    }
  }

  return inSingle || inDouble;
}

function extractTranslationKeys(content: string, namespace: string | null): KeyLocation[] {
  const lines = content.split("\n");
  const keys: KeyLocation[] = [];
  const seen = new Set<string>();

  const regex = /\bt\s*\(\s*["'`]([a-zA-Z0-9_.-]+)["'`]/g;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip comment-only lines
    const codePart = line.split("//")[0];
    if (!codePart.includes("t(")) continue;

    let match: RegExpExecArray | null;
    while ((match = regex.exec(line)) !== null) {
      if (isInsideStringLiteral(line, match.index)) continue;

      const rawKey = match[1];
      const key = namespace ? `${namespace}.${rawKey}` : rawKey;
      if (!seen.has(key)) {
        seen.add(key);
        keys.push({ key, file: "", line: i + 1 });
      }
    }
  }

  return keys;
}

export function verifyI18nCommand(options: Partial<VerifyOptions> = {}): void {
  const srcDir = options.srcDir || process.cwd();
  const messagesDir = options.messagesDir || findMessagesDir(srcDir);

  if (!messagesDir) {
    console.error("❌ messages/ directory not found. Run this from a project root.");
    process.exit(1);
  }

  const translations = loadTranslations(messagesDir);
  const locales = Object.keys(translations);

  if (locales.length === 0) {
    console.error("❌ No translation files found in messages/ directory.");
    process.exit(1);
  }

  const files = getSourceFiles(srcDir);
  const allKeys: Map<string, Array<{ file: string; line: number }>> = new Map();

  for (const file of files) {
    const content = readFileSync(file, "utf-8");
    const namespace = extractNamespace(content);
    const keys = extractTranslationKeys(content, namespace);
    for (const { key, line } of keys) {
      const list = allKeys.get(key) || [];
      list.push({ file, line });
      allKeys.set(key, list);
    }
  }

  if (allKeys.size === 0) {
    console.log("ℹ️  No translation keys found in source files.");
    return;
  }

  const missingByLocale: Map<string, KeyLocation[]> = new Map();

  for (const [key, locations] of allKeys) {
    for (const locale of locales) {
      const value = getNestedValue(translations[locale], key);
      if (value === undefined) {
        const list = missingByLocale.get(locale) || [];
        list.push({ key, file: locations[0].file, line: locations[0].line });
        missingByLocale.set(locale, list);
      }
    }
  }

  const totalMissing = Array.from(missingByLocale.values()).reduce((sum, list) => sum + list.length, 0);

  if (totalMissing === 0) {
    console.log(`✅ All ${allKeys.size} translation key(s) exist in every locale (${locales.join(", ")}).`);
    return;
  }

  console.log(`⚠️  Found ${totalMissing} missing translation key(s):\n`);

  for (const [locale, missing] of missingByLocale) {
    if (missing.length === 0) continue;
    console.log(`  🌐 ${locale}.json (${missing.length} missing):`);
    for (const { key, file, line } of missing.slice(0, 10)) {
      const relPath = file.replace(srcDir + sep, "").replace(/^\//, "");
      console.log(`     - ${key}`);
      console.log(`       used in: ${relPath}:${line}`);
    }
    if (missing.length > 10) {
      console.log(`       ... and ${missing.length - 10} more`);
    }
    console.log("");
  }

  console.log(`Add the missing keys to all ${locales.length} locale files.\n`);
  process.exit(1);
}
