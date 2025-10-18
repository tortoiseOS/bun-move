#!/usr/bin/env node

import { Command } from "commander";
import prompts from "prompts";
import chalk from "chalk";
import ora from "ora";
import { execSync } from "child_process";
import { existsSync, mkdirSync, cpSync, writeFileSync, readFileSync } from "fs";
import { join, resolve } from "path";
import validateProjectName from "validate-npm-package-name";

const program = new Command();

interface ProjectOptions {
  name: string;
  template?: "minimal" | "full";
  sui?: boolean;
  docker?: boolean;
}

program
  .name("create-bun-move")
  .description("Create a new TortoiseOS DeFi project on Sui")
  .version("0.1.0")
  .argument("[project-name]", "Name of your project")
  .option("-t, --template <type>", "Project template (minimal|full)", "full")
  .option("--no-sui", "Skip Sui Move contracts")
  .option("--no-docker", "Skip Docker setup")
  .action(async (projectName: string | undefined, options) => {
    console.log(chalk.cyan.bold("\n🐢 Welcome to TortoiseOS!\n"));

    let name = projectName;

    // Prompt for project name if not provided
    if (!name) {
      const response = await prompts({
        type: "text",
        name: "name",
        message: "What is your project name?",
        initial: "my-tortoise-app",
        validate: (value) => {
          const validation = validateProjectName(value);
          if (validation.validForNewPackages) {
            return true;
          }
          return validation.errors?.[0] || "Invalid project name";
        },
      });

      if (!response.name) {
        console.log(chalk.red("\n✖ Project creation cancelled\n"));
        process.exit(1);
      }

      name = response.name;
    }

    // Validate project name
    const validation = validateProjectName(name);
    if (!validation.validForNewPackages) {
      console.error(
        chalk.red(`\n✖ Invalid project name: ${validation.errors?.[0]}\n`)
      );
      process.exit(1);
    }

    const projectPath = resolve(process.cwd(), name);

    // Check if directory already exists
    if (existsSync(projectPath)) {
      console.error(
        chalk.red(`\n✖ Directory ${name} already exists!\n`)
      );
      process.exit(1);
    }

    // Prompt for configuration
    const config = await prompts([
      {
        type: "select",
        name: "template",
        message: "Which template would you like to use?",
        choices: [
          { title: "Full Stack (API + Web + Move + AI)", value: "full" },
          { title: "Minimal (Web + Move)", value: "minimal" },
        ],
        initial: 0,
      },
      {
        type: "confirm",
        name: "sui",
        message: "Include Sui Move smart contracts?",
        initial: true,
      },
      {
        type: "confirm",
        name: "docker",
        message: "Include Docker configuration?",
        initial: true,
      },
      {
        type: "confirm",
        name: "magicui",
        message: "Include Magic UI components?",
        initial: true,
      },
    ]);

    if (!config.template) {
      console.log(chalk.red("\n✖ Project creation cancelled\n"));
      process.exit(1);
    }

    const spinner = ora(chalk.cyan("Creating your TortoiseOS project...")).start();

    try {
      // Create project directory
      mkdirSync(projectPath, { recursive: true });

      // Create base structure
      createProjectStructure(projectPath, {
        name,
        template: config.template,
        sui: config.sui,
        docker: config.docker,
        magicui: config.magicui,
      });

      spinner.succeed(chalk.green("Project created successfully!"));

      // Print next steps
      console.log(chalk.cyan("\n📦 Next steps:\n"));
      console.log(chalk.white(`  cd ${name}`));
      console.log(chalk.white(`  bun install`));
      
      if (config.docker) {
        console.log(chalk.white(`  docker compose up -d`));
      }
      
      if (config.sui) {
        console.log(chalk.white(`  task sui:init`));
      }
      
      console.log(chalk.white(`  bun run dev\n`));

      console.log(chalk.cyan("🚀 Happy building with TortoiseOS!\n"));
      console.log(chalk.gray("📖 Documentation: https://github.com/tortoise-os/bun-move"));
      console.log(chalk.gray("💬 Discord: https://discord.gg/tortoise-os\n"));

    } catch (error) {
      spinner.fail(chalk.red("Failed to create project"));
      console.error(error);
      process.exit(1);
    }
  });

