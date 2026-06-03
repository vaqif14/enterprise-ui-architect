#!/usr/bin/env node
import { initCommand } from "./commands/init.js";
import { verifyImportsCommand } from "./commands/verify-imports.js";
import { verifyI18nCommand } from "./commands/verify-i18n.js";

function showHelp(): void {
  console.log(`
Enterprise UI Architect CLI

Usage:
  enterprise-ui init [options]
  enterprise-ui verify-imports [options]
  enterprise-ui verify-i18n [options]

Commands:
  init                Install skill into AI coding assistants
  verify-imports      Scan source files and report missing npm packages
  verify-i18n         Scan source files and report missing translation keys

Options:
  --ai <assistant>    Target AI assistant: cursor, claude, windsurf, copilot, codex, all (default: all)
  --offline           Use local assets without network (default: false)
  --src <dir>         Source directory to scan (default: current directory)
  --help              Show this help
  --version           Show version

Examples:
  enterprise-ui init --ai cursor
  enterprise-ui init --ai claude --offline
  enterprise-ui verify-imports
  enterprise-ui verify-imports --src ./src
  enterprise-ui verify-i18n
  enterprise-ui verify-i18n --src ./src
`);
}

function parseArgs(args: string[]): {
  command?: string;
  ai: string;
  offline: boolean;
  srcDir: string;
  help: boolean;
  version: boolean;
} {
  const result = { ai: "all", offline: false, srcDir: process.cwd(), help: false, version: false };
  let command: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "init" || arg === "verify-imports" || arg === "verify-i18n") {
      command = arg;
    } else if (arg === "--ai" && i + 1 < args.length) {
      result.ai = args[++i];
    } else if (arg === "--offline") {
      result.offline = true;
    } else if (arg === "--src" && i + 1 < args.length) {
      result.srcDir = args[++i];
    } else if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "--version" || arg === "-v") {
      result.version = true;
    }
  }

  return { command, ...result };
}

function main(): number {
  const args = process.argv.slice(2);
  const parsed = parseArgs(args);

  if (parsed.version) {
    console.log("2.0.0");
    return 0;
  }

  if (parsed.help || args.length === 0) {
    showHelp();
    return 0;
  }

  if (parsed.command === "init") {
    try {
      initCommand({ ai: parsed.ai, offline: parsed.offline });
      return 0;
    } catch (err) {
      console.error(`Error: ${(err as Error).message}`);
      return 1;
    }
  }

  if (parsed.command === "verify-imports") {
    try {
      verifyImportsCommand({ srcDir: parsed.srcDir });
      return 0;
    } catch (err) {
      console.error(`Error: ${(err as Error).message}`);
      return 1;
    }
  }

  if (parsed.command === "verify-i18n") {
    try {
      verifyI18nCommand({ srcDir: parsed.srcDir });
      return 0;
    } catch (err) {
      console.error(`Error: ${(err as Error).message}`);
      return 1;
    }
  }

  console.error(`Unknown command. Run --help for usage.`);
  return 1;
}

process.exit(main());
