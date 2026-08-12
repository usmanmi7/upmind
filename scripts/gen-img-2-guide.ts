/**
 * Generate ONE image — the Resources/Guide field research photo.
 */

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const PROMPT = `Close-up overhead photograph of an engineer's hands holding a clipboard with hand-drawn
field notes, standing in a rural developing-world setting with a small solar panel and water pump
visible in the soft-focus background. The clipboard has charts, a small map, and the words
"PROBLEM INDEX" written at the top in handwritten capital letters. Warm skin tones, worn work
gloves resting on the clipboard edge. Sense of real field work, not a studio shoot.
Natural harsh daylight, dust particles in the air.
Cinematic editorial photograph, shallow depth of field, 35mm lens at f/2.0,
natural light mixed with cool blue artificial accent light, color grade leaning into deep navy blue
shadows (hex #0F1B3D) with subtle electric blue (hex #3B82F6) highlights, ISO 800, professional
photography, high detail, 4k, serious and mission-driven mood.`;

const OUTPUT_PATH = '/home/z/my-project/public/images/resources/guide.jpg';

async function main() {
  console.log('Generating: Resources/Guide field research photo...');
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