function createProjectStructure(
  projectPath: string,
  options: {
    name: string;
    template: "minimal" | "full";
    sui: boolean;
    docker: boolean;
    magicui: boolean;
  }
) {
  // Create root package.json
  const packageJson = {
    name: options.name,
    version: "0.1.0",
    private: true,
    description: "TortoiseOS DeFi project on Sui",
    workspaces: ["apps/*", "packages/*"],
    scripts: {
      dev: "bun run --filter './apps/web' dev",
      build: "bun run --filter './apps/*' build",
      test: "bun test",
      lint: "bun run --filter './apps/*' --filter './packages/*' lint",
    },
    devDependencies: {
      "@types/bun": "^1.1.10",
      typescript: "^5.6.2",
      prettier: "^3.3.3",
    },
    engines: {
      bun: ">=1.1.0",
      node: ">=20.0.0",
    },
  };

  writeFileSync(
    join(projectPath, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );

  // Create directories
  const dirs = [
    "apps/web",
    "packages/core",
    "packages/sdk",
  ];

  if (options.template === "full") {
    dirs.push("apps/api");
  }

  if (options.sui) {
    dirs.push("move/sources");
  }

  if (options.magicui) {
    dirs.push("packages/ui");
  }

  dirs.forEach((dir) => {
    mkdirSync(join(projectPath, dir), { recursive: true });
  });

  // Create README
  const readme = `# ${options.name}

TortoiseOS DeFi Project on Sui

## Getting Started

\`\`\`bash
# Install dependencies
bun install

${options.docker ? "# Start services\ndocker compose up -d\n" : ""}
${options.sui ? "# Initialize Sui\ntask sui:init\n" : ""}
# Start development server
bun run dev
\`\`\`

## Features

- ✅ Next.js 14 Web App
${options.template === "full" ? "- ✅ Express API Server\n" : ""}${options.sui ? "- ✅ Sui Move Smart Contracts\n" : ""}${options.magicui ? "- ✅ Magic UI Components\n" : ""}${options.docker ? "- ✅ Docker Configuration\n" : ""}
## Project Structure

\`\`\`
${options.name}/
├── apps/
│   ├── web/          # Next.js frontend
${options.template === "full" ? "│   └── api/          # Express API\n" : ""}├── packages/
│   ├── core/         # Core utilities
│   ├── sdk/          # Sui SDK wrapper
${options.magicui ? "│   └── ui/           # Magic UI components\n" : ""}${options.sui ? "├── move/            # Sui Move contracts\n" : ""}${options.docker ? "└── docker/          # Docker configs\n" : ""}\`\`\`

## Documentation

- [TortoiseOS Docs](https://github.com/tortoise-os/bun-move)
- [Sui Documentation](https://docs.sui.io)

## License

MIT
`;

  writeFileSync(join(projectPath, "README.md"), readme);

  // Create .gitignore
  const gitignore = `# Dependencies
node_modules/
bun.lockb

# Build outputs
.next/
dist/
build/
*.log

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Sui
${options.sui ? "build/\n.sui/\n" : ""}
# Docker
${options.docker ? ".docker/\n" : ""}`;

  writeFileSync(join(projectPath, ".gitignore"), gitignore);

  // Create .clauderc for AI assistant instructions
  const clauderc = `# TortoiseOS Project - AI Assistant Instructions

## Package Manager: BUN ONLY

**CRITICAL**: This project uses Bun as its package manager and runtime.

### Required Commands:
- ✅ \`bun install\` (NOT npm install)
- ✅ \`bun add <package>\` (NOT npm install)
- ✅ \`bun remove <package>\` (NOT npm uninstall)
- ✅ \`bunx <command>\` (NOT npx)
- ✅ \`bun run <script>\` (NOT npm run)
- ✅ \`bun test\` (NOT npm test)
- ✅ \`bun <file.ts>\` (direct TypeScript execution)

### ❌ NEVER Use:
- npm install
- npm i
- npm run
- npx
- yarn
- pnpm

### Project Stack:
- **Runtime**: Bun >= 1.1.0
- **Framework**: Next.js 14${options.template === "full" ? "\n- **API**: Express with Bun" : ""}${options.sui ? "\n- **Blockchain**: Sui Move" : ""}${options.magicui ? "\n- **UI**: Magic UI + Tailwind CSS" : ""}${options.docker ? "\n- **Containers**: Docker Compose" : ""}
- **Testing**: Playwright${options.sui ? " + @tortoiseos/terrapin" : ""}

### Sui-Specific Guidelines:
${options.sui ? `- Use \`task move:build\` for Move contract compilation
- Use \`task sui:init\` for Sui setup
- All Sui commands run in Docker container
- Test wallet: Use unsafe burner wallet in dev mode
` : ""}
### Code Style:
- TypeScript strict mode enabled
- Use async/await (Bun has top-level await)
- Prefer Bun APIs over Node.js when available
- Use workspace protocol: "workspace:*" for local packages

### Commands Reference:
\`\`\`bash
# Development
bun run dev              # Start dev server

# Building
bun run build            # Build all apps

# Testing
bun test                 # Run unit tests
bun run test:e2e        # Run E2E tests${options.sui ? "\n\n# Sui/Move\ntask move:build          # Compile Move contracts\ntask sui:init            # Initialize Sui" : ""}${options.docker ? "\n\n# Docker\ndocker compose up -d     # Start services\ndocker compose down      # Stop services" : ""}
\`\`\`

### When suggesting installations:
Always use: \`bun add <package>\`
Dev dependencies: \`bun add -D <package>\`
Global tools: \`bunx <tool>\` (no installation needed!)

---
🐢 **TortoiseOS** - Slow, steady, and bun-powered!
`;

  writeFileSync(join(projectPath, ".clauderc"), clauderc);

  // Also create .cursorrules for Cursor IDE
  const cursorrules = `# TortoiseOS Project Rules

## Package Manager
- Always use Bun: \`bun install\`, \`bun add\`, \`bunx\`
- Never suggest npm, yarn, or pnpm

## Stack
- Bun runtime${options.sui ? "\n- Sui blockchain" : ""}
- TypeScript strict mode
- Next.js 14${options.magicui ? "\n- Magic UI components" : ""}

## Commands
- Use \`bun run <script>\` for package scripts
- Use \`bunx <command>\` instead of npx${options.sui ? "\n- Use \`task move:build\` for Sui Move contracts" : ""}
`;

  writeFileSync(join(projectPath, ".cursorrules"), cursorrules);

  console.log(chalk.green(`\n✓ Created ${options.name}`));
}

program.parse();
