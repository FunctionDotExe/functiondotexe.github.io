// Resize + convert portfolio media to right-sized WebP.
// Run: node scripts/optimize-images.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = (p) => path.join(root, "public", "media", "work", p);

// Displayed at most ~584px wide (2-col grid at 1280) / ~365px tall for
// contained phone screenshots; targets are 2x for retina.
const jobs = [
  { in: "decyphergamehomepage.png", height: 730 },
  { in: "decyphergame1.png", height: 640 },
  { in: "decyphergame2.png", height: 640 },
  { in: "decyphergame3.png", height: 640 },
  { in: "marketopportunityanalyzer.png", width: 1168 },
  { in: "marketopportunityanalyzer2.png", width: 560 },
  { in: "marketopportunityanalyzer3.png", width: 560 },
  { in: "arduinorrobot.jpg", width: 1168 },
  { in: "certificate-machine-learning-python.jpeg", width: 810 },
  { in: "certificate-ai-for-everyone.jpeg", width: 810 },
  { in: "certificate-version-control.jpeg", width: 810 },
  { in: "video-thumb.jpg", width: 1168, optional: true },
];

await mkdir(path.join(root, "public", "media", "work"), { recursive: true });

const results = [];
for (const job of jobs) {
  const input = src(job.in);
  const outName = job.in.replace(/\.(png|jpe?g)$/i, ".webp");
  try {
    const img = sharp(input).resize({
      width: job.width,
      height: job.height,
      fit: "inside",
      withoutEnlargement: true,
    });
    const info = await img.webp({ quality: 80 }).toFile(src(outName));
    results.push({ out: outName, width: info.width, height: info.height, kb: Math.round(info.size / 1024) });
  } catch (err) {
    if (job.optional) continue;
    console.error(`FAILED ${job.in}: ${err.message}`);
    process.exitCode = 1;
  }
}

console.log(JSON.stringify(results, null, 2));
