/**
 * Generate LinkedIn cover photo for Enginest founder post.
 * Concept: "The Problem Wall" — founder/engineer standing in front of a wall
 * covered in yellow sticky notes, each naming a real-world problem sourced
 * from WHO / UN / IEA. Brand-aligned navy + electric blue palette.
 *
 * Output: /home/z/my-project/download/enginest-linkedin-cover.png
 * Size: 1024x1024 (square — best all-around for LinkedIn single-image posts)
 */

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const PROMPT = `Photorealistic cinematic photograph, shallow depth of field.
A young South Asian engineer (founder) standing in front of a large dark navy blue wall,
the wall completely covered in neat rows of bright yellow sticky notes.
Each sticky note has bold black handwritten text naming a real-world engineering problem
(some readable: "1.2B lack clean water — WHO", "40% crops lost post-harvest — UN FAO",
"Grid storage gap 4TWh by 2030 — IEA", "Vaccine cold chain 40°C climates — WHO",
"Ocean plastic 11M tons/yr — UNEP", "Last-mile electrification — IEA").
The engineer is in profile, looking thoughtfully at the wall, holding a laptop,
wearing a simple dark sweater. Soft directional side light from a window on the left,
creating long shadows across the sticky notes. The wall has a subtle deep navy blue tone
(hex #0F1B3D) with electric blue (hex #3B82F6) accent lighting from above.
Mood: serious, mission-driven, hopeful, cinematic.
Shot on 35mm lens, f/2.0, ISO 800, natural + warm artificial mix.
High detail, professional photography, editorial quality, 4k.`;

const OUTPUT_PATH = '/home/z/my-project/download/enginest-linkedin-cover.png';
const SIZE = '1024x1024';

async function main() {
  console.log('Generating LinkedIn cover photo for Enginest...');
  console.log('Concept: The Problem Wall');
  console.log('Size:', SIZE);
  console.log('---');

  const zai = await ZAI.create();

  const response = await zai.images.generations.create({
    prompt: PROMPT,
    size: SIZE,
  });

  const imageBase64 = response.data[0].base64;
  const buffer = Buffer.from(imageBase64, 'base64');
  fs.writeFileSync(OUTPUT_PATH, buffer);

  const sizeKB = (buffer.length / 1024).toFixed(1);
  console.log(`✓ Image saved to ${OUTPUT_PATH}`);
  console.log(`  File size: ${sizeKB} KB`);
}

main().catch((err) => {
  console.error('✗ Image generation failed:', err);
  process.exit(1);
});
