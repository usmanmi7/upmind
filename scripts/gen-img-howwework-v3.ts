/**
 * Regenerate HowWeWork image — v3.
 *
 * Brief from user: "professional one"
 *
 * Prior version (v2) was a cluttered engineering studio — too busy, felt
 * more like a documentary still than a polished brand asset. This version
 * aims for: clean, premium, modern, professional. The kind of image you'd
 * see on Stripe / Linear / Vercel homepage — but with engineers and a
 * real-world-problem-solving feel that fits Enginest's mission.
 *
 * Key shifts from v2:
 *   - Cleaner composition (less clutter, more negative space)
 *   - Single primary subject (one engineer, focused, not a group shot)
 *   - Modern bright studio (not dark workshop)
 *   - Premium soft lighting (not moody cinematic)
 *   - Brand-aligned palette but lighter / more airy
 *   - Leaves room for text overlay if needed
 */

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const PROMPT = `Professional editorial photograph of a single female engineer in her early 30s, seated at a
clean minimalist desk in a bright modern studio. She is wearing a simple charcoal sweater,
looking thoughtfully at a large wall-mounted display showing a world map with pinned problem
locations and data overlays. Her hands rest on an open laptop and a paper notebook with
handwritten notes. The desk is uncluttered — just the laptop, notebook, a matte black pen,
and a small desk plant.

The wall behind her is a soft warm off-white. The world map on the display is rendered in
deep navy blue (hex #0F1B3D) with electric blue (hex #3B82F6) pin markers and thin cyan
(hex #93C5FD) data lines. Her face is in profile, lit softly from a large window off-camera
left. Subtle cool fill light from the right.

Composition: subject positioned on the left third of the frame, the world map display filling
the right two-thirds. Lots of clean negative space. Shot on 50mm at f/2.2, ISO 200, very
shallow depth of field on the foreground notebook but the engineer and screen in sharp focus.

Mood: focused, calm, professional, premium, modern. The feel of a polished tech company
homepage hero image — not a stock photo, not a documentary still. Bright, airy, optimistic
but serious. 4k, professional photography, editorial quality.`;

const OUTPUT_PATH = '/home/z/my-project/public/images/howwework-team.jpg';

async function main() {
  console.log('Regenerating HowWeWork image v3 — professional / premium look...');
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
