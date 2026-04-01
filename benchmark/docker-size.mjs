import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function sh(cmd, args, opts = {}) {
  const { stdout, stderr } = await execFileAsync(cmd, args, { ...opts, windowsHide: true });
  return { stdout: stdout.trim(), stderr: stderr.trim() };
}

function pctReduction(beforeBytes, afterBytes) {
  if (!beforeBytes || !afterBytes) return null;
  return ((beforeBytes - afterBytes) / beforeBytes) * 100;
}

async function imageSizeBytes(ref) {
  const { stdout } = await sh("docker", ["image", "inspect", ref, "--format", "{{.Size}}"]);
  const n = Number(stdout);
  if (!Number.isFinite(n)) throw new Error(`Unable to parse image size for ${ref}: ${stdout}`);
  return n;
}

async function main() {
  const outJson = path.join(__dirname, "docker-sizes.json");
  const outMd = path.join(__dirname, "docker-sizes.md");

  const now = new Date().toISOString();

  // Build images (requires Docker engine running)
  const multistageTag = "kanban-flowmate:multistage";
  const singleTag = "kanban-flowmate:single";

  await sh("docker", ["build", "-t", multistageTag, "."]);
  await sh("docker", ["build", "-f", path.join("benchmark", "Dockerfile.single"), "-t", singleTag, "."]);

  const multistageBytes = await imageSizeBytes(multistageTag);
  const singleBytes = await imageSizeBytes(singleTag);

  const reductionPct = pctReduction(singleBytes, multistageBytes);

  const payload = {
    timestamp: now,
    images: {
      multistage: { tag: multistageTag, size_bytes: multistageBytes },
      single_stage_baseline: { tag: singleTag, size_bytes: singleBytes },
    },
    reduction: {
      percent: reductionPct,
      formula: "(single_stage_baseline - multistage) / single_stage_baseline * 100",
    },
  };

  await fs.writeFile(outJson, JSON.stringify(payload, null, 2), "utf8");

  const lines = [];
  lines.push("## Docker Image Size Comparison");
  lines.push("");
  lines.push(`- **Timestamp**: \`${now}\``);
  lines.push(`- **Multi-stage image**: \`${multistageTag}\``);
  lines.push(`- **Single-stage baseline**: \`${singleTag}\``);
  lines.push("");
  lines.push("| Image | Size (bytes) |");
  lines.push("|---|---:|");
  lines.push(`| Multi-stage | ${multistageBytes} |`);
  lines.push(`| Single-stage baseline | ${singleBytes} |`);
  lines.push("");
  lines.push(`- **Size reduction**: ${reductionPct?.toFixed(2)}%`);
  lines.push("");

  await fs.writeFile(outMd, lines.join("\n"), "utf8");

  process.stdout.write(`Wrote ${outJson}\nWrote ${outMd}\n`);
}

await main();

