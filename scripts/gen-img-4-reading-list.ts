/**
 * Generate ONE image — the Resources/Reading List engineering library photo.
 */

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const PROMPT = `A tall stack of well-worn engineering and innovation books on a dark wooden surface, photographed
from a low 3/4 angle. Spine titles are partially visible but stylized — "SYSTEMS THINKING",
"FIELD ENGINEERING", "CLIMATE SOLUTIONS", "THE HARD THING", "STRUCTURES". One book is open on
top of the stack, pages fanned slightly. Reading glasses folded beside the stack. A small brass
flashlight. Dust motes floating in a beam of light coming from the upper left. Mood is
scholarly, late-night study, deep focused learning.
Cinematic editorial photograph, shallow depth of field, 35mm lens at f/2.0,
natural light mixed with cool blue artificial accent light, color grade leaning into deep navy blue
shadows (hex #0F1B3D) with subtle electric blue (hex #3B82F6) highlights, ISO 800, professional
photography, high detail, 4k, serious and mission-driven mood.`;

const OUTPUT_PATH = '/home/z/my-project/public/images/resources/reading-list.jpg';

async function main() {
  console.log('Generating: Resources/Reading List engineering library photo...');
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
