#!/usr/bin/env node
/**
 * Generate Enginest favicon using z-ai-web-dev-sdk.
 * Creates a 1024x1024 source image, then we resize it to 512 (icon.png),
 * 180 (apple-icon.png), and 32 (favicon-32x32.png) via sharp.
 * We also generate favicon.ico from the 16x16 PNG.
 */

const ZAI = require('z-ai-web-dev-sdk').default;
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const OUT_DIR = '/home/z/my-project/src/app';
const PUBLIC_DIR = '/home/z/my-project/public';

const PROMPT = `Minimal modern app icon for an engineering innovation platform called Enginest.
A bold geometric monogram of the letter E formed by interlocking hexagonal and angular shapes,
suggesting engineering precision and problem-solving. The icon sits centered in the frame.
Background: deep navy blue gradient from #0F1B3D at top to #1E3A8A at bottom.
Icon foreground: bright electric blue #3B82F6 with subtle lighter highlights #93C5FD on edges.
Style: flat vector, clean, high contrast, app icon aesthetic, no text, no border,
no shadows, professional, simple enough to read at 16x16. Square 1:1 composition.
The icon should feel technical, precise, and forward-moving — like a blueprint symbol.
Strong visual weight, immediately recognizable, single-color icon on dark background.`;

async function main() {
  console.log('Initializing ZAI...');
  const zai = await ZAI.create();

  console.log('Generating 1024x1024 favicon source...');
  const response = await zai.images.generations.create({
    prompt: PROMPT,
    size: '1024x1024',
  });

  if (!response.data || !response.data[0] || !response.data[0].base64) {
    throw new Error('No image data in response');
  }

  const sourceBuffer = Buffer.from(response.data[0].base64, 'base64');
  const sourcePath = path.join(OUT_DIR, 'icon-source-1024.png');
  fs.writeFileSync(sourcePath, sourceBuffer);
  console.log(`  ✓ Saved 1024x1024 source: ${sourcePath}`);

  // Resize to 512x512 for icon.png
  console.log('Resizing to 512x512 (icon.png)...');
  await sharp(sourceBuffer)
    .resize(512, 512, { fit: 'cover', position: 'center' })
    .png()
    .toFile(path.join(OUT_DIR, 'icon.png'));
  console.log('  ✓ Saved src/app/icon.png (512x512)');

  // Resize to 180x180 for apple-icon.png
  console.log('Resizing to 180x180 (apple-icon.png)...');
  await sharp(sourceBuffer)
    .resize(180, 180, { fit: 'cover', position: 'center' })
    .png()
    .toFile(path.join(OUT_DIR, 'apple-icon.png'));
  console.log('  ✓ Saved src/app/apple-icon.png (180x180)');

  // Resize to 32x32 for public/favicon-32x32.png
  console.log('Resizing to 32x32 (favicon-32x32.png)...');
  await sharp(sourceBuffer)
    .resize(32, 32, { fit: 'cover', position: 'center' })
    .png()
    .toFile(path.join(PUBLIC_DIR, 'favicon-32x32.png'));
  console.log('  ✓ Saved public/favicon-32x32.png (32x32)');

  // Resize to 16x16 and save as favicon.ico (Next.js / browsers accept PNG-named-as-ico)
  console.log('Resizing to 16x16 (favicon.ico)...');
  const buf16 = await sharp(sourceBuffer)
    .resize(16, 16, { fit: 'cover', position: 'center' })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(OUT_DIR, 'favicon.ico'), buf16);
  console.log('  ✓ Saved src/app/favicon.ico (16x16 PNG)');

  // Clean up source file
  fs.unlinkSync(sourcePath);
  console.log('  ✓ Removed temporary 1024 source');

  console.log('\nDone! Favicon set generated:');
  console.log('  - src/app/icon.png (512x512, used by Next.js metadata)');
  console.log('  - src/app/apple-icon.png (180x180, used by Next.js metadata)');
  console.log('  - src/app/favicon.ico (16x16, used by browsers)');
  console.log('  - public/favicon-32x32.png (32x32, legacy)');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
