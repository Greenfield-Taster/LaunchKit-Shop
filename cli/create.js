#!/usr/bin/env node

import { createInterface } from "readline";
import { cp, readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = resolve(__dirname, "..");

const rl = createInterface({ input: process.stdin, output: process.stdout });

const ask = (question, defaultVal = "") =>
  new Promise((resolve) => {
    const suffix = defaultVal ? ` (${defaultVal})` : "";
    rl.question(`${question}${suffix}: `, (answer) => {
      resolve(answer.trim() || defaultVal);
    });
  });

// ========================================
// COLOR GENERATION
// ========================================

function hexToHSL(hex) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generatePalette(hex) {
  const base = hexToHSL(hex);

  const primary = {
    50: hslToHex(base.h, Math.min(base.s * 0.3, 30), 96),
    100: hslToHex(base.h, Math.min(base.s * 0.4, 35), 91),
    200: hslToHex(base.h, Math.min(base.s * 0.5, 40), 82),
    300: hslToHex(base.h, base.s * 0.7, 68),
    400: hslToHex(base.h, base.s * 0.85, 55),
    500: hslToHex(base.h, base.s, base.l),
    600: hslToHex(base.h, base.s * 1.05, base.l * 0.82),
    700: hslToHex(base.h, base.s * 1.1, base.l * 0.65),
    800: hslToHex(base.h, base.s * 1.1, base.l * 0.45),
    900: hslToHex(base.h, base.s * 1.1, base.l * 0.28),
  };

  const secH = (base.h + 180) % 360;
  const secondary = {
    50: hslToHex(secH, Math.min(base.s * 0.3, 30), 96),
    100: hslToHex(secH, Math.min(base.s * 0.4, 35), 91),
    200: hslToHex(secH, Math.min(base.s * 0.5, 40), 82),
    300: hslToHex(secH, base.s * 0.7, 68),
    400: hslToHex(secH, base.s * 0.85, 55),
    500: hslToHex(secH, base.s * 0.9, base.l),
    600: hslToHex(secH, base.s * 0.95, base.l * 0.82),
    700: hslToHex(secH, base.s, base.l * 0.65),
    800: hslToHex(secH, base.s, base.l * 0.45),
    900: hslToHex(secH, base.s, base.l * 0.28),
  };

  const neutralSat = Math.min(base.s * 0.15, 8);
  const neutrals = {
    0: "#ffffff",
    50: hslToHex(base.h, neutralSat, 98),
    100: hslToHex(base.h, neutralSat, 96),
    200: hslToHex(base.h, neutralSat * 0.9, 91),
    300: hslToHex(base.h, neutralSat * 0.8, 86),
    400: hslToHex(base.h, neutralSat * 0.7, 68),
    500: hslToHex(base.h, neutralSat * 0.6, 52),
    600: hslToHex(base.h, neutralSat * 0.5, 38),
    700: hslToHex(base.h, neutralSat * 0.4, 28),
    800: hslToHex(base.h, neutralSat * 0.4, 18),
    900: hslToHex(base.h, neutralSat * 0.3, 10),
  };

  return { primary, secondary, neutrals };
}

function buildColorBlock(palette) {
  const lines = [];

  const addGroup = (prefix, obj) => {
    Object.entries(obj).forEach(([k, v]) => {
      lines.push(`$${prefix}-${k}: ${v};`);
    });
  };

  addGroup("brand-primary", palette.primary);
  lines.push("");
  addGroup("brand-secondary", palette.secondary);
  lines.push("");
  addGroup("neutral", palette.neutrals);

  return lines.join("\n");
}

// ========================================
// FILE OPERATIONS
// ========================================

async function applyColors(projectDir, hex) {
  const varsFile = resolve(projectDir, "src/styles/_variables.scss");
  let content = await readFile(varsFile, "utf-8");

  const palette = generatePalette(hex);
  const newColors = buildColorBlock(palette);

  // Replace from first $brand-primary to last $neutral line
  content = content.replace(
    /\$brand-primary-50:[\s\S]*?\$neutral-900:[^;]*;/,
    newColors
  );

  await writeFile(varsFile, content, "utf-8");
}

async function updatePackageJson(projectDir, projectName) {
  const pkgFile = resolve(projectDir, "package.json");
  let content = await readFile(pkgFile, "utf-8");
  const pkg = JSON.parse(content);

  pkg.name = projectName;
  pkg.version = "0.1.0";

  await writeFile(pkgFile, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
}

async function updateSeoData(projectDir, projectName) {
  const seoFile = resolve(projectDir, "src/utils/seoData.js");
  let content = await readFile(seoFile, "utf-8");

  // Replace SITE_NAME
  content = content.replace(
    /export const SITE_NAME = ".*?";/,
    `export const SITE_NAME = "${projectName}";`
  );

  // Replace site name in SEO entries
  content = content.replace(/My Shop/g, projectName);

  await writeFile(seoFile, content, "utf-8");
}

function isValidHex(hex) {
  return /^#?[0-9a-fA-F]{6}$/.test(hex);
}

function normalizeHex(hex) {
  return hex.startsWith("#") ? hex : `#${hex}`;
}

// ========================================
// MAIN
// ========================================

async function main() {
  console.log("");
  console.log("  LaunchKit Shop - створення нового проекту");
  console.log("  ==========================================");
  console.log("");

  // 1. Project name
  const projectName = await ask("Назва проекту");
  if (!projectName) {
    console.log("Назва проекту обов'язкова.");
    rl.close();
    process.exit(1);
  }

  const projectDir = resolve(process.cwd(), projectName);

  if (existsSync(projectDir)) {
    console.log(`Папка "${projectName}" вже існує.`);
    rl.close();
    process.exit(1);
  }

  // 2. Brand color
  console.log("");
  console.log("  Основний колір бренду — кнопки, акценти, футер.");
  console.log("  Вся палітра згенерується автоматично.");
  const colorInput = await ask("Hex колір", "#a66e4a");
  const brandColor = normalizeHex(colorInput);

  if (!isValidHex(brandColor)) {
    console.log(`Невірний hex колір: ${brandColor}`);
    rl.close();
    process.exit(1);
  }

  rl.close();

  // 3. Copy template
  console.log("");
  console.log(`Створюю проект "${projectName}"...`);

  await mkdir(projectDir, { recursive: true });

  const SKIP = ["node_modules", ".git", "dist", "dist-ssr", "docs", "cli", ".claude", ".env"];

  await cp(TEMPLATE_DIR, projectDir, {
    recursive: true,
    filter: (src) => {
      const name = src.replace(TEMPLATE_DIR, "").replace(/\\/g, "/").split("/")[1];
      return !SKIP.includes(name);
    },
  });

  // 4. Update project name
  console.log("Оновлюю назву проекту...");
  await updatePackageJson(projectDir, projectName);
  await updateSeoData(projectDir, projectName);

  // 5. Generate colors
  if (brandColor !== "#a66e4a") {
    console.log(`Генерую кольорову палітру з ${brandColor}...`);
    await applyColors(projectDir, brandColor);
  }

  // 6. Install dependencies
  console.log("Встановлюю залежності...");
  try {
    execSync("npm install", { cwd: projectDir, stdio: "inherit" });
  } catch {
    console.log("npm install не вдалось. Запустіть вручну:");
    console.log(`  cd ${projectName} && npm install`);
  }

  // 7. Done
  console.log("");
  console.log("  Готово! Запускайте:");
  console.log(`  cd ${projectName}`);
  console.log("  npm run dev");
  console.log("");
}

main();
