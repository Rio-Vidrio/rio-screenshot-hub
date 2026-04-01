const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const publicDir = path.join(__dirname, "../public");
const svgPath = path.join(publicDir, "icon.svg");
const svgBuffer = fs.readFileSync(svgPath);

async function main() {
  // favicon.ico — 32x32 PNG saved as .ico (browsers accept PNG-encoded ICO)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, "favicon.ico"));
  console.log("✓ favicon.ico");

  // apple-touch-icon.png — 180x180
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, "apple-touch-icon.png"));
  console.log("✓ apple-touch-icon.png");

  // icon-192.png
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, "icon-192.png"));
  console.log("✓ icon-192.png");

  // icon-512.png
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, "icon-512.png"));
  console.log("✓ icon-512.png");

  // og-image.png — 1200x630
  // Build a composite: dark background + centered mark (120x120) + text SVG overlay
  const markSize = 120;
  const markBuffer = await sharp(svgBuffer).resize(markSize, markSize).png().toBuffer();

  // Text overlay as SVG
  const textSvg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#1A1714"/>
  <text x="380" y="288" font-family="Georgia, serif" font-size="42" font-weight="400" fill="#FAFAF9" letter-spacing="0.5">Rio Screenshot Hub</text>
  <text x="380" y="340" font-family="Georgia, serif" font-size="20" font-weight="300" fill="#6B6560">Drop any screenshot. AI reads it and routes it automatically.</text>
</svg>`;

  await sharp(Buffer.from(textSvg))
    .composite([
      {
        input: markBuffer,
        top: Math.round((630 - markSize) / 2),
        left: 200,
      },
    ])
    .png()
    .toFile(path.join(publicDir, "og-image.png"));
  console.log("✓ og-image.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
