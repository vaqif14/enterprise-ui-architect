#!/usr/bin/env node
import { initCommand } from "./commands/init.js";

function showHelp(): void {
  console.log(`
Enterprise UI Architect CLI

Usage:
  enterprise-ui init [options]

Options:
  --ai <assistant>    Target AI assistant: cursor, claude, windsurf, copilot, codex, all (default: all)
  --offline           Use local assets without network (default: false)
  --help              Show this help
  --version           Show version

Examples:
  enterprise-ui init --ai cursor
  enterprise-ui init --ai claude --offline
  enterprise-ui init --ai all
`);
}

function parseArgs(args: string[]): { command?: string; ai: string; offline: boolean; help: boolean; version: boolean } {
  const result = { ai: "all", offline: false, help: false, version: false };
  let command: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "init") {
      command = "init";
    } else if (arg === "--ai" && i + 1 < args.length) {
      result.ai = args[++i];
    } else if (arg === "--offline") {
      result.offline = true;
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
    console.log("1.0.0");
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
  } else {
    console.error(`Unknown command. Run --help for usage.`);
    return 1;
  }
}

process.exit(main());
