/**
 * Regenerate the 3 Resources section images.
 *
 * User direction:
 *   "professional images — people doing something in office, talking
 *    between team, discussing or doing work. No books."
 *
 * Map to resource titles:
 *   1. Guide   — "How to Find Problems Worth Solving"
 *      → Two engineers brainstorming at a whiteboard covered in problem
 *        sticky notes and sketches. Active discussion vibe.
 *   2. Template — "Engineering Project Roadmap (12-month)"
 *      → Three engineers around a laptop, planning a project timeline.
 *        One pointing at the screen, others leaning in.
 *   3. Reading List → renamed conceptually to "Engineering Innovators"
 *      → Mentor and junior engineer in a 1:1 discussion, looking at a
 *        tablet together. Knowledge-transfer moment.
 *
 * All three share the same bright modern studio setting as the new
 * HowWeWork image — consistent series, brand-aligned palette.
 */

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const SHARED_STYLE = `Bright modern professional office studio, soft natural window light from
the left mixed with cool blue ambient fill light. Color grade: warm skin tones preserved,
deep navy blue shadows (hex #0F1B3D), subtle electric blue (hex #3B82F6) accent highlights.
Cinematic editorial photograph, 35mm lens at f/2.0, shallow depth of field, ISO 400,
professional photography, candid documentary feel — not posed stock photo. 4k, high detail.`;

const jobs = [
  {
    outPath: '/home/z/my-project/public/images/resources/guide.jpg',
    label: 'Resource 1 — Guide: team brainstorming at whiteboard',
    prompt: `Two engineers in their early 30s standing at a large whiteboard in a bright modern office
studio, mid-discussion. The whiteboard is filled with hand-drawn diagrams, sticky notes, and
sketches — clearly brainstorming real-world problems. A South Asian woman on the left is holding
a marker and gesturing toward a sticky note cluster. A Black man on the right is leaning forward
slightly, listening intently with his arms crossed, chin tilted in thought. Both dressed in smart
casual — sweaters, simple shirts. The mood is focused, collaborative, intellectual.

${SHARED_STYLE}`,
  },
  {
    outPath: '/home/z/my-project/public/images/resources/template.jpg',
    label: 'Resource 2 — Template: team planning around laptop',
    prompt: `Three engineers in their late 20s to mid 30s gathered around a sleek laptop on a clean
minimalist desk in a bright modern office studio. One East Asian woman is pointing at the screen
with a pen, explaining something. One South Asian man on the left is leaning in closer, squinting
slightly. One white man on the right is taking notes in a paper notebook, half-listening. The
laptop screen shows a project timeline / Gantt chart with navy blue bars. Empty coffee cups, a
small desk plant, and scattered sticky notes complete the scene. Mood is focused planning,
professional, mid-work session.

${SHARED_STYLE}`,
  },
  {
    outPath: '/home/z/my-project/public/images/resources/reading-list.jpg',
    label: 'Resource 3 — Innovators: mentor and junior engineer 1:1',
    prompt: `A mentor and a junior engineer in a bright modern office studio, having a 1:1 discussion
over a tablet. The mentor — a woman in her 40s with glasses, wearing a charcoal blazer — is
holding the tablet and gesturing toward something on screen, mid-explanation. The junior engineer
— a man in his mid 20s, wearing a simple sweater — is leaning in, looking at the screen with
focused attention. They are standing beside a high table with a half-empty coffee cup. The mood
is knowledge transfer, mentorship, professional development. Candid documentary feel — neither
is looking at the camera.

${SHARED_STYLE}`,
  },
];

async function generateOne(
  zai: Awaited<ReturnType<typeof ZAI.create>>,
  job: (typeof jobs)[number]
) {
  console.log(`→ Generating: ${job.label}`);
  const response = await zai.images.generations.create({
    prompt: job.prompt,
    size: '1344x768',
  });
  const buffer = Buffer.from(response.data[0].base64, 'base64');
  fs.writeFileSync(job.outPath, buffer);
  console.log(`  ✓ saved (${(buffer.length / 1024).toFixed(1)} KB)\n`);
}

async function main() {
  console.log(`Generating ${jobs.length} professional Resources images...\n`);
  const zai = await ZAI.create();
  for (const job of jobs) {
    let lastErr: unknown;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        await generateOne(zai, job);
        lastErr = null;
        break;
      } catch (err) {
        lastErr = err;
        console.error(`  ✗ attempt ${attempt} failed: ${(err as Error).message}`);
        if (attempt < 2) await new Promise((r) => setTimeout(r, 1500));
      }
    }
    if (lastErr) throw lastErr;
  }
  console.log('✓ All 3 Resources images generated.');
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
