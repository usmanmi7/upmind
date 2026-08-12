/**
 * Regenerate the HowWeWork image with a more refined, premium prompt.
 * Original was good — this version pushes for:
 *   - Better compositional balance (subject slightly off-center)
 *   - More cinematic lighting (rim light + soft key)
 *   - Clearer prototype on the bench (more visible "real work")
 *   - Tighter crop for more visual impact
 *   - More authentic candid moment (less posed)
 */

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const PROMPT = `Cinematic editorial photograph of a diverse team of three engineers in their early 30s
working intensely around a cluttered engineering workbench in a modern industrial studio.
A woman on the left is leaning forward pointing at a disassembled solar-powered water
purification prototype — its circuit board exposed, wires, a small pump visible. A man
in the center is mid-sketch in a battered notebook, mechanical pencil in hand. Another
man on the right is half-turned toward a laptop showing a CAD rendering, chin resting on
his fist in thought. None of them are looking at the camera — they are completely absorbed
in the problem. Tools, a soldering iron, rolled blueprints, an energy drink can, and
scattered component bins fill the bench. Behind them: a pegboard wall with hand tools,
a string of warm Edison bulbs slightly out of focus.

Lighting: large soft window light from camera left (key), cool blue monitor glow from
camera right (rim/edge), warm Edison bulb accents in the background bokeh.
Color grade: deep navy blue shadows (hex #0F1B3D), electric blue (hex #3B82F6) highlights
on the prototype and laptop screen, warm skin tones preserved.
Shot on 35mm at f/1.8, shutter 1/125, ISO 800, shallow depth of field, slight film grain.
Composition: rule of thirds, prototype on the lower-right intersection, lead engineer's
face on the upper-left intersection. Lots of negative space in the upper-right for text
overlay if needed. Mood: focused, mission-driven, candid — like a documentary still from
a real engineering studio, not a stock photo. 4k, professional photography.`;

const OUTPUT_PATH = '/home/z/my-project/public/images/howwework-team.jpg';

async function main() {
  console.log('Regenerating HowWeWork image with refined prompt...');
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
