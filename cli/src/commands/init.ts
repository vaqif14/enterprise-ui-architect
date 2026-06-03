import { mkdirSync, copyFileSync, existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface PlatformConfig {
  platform: string;
  outputPath: string;
  format: string;
  description: string;
  contentSource?: string;
  injectSections?: string[];
  rules?: string[];
  systemPrefix?: string;
  promptSuffix?: string;
  quickReference?: string;
  dataPaths?: Record<string, string>;
  scripts?: Record<string, string>;
  frontmatter?: {
    description?: string;
    globs?: string;
    alwaysApply?: boolean;
  };
}

const PLATFORMS: Record<string, string> = {
  cursor: "cursor.json",
  claude: "claude.json",
  windsurf: "windsurf.json",
  copilot: "copilot.json",
  codex: "codex.json",
};

function getAssetsDir(): string {
  const distAssets = resolve(__dirname, "..", "assets");
  if (existsSync(distAssets)) return distAssets;

  const srcAssets = resolve(__dirname, "..", "..", "assets");
  if (existsSync(srcAssets)) return srcAssets;

  const repoSrc = resolve(process.cwd(), "src", "enterprise-ui-architect");
  if (existsSync(repoSrc)) return repoSrc;

  throw new Error("Could not find skill assets. Ensure CLI is built or run from repo root.");
}

function readAsset(...paths: string[]): string {
  const assetsDir = getAssetsDir();
  const fullPath = join(assetsDir, ...paths);
  if (!existsSync(fullPath)) {
    throw new Error(`Asset not found: ${fullPath}`);
  }
  return readFileSync(fullPath, "utf-8");
}

function sanitizeOutputPath(outputPath: string): string {
  // Prevent path traversal: normalize and reject paths that escape cwd
  const normalized = outputPath.replace(/\\/g, "/").replace(/\.{2,}\//g, "");
  if (normalized.startsWith("/") || normalized.includes("../")) {
    throw new Error(`Invalid output path: ${outputPath}`);
  }
  return normalized;
}

function installPlatform(platformKey: string, cwd: string): void {
  const configFile = PLATFORMS[platformKey];
  if (!configFile) {
    console.error(`Unknown platform: ${platformKey}`);
    return;
  }

  const config: PlatformConfig = JSON.parse(readAsset("templates", "platforms", configFile));
  const safeOutputPath = sanitizeOutputPath(config.outputPath);
  const outputPath = join(cwd, safeOutputPath);
  const outputDir = dirname(outputPath);

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  let content = "";

  if (config.format === "cursor-rule") {
    const frontmatter = config.frontmatter || {};
    const lines: string[] = [
      "---",
      `description: ${frontmatter.description || config.description}`,
      `globs: ${frontmatter.globs || "**/*.{tsx,jsx,vue,ts,js}"}`,
      `alwaysApply: ${frontmatter.alwaysApply ?? false}`,
      "---",
      "",
      `# Enterprise UI Architect`,
      "",
    ];

    if (config.contentSource) {
      const baseContent = readAsset(config.contentSource);
      lines.push(baseContent);
    }

    if (config.injectSections && config.injectSections.length > 0) {
      const skillMd = readAsset("SKILL.md");
      lines.push("## Injected Standards\n");
      for (const section of config.injectSections) {
        const sectionContent = extractSection(skillMd, section);
        if (sectionContent) {
          lines.push(sectionContent);
          lines.push("");
        }
      }
    }

    if (config.rules && config.rules.length > 0) {
      lines.push("## Rules\n");
      for (const rule of config.rules) {
        lines.push(`- ${rule}`);
      }
      lines.push("");
    }

    content = lines.join("\n");
  } else if (config.format === "github-prompt") {
    const lines: string[] = [];
    if (config.systemPrefix) {
      lines.push(config.systemPrefix);
      lines.push("");
    }
    if (config.contentSource) {
      lines.push(readAsset(config.contentSource));
    }
    if (config.injectSections && config.injectSections.length > 0) {
      const skillMd = readAsset("SKILL.md");
      for (const section of config.injectSections) {
        const sectionContent = extractSection(skillMd, section);
        if (sectionContent) {
          lines.push(sectionContent);
          lines.push("");
        }
      }
    }
    if (config.promptSuffix) {
      lines.push(config.promptSuffix);
    }
    content = lines.join("\n");
  } else {
    content = readAsset("SKILL.md");
    if (config.quickReference) {
      content += "\n\n" + readAsset(config.quickReference);
    }
  }

  writeFileSync(outputPath, content, "utf-8");
  console.log(`  Installed: ${config.outputPath}`);

  if (config.dataPaths || config.scripts) {
    const skillDir = dirname(outputPath);
    const dataDir = join(skillDir, "data");
    const scriptsDir = join(skillDir, "scripts");

    if (config.dataPaths) {
      if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
      for (const [, relPath] of Object.entries(config.dataPaths)) {
        const src = join(getAssetsDir(), relPath);
        const dest = join(dataDir, relPath.replace("data/", ""));
        if (existsSync(src)) {
          const destDir = dirname(dest);
          if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
          copyFileSync(src, dest);
        }
      }
    }

    if (config.scripts) {
      if (!existsSync(scriptsDir)) mkdirSync(scriptsDir, { recursive: true });
      for (const [, relPath] of Object.entries(config.scripts)) {
        const src = join(getAssetsDir(), relPath);
        const dest = join(scriptsDir, relPath.replace("scripts/", ""));
        if (existsSync(src)) {
          copyFileSync(src, dest);
        }
      }
    }
  }
}

function extractSection(markdown: string, sectionTitle: string): string | null {
  const pattern = new RegExp(
    `##\\s+${escapeRegex(sectionTitle)}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`,
    "i"
  );
  const match = markdown.match(pattern);
  return match ? match[0].trim() : null;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function initCommand(options: { ai?: string; offline?: boolean }): void {
  const cwd = process.cwd();
  const target = options.ai || "all";
  const platforms = target === "all" ? Object.keys(PLATFORMS) : target.split(",").map((s) => s.trim().toLowerCase());

  console.log("Enterprise UI Architect — Initializing skill...\n");

  for (const platform of platforms) {
    if (!PLATFORMS[platform]) {
      console.warn(`Skipping unknown platform: ${platform}`);
      continue;
    }
    console.log(`Platform: ${platform}`);
    try {
      installPlatform(platform, cwd);
    } catch (err) {
      console.error(`  Error installing for ${platform}:`, (err as Error).message);
    }
  }

  console.log("\nDone. Review the generated files and adjust project-specific paths if needed.");
}
