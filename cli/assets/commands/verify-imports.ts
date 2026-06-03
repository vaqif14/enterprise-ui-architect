import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname, join, sep, extname } from "path";

interface VerifyOptions {
  srcDir: string;
  packageJsonPath: string;
}

interface ImportInfo {
  path: string;
  line: number;
  source: string;
}

const NODE_BUILTINS = new Set([
  "assert", "async_hooks", "buffer", "child_process", "cluster", "console",
  "constants", "crypto", "dgram", "diagnostics_channel", "dns", "domain",
  "events", "fs", "http", "http2", "https", "inspector", "module", "net",
  "os", "path", "perf_hooks", "process", "punycode", "querystring", "readline",
  "repl", "stream", "string_decoder", "sys", "timers", "timers/promises",
  "tls", "trace_events", "tty", "url", "util", "v8", "vm", "wasi", "worker_threads",
  "zlib", "node:test",
]);

function findPackageJson(startDir: string): string | null {
  let dir = resolve(startDir);
  while (dir !== dirname(dir)) {
    const pkgPath = join(dir, "package.json");
    if (existsSync(pkgPath)) return pkgPath;
    dir = dirname(dir);
  }
  return null;
}

function findTsConfig(startDir: string): string | null {
  let dir = resolve(startDir);
  while (dir !== dirname(dir)) {
    const tsPath = join(dir, "tsconfig.json");
    if (existsSync(tsPath)) return tsPath;
    dir = dirname(dir);
  }
  return null;
}

function getInstalledPackages(packageJsonPath: string): Set<string> {
  const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  const deps = Object.keys(pkg.dependencies || {});
  const devDeps = Object.keys(pkg.devDependencies || {});
  const peerDeps = Object.keys(pkg.peerDependencies || {});
  const optionalDeps = Object.keys(pkg.optionalDependencies || {});
  return new Set([...deps, ...devDeps, ...peerDeps, ...optionalDeps]);
}

function getPathAliases(tsConfigPath: string): string[] {
  try {
    const raw = readFileSync(tsConfigPath, "utf-8");
    // Extract path aliases via regex — tolerant to comments and trailing commas
    const aliases: string[] = [];
    // Match patterns like "@core/*" or "@/components/*" inside "paths": { ... }
    const pathsMatch = raw.match(/"paths"\s*:\s*\{([\s\S]*?)\}/);
    if (pathsMatch) {
      const pathsBlock = pathsMatch[1];
      const keyRegex = /"(@[^"]+)"\s*:/g;
      let m: RegExpExecArray | null;
      while ((m = keyRegex.exec(pathsBlock)) !== null) {
        aliases.push(m[1]);
      }
    }
    return aliases.length > 0 ? aliases : ["@/*"];
  } catch {
    return ["@/*"];
  }
}

