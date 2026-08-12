/**
 * Generate ONE image — the Resources/Template project roadmap photo.
 */

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const PROMPT = `A modern minimalist desk shot from above at a slight angle. On the desk: a large open notebook
showing a hand-drawn 4-phase project roadmap with arrows, milestones marked with circles, and
phase labels "VALIDATE", "PROTOTYPE", "PILOT", "SCALE" written in clean uppercase letters.
A matte black mechanical pencil rests on the page. A cup of black coffee. A small
blueprint-rolled tube at the top edge. The desk is dark walnut wood. Lighting is dramatic —
a single cool white desk lamp casting a strong directional beam across the page, deep navy
shadows in the corners.
Cinematic editorial photograph, shallow depth of field, 35mm lens at f/2.0,
natural light mixed with cool blue artificial accent light, color grade leaning into deep navy blue
shadows (hex #0F1B3D) with subtle electric blue (hex #3B82F6) highlights, ISO 800, professional
photography, high detail, 4k, serious and mission-driven mood.`;

const OUTPUT_PATH = '/home/z/my-project/public/images/resources/template.jpg';

async function main() {
  console.log('Generating: Resources/Template project roadmap photo...');
  const zai = await ZAI.create();
  const response = await zai.images.generations.create({
    prompt: PROMPT,
    size: '1344x768',
  });
  const buffer = Buffer.from(response.data[0].base64, 'base64');
  fs.writeFileSync(OUTPUT_PATH, buffer);
  console.log(`✓ saved to ${OUTPUT_PATH} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error('FAILED:', err);
  process.exit(1);
});
