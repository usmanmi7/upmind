/**
 * Generate ONE image — the HowWeWork team photo.
 * Run separately so each call has its own timeout.
 */

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const PROMPT = `A diverse team of four engineers in their early 30s gathered around a large wooden workbench
in a softly lit modern engineering studio. They are reviewing blueprints, a partially disassembled
solar-powered water filtration prototype on the bench in front of them. One woman is pointing at a
laptop screen showing a CAD model. One man is taking notes in a paper notebook. The mood is
focused, collaborative, mission-driven — like they are solving a real-world problem, not posing.
Tools and field equipment visible on shelves behind them. Natural window light from the left,
cool blue accent light from a monitor on the right.
Cinematic editorial photograph, shallow depth of field, 35mm lens at f/2.0,
natural light mixed with cool blue artificial accent light, color grade leaning into deep navy blue
shadows (hex #0F1B3D) with subtle electric blue (hex #3B82F6) highlights, ISO 800, professional
photography, high detail, 4k, serious and mission-driven mood.`;

const OUTPUT_PATH = '/home/z/my-project/public/images/howwework-team.jpg';

async function main() {
  console.log('Generating: HowWeWork team photo...');
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