function isPathAlias(source: string, aliases: string[]): boolean {
  for (const alias of aliases) {
    const prefix = alias.replace(/\/\*$/, "");
    if (alias.endsWith("/*")) {
      if (source === prefix || source.startsWith(prefix + "/")) {
        return true;
      }
    } else {
      if (source === alias) {
        return true;
      }
    }
  }
  return false;
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

function extractImports(filePath: string): ImportInfo[] {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const imports: ImportInfo[] = [];

  // Matches single-line imports: import ... from "..."
  const singleLineRegex = /^(?:import\s+.*?from\s+|import\s*\(|require\s*\()["']([^"';]+)["'];?/;

  // Matches multi-line import end: from "..."
  const multiLineEndRegex = /from\s+["']([^"';]+)["'];?/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const singleMatch = singleLineRegex.exec(line);
    if (singleMatch) {
      imports.push({ path: filePath, line: i + 1, source: singleMatch[1] });
      continue;
    }
    // Multi-line import: starts with "import" but no "from" on same line
    if (line.startsWith("import") && !line.includes("from") && !line.includes("(")) {
      // Look ahead up to 5 lines for "from '...'"
      for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
        const nextLine = lines[j].trim();
        const multiMatch = multiLineEndRegex.exec(nextLine);
        if (multiMatch) {
          imports.push({ path: filePath, line: j + 1, source: multiMatch[1] });
          break;
        }
        if (nextLine.endsWith(";")) break; // End of import without from
      }
    }
  }

  return imports;
}

function resolvePackageName(source: string): string | null {
  if (source.startsWith(".") || source.startsWith("/")) return null;
  if (source.startsWith("node:")) return null;
  if (source.startsWith("@/")) return null;

  if (source.startsWith("@")) {
    const parts = source.split("/");
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : null;
  }

  const idx = source.indexOf("/");
  return idx > 0 ? source.slice(0, idx) : source;
}

function isNodeBuiltin(pkg: string): boolean {
  return NODE_BUILTINS.has(pkg) || NODE_BUILTINS.has(`node:${pkg}`);
}

function detectPackageManager(lockFiles: string[]): "npm" | "yarn" | "pnpm" | "bun" | "unknown" {
  if (lockFiles.some((f) => f.endsWith("bun.lockb"))) return "bun";
  if (lockFiles.some((f) => f.endsWith("pnpm-lock.yaml"))) return "pnpm";
  if (lockFiles.some((f) => f.endsWith("yarn.lock"))) return "yarn";
  if (lockFiles.some((f) => f.endsWith("package-lock.json"))) return "npm";
  return "unknown";
}

export function verifyImportsCommand(options: Partial<VerifyOptions> = {}): void {
  const srcDir = options.srcDir || process.cwd();
  const packageJsonPath = options.packageJsonPath || findPackageJson(srcDir);

  if (!packageJsonPath) {
    console.error("❌ package.json not found. Run this from a project root.");
    process.exit(1);
  }

  const installed = getInstalledPackages(packageJsonPath);
  const projectRoot = dirname(packageJsonPath);

  const tsConfigPath = findTsConfig(srcDir);
  const pathAliases = tsConfigPath ? getPathAliases(tsConfigPath) : [];

  const lockFiles = ["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb"].map((f) =>
    join(projectRoot, f)
  );
  const existingLocks = lockFiles.filter((f) => existsSync(f));
  const pkgManager = detectPackageManager(existingLocks);

  const files = getSourceFiles(srcDir);

  const allImports: ImportInfo[] = [];
  for (const file of files) {
    allImports.push(...extractImports(file));
  }

  const missing: Map<string, ImportInfo[]> = new Map();

  for (const imp of allImports) {
    if (isPathAlias(imp.source, pathAliases)) continue;

    const pkg = resolvePackageName(imp.source);
    if (!pkg) continue;
    if (isNodeBuiltin(pkg)) continue;
    if (installed.has(pkg)) continue;

    const list = missing.get(pkg) || [];
    list.push(imp);
    missing.set(pkg, list);
  }

  if (missing.size === 0) {
    console.log(`✅ All imports resolve to installed packages (${allImports.length} imports checked).`);
    return;
  }

  console.log(`⚠️  Found ${missing.size} missing package(s):\n`);

  for (const [pkg, imports] of missing) {
    console.log(`  📦 ${pkg}`);
    console.log(`     Used in:`);
    for (const imp of imports.slice(0, 3)) {
      const relPath = imp.path.replace(projectRoot + sep, "").replace(/^\//, "");
      console.log(`       - ${relPath}:${imp.line}  →  import from "${imp.source}"`);
    }
    if (imports.length > 3) {
      console.log(`       ... and ${imports.length - 3} more`);
    }

    const installCmd =
      pkgManager === "bun"
        ? `bun add ${pkg}`
        : pkgManager === "pnpm"
          ? `pnpm add ${pkg}`
          : pkgManager === "yarn"
            ? `yarn add ${pkg}`
            : `npm install ${pkg}`;

    console.log(`     Install: ${installCmd}\n`);
  }

  console.log(`Run the install command(s) above, then re-run this check.\n`);
  process.exit(1);
}
