/**
 * Generate 4 professional images for the Enginest home page:
 *   1. howwework-team.jpg   — engineers collaborating on real-world problem solving
 *   2. guide.jpg            — field research / problem discovery
 *   3. template.jpg         — engineering project roadmap / planning
 *   4. reading-list.jpg     — engineering innovation library / deep study
 *
 * All 4 share a consistent visual language:
 *   - Cinematic, editorial photography style
 *   - Enginest brand palette (navy #0F1B3D, electric blue #3B82F6, cyan #93C5FD)
 *   - Serious, mission-driven mood — matches "engineers building things that matter"
 *   - Shot on 35mm, shallow depth of field, natural + cool artificial light mix
 *
 * Output paths match what the components already reference, so once generated
 * they drop straight in with no code changes needed.
 */

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = '/home/z/my-project/public/images';
const RESOURCES_DIR = '/home/z/my-project/public/images/resources';

type Job = {
  outPath: string;
  size: '1344x768' | '1024x1024' | '1440x720';
  prompt: string;
  label: string;
};

const SHARED_STYLE = `Cinematic editorial photograph, shallow depth of field, 35mm lens at f/2.0,
natural light mixed with cool blue artificial accent light, color grade leaning into deep navy blue
shadows (hex #0F1B3D) with subtle electric blue (hex #3B82F6) highlights, ISO 800, professional
photography, high detail, 4k, serious and mission-driven mood.`;

const jobs: Job[] = [
  // ─── 1. HowWeWork section ──────────────────────────────────────────────
  // Wide landscape — fills the right half of a split section.
  {
    outPath: path.join(OUTPUT_DIR, 'howwework-team.jpg'),
    size: '1344x768',
    label: 'HowWeWork — engineers collaborating',
    prompt: `A diverse team of four engineers in their early 30s gathered around a large wooden workbench
in a softly lit modern engineering studio. They are reviewing blueprints, a partially disassembled
solar-powered water filtration prototype on the bench in front of them. One woman is pointing at a
laptop screen showing a CAD model. One man is taking notes in a paper notebook. The mood is
focused, collaborative, mission-driven — like they are solving a real-world problem, not posing.
Tools and field equipment visible on shelves behind them. Natural window light from the left,
cool blue accent light from a monitor on the right. ${SHARED_STYLE}`,
  },

  // ─── 2. Resources / Guide ──────────────────────────────────────────────
  // Guide = "How to Find Problems Worth Solving" → field research vibe
  {
    outPath: path.join(RESOURCES_DIR, 'guide.jpg'),
    size: '1344x768',
    label: 'Resource: Guide — field research',
    prompt: `Close-up overhead photograph of an engineer's hands holding a clipboard with hand-drawn
field notes, standing in a rural developing-world setting with a small solar panel and water pump
visible in the soft-focus background. The clipboard has charts, a small map, and the words
"PROBLEM INDEX" written at the top in handwritten capital letters. Warm skin tones, worn work
gloves resting on the clipboard edge. Sense of real field work, not a studio shoot.
Natural harsh daylight, dust particles in the air. ${SHARED_STYLE}`,
  },

  // ─── 3. Resources / Template ───────────────────────────────────────────
  // Template = "Engineering Project Roadmap (12-month)" → planning / Gantt vibe
  {
    outPath: path.join(RESOURCES_DIR, 'template.jpg'),
    size: '1344x768',
    label: 'Resource: Template — project roadmap',
    prompt: `A modern minimalist desk shot from above at a slight angle. On the desk: a large open notebook
showing a hand-drawn 4-phase project roadmap with arrows, milestones marked with circles, and
phase labels "VALIDATE", "PROTOTYPE", "PILOT", "SCALE" written in clean uppercase letters.
A matte black mechanical pencil rests on the page. A cup of black coffee. A small
blueprintsrolled tube at the top edge. The desk is dark walnut wood. Lighting is dramatic —
a single cool white desk lamp casting a strong directional beam across the page, deep navy
shadows in the corners. ${SHARED_STYLE}`,
  },

  // ─── 4. Resources / Reading List ───────────────────────────────────────
  // Reading List = "Reading List for Engineering Innovators" → study / library vibe
  {
    outPath: path.join(RESOURCES_DIR, 'reading-list.jpg'),
    size: '1344x768',
    label: 'Resource: Reading List — engineering library',
    prompt: `A tall stack of well-worn engineering and innovation books on a dark wooden surface, photographed
from a low 3/4 angle. Spine titles are partially visible but stylized — "SYSTEMS THINKING",
"FIELD ENGINEERING", "CLIMATE SOLUTIONS", "THE HARD THING", "STRUCTURES". One book is open on
top of the stack, pages fanned slightly. Reading glasses folded beside the stack. A small brass
flashlight. Dust motes floating in a beam of light coming from the upper left. Mood is
scholarly, late-night study, deep focused learning. ${SHARED_STYLE}`,
  },
];

async function generateOne(zai: Awaited<ReturnType<typeof ZAI.create>>, job: Job) {
  console.log(`→ Generating: ${job.label}`);
  console.log(`  size: ${job.size}`);
  console.log(`  out:  ${job.outPath}`);

  const response = await zai.images.generations.create({
    prompt: job.prompt,
    size: job.size,
  });

  const imageBase64 = response.data[0].base64;
  const buffer = Buffer.from(imageBase64, 'base64');

  // Ensure parent dir exists
  fs.mkdirSync(path.dirname(job.outPath), { recursive: true });
  fs.writeFileSync(job.outPath, buffer);

  const sizeKB = (buffer.length / 1024).toFixed(1);
  console.log(`  ✓ saved (${sizeKB} KB)\n`);
}

async function main() {
  console.log(`Generating ${jobs.length} professional images for Enginest home page...`);
  console.log('='.repeat(60));

  const zai = await ZAI.create();

  for (const job of jobs) {
    // Retry up to 2 times per image — API occasionally hiccups.
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
    if (lastErr) {
      console.error(`FAILED: ${job.label} — giving up.`);
      throw lastErr;
    }
  }

  console.log('='.repeat(60));
  console.log('✓ All images generated successfully.');
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
