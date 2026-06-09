import { existsSync, readFileSync } from "fs";
import { resolve, join } from "path";
import { spawnSync } from "child_process";

export interface VerifyLoopOptions {
  cwd: string;
  checkTsc: boolean;
}

interface CheckResult {
  id: string;
  label: string;
  pass: boolean;
  detail: string;
}

function readPackageJson(cwd: string): Record<string, unknown> | null {
  const pkgPath = join(cwd, "package.json");
  if (!existsSync(pkgPath)) return null;
  try {
    return JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch {
    return null;
  }
}

function hasScript(pkg: Record<string, unknown>, name: string): boolean {
  const scripts = pkg.scripts as Record<string, string> | undefined;
  return Boolean(scripts && scripts[name]);
}

export function verifyLoopCommand(options: VerifyLoopOptions): number {
  const cwd = resolve(options.cwd);
  const checks: CheckResult[] = [];

  const masterPath = join(cwd, "design-system", "MASTER.md");
  checks.push({
    id: "master",
    label: "design-system/MASTER.md",
    pass: existsSync(masterPath),
    detail: existsSync(masterPath)
      ? "Design system lock file present"
      : "Run: python scripts/search.py --query <industry> --design-system --persist --product <name>",
  });

  const stackPath = join(cwd, "design-system", "STACK.md");
  checks.push({
    id: "stack",
    label: "design-system/STACK.md",
    pass: existsSync(stackPath),
    detail: existsSync(stackPath)
      ? "Stack profile documented"
      : "Document detected stack (MUI vs shadcn) before multi-screen UI work",
  });

  const contextGraphPath = join(cwd, "design-system", "CONTEXT_GRAPH.md");
  checks.push({
    id: "context-graph",
    label: "design-system/CONTEXT_GRAPH.md",
    pass: existsSync(contextGraphPath),
    detail: existsSync(contextGraphPath)
      ? "Context Graph reuse map present"
      : "Run: python scripts/context-graph.py --root . --scan src",
  });

  const pkg = readPackageJson(cwd);
  if (pkg) {
    const deps = {
      ...(pkg.dependencies as Record<string, string> | undefined),
      ...(pkg.devDependencies as Record<string, string> | undefined),
    };
    const hasMui = Boolean(deps["@mui/material"]);
    const hasShadcn = existsSync(join(cwd, "components.json"));
    if (hasMui && hasShadcn) {
      checks.push({
        id: "hybrid-stack",
        label: "Hybrid stack routing",
        pass: existsSync(stackPath),
        detail: "MUI + shadcn detected — STACK.md must declare per-surface routing",
      });
    }
  }

  if (options.checkTsc) {
    if (pkg && (hasScript(pkg, "typecheck") || hasScript(pkg, "type-check"))) {
      const scriptName = hasScript(pkg, "typecheck") ? "typecheck" : "type-check";
      const result = spawnSync("npm", ["run", scriptName], {
        cwd,
        stdio: "pipe",
        encoding: "utf-8",
      });
      checks.push({
        id: "tsc",
        label: `npm run ${scriptName}`,
        pass: result.status === 0,
        detail:
          result.status === 0
            ? "Typecheck passed"
            : (result.stderr || result.stdout || "Typecheck failed").slice(0, 500),
      });
    } else if (existsSync(join(cwd, "tsconfig.json"))) {
      const result = spawnSync("npx", ["tsc", "--noEmit"], {
        cwd,
        stdio: "pipe",
        encoding: "utf-8",
      });
      checks.push({
        id: "tsc",
        label: "npx tsc --noEmit",
        pass: result.status === 0,
        detail:
          result.status === 0
            ? "Typecheck passed"
            : (result.stderr || result.stdout || "Typecheck failed").slice(0, 500),
      });
    }
  }

  const failed = checks.filter((c) => !c.pass);
  const passed = checks.filter((c) => c.pass);

  console.log("\nEnterprise UI Architect — Unified Loop Verification\n");
  for (const check of passed) {
    console.log(`  PASS  ${check.label}`);
  }
  for (const check of failed) {
    console.log(`  FAIL  ${check.label}`);
    console.log(`        ${check.detail}`);
  }

  console.log(`\n${passed.length}/${checks.length} checks passed.\n`);

  if (failed.length > 0) {
    console.log("Remediation:");
    for (const check of failed) {
      console.log(`  - ${check.detail}`);
    }
    console.log("");
    return 1;
  }

  return 0;
}
