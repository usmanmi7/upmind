/**
 * Solve Them — Access Layer
 *
 * Wraps the static problems dataset with the same shape as a Prisma client
 * would, so we can swap to DB-backed data later without touching the UI.
 */

import { PROBLEMS } from "./problems-data";
import type { Problem, ProblemScope, DifficultyLevel } from "./types";

export function getAllProblems(): Problem[] {
  return PROBLEMS;
}

export function getProblemBySlug(slug: string): Problem | undefined {
  return PROBLEMS.find((p) => p.slug === slug);
}

export function getProblemsByCategory(category: string): Problem[] {
  return PROBLEMS.filter((p) => p.category === category);
}

export function searchProblems(query: string): Problem[] {
  const q = query.toLowerCase().trim();
  if (!q) return PROBLEMS;
  return PROBLEMS.filter((p) => {
    return (
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}

export function filterProblems(opts: {
  query?: string;
  category?: string;
  difficulty?: DifficultyLevel | "ALL";
  scope?: ProblemScope | "ALL";
  tags?: string[];
  sortBy?: "severity" | "innovationScore" | "impactScore" | "marketNeed" | "futureImportance";
  limit?: number;
}): Problem[] {
  let results = PROBLEMS;

  if (opts.query) {
    results = searchProblems(opts.query);
  }
  if (opts.category && opts.category !== "All") {
    results = results.filter((p) => p.category === opts.category);
  }
  if (opts.difficulty && opts.difficulty !== "ALL") {
    results = results.filter((p) => p.difficultyLevel === opts.difficulty);
  }
  if (opts.scope && opts.scope !== "ALL") {
    results = results.filter((p) => p.scope === opts.scope);
  }
  if (opts.tags && opts.tags.length > 0) {
    results = results.filter((p) => opts.tags!.some((t) => p.tags.includes(t)));
  }

  const sortBy = opts.sortBy || "impactScore";
  results = [...results].sort((a, b) => b[sortBy] - a[sortBy]);

  if (opts.limit) {
    results = results.slice(0, opts.limit);
  }

  return results;
}

export function getAllCategories(): string[] {
  const set = new Set<string>();
  PROBLEMS.forEach((p) => set.add(p.category));
  return Array.from(set).sort();
}

export function getAllTags(): string[] {
  const set = new Set<string>();
  PROBLEMS.forEach((p) => p.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}

export function getProblemStats() {
  return {
    total: PROBLEMS.length,
    categories: new Set(PROBLEMS.map((p) => p.category)).size,
    avgSeverity: Math.round(
      PROBLEMS.reduce((s, p) => s + p.severity, 0) / PROBLEMS.length
    ),
    avgImpact: Math.round(
      PROBLEMS.reduce((s, p) => s + p.impactScore, 0) / PROBLEMS.length
    ),
    totalPeopleAffected: "5+ Billion",
  };
}

/**
 * AI Innovation Engine — matches a user's skills + interests to problems.
 * Pure client-side scoring; can be upgraded to LLM-based matching later.
 */
export interface InnovationInput {
  skills: string[];
  interests: string[];
  timeCommitmentMonths?: number;
  teamSize?: number;
  difficultyPreference?: DifficultyLevel | "ANY";
}

export interface InnovationMatchResult {
  problem: Problem;
  matchScore: number; // 0-100
  matchedSkills: string[];
  reasonHighlights: string[];
}

export function matchInnovations(input: InnovationInput): InnovationMatchResult[] {
  const userSkillsLower = input.skills.map((s) => s.toLowerCase().trim());
  const userInterestsLower = input.interests.map((i) => i.toLowerCase().trim());

  const results: InnovationMatchResult[] = PROBLEMS.map((problem) => {
    const problemSkillsLower = problem.skills.map((s) => s.skill.toLowerCase());

    // Skill match — most important
    const matchedSkills: string[] = [];
    let skillOverlap = 0;
    let skillImportanceSum = 0;
    let matchedImportanceSum = 0;
    problem.skills.forEach((ps) => {
      skillImportanceSum += ps.importance;
      const psLower = ps.skill.toLowerCase();
      const isMatch = userSkillsLower.some(
        (us) =>
          psLower.includes(us) ||
          us.includes(psLower) ||
          psLower === us
      );
      if (isMatch) {
        skillOverlap += 1;
        matchedImportanceSum += ps.importance;
        matchedSkills.push(ps.skill);
      }
    });
    const skillCoverage =
      skillImportanceSum > 0 ? matchedImportanceSum / skillImportanceSum : 0;

    // Interest match — checks tags, category, title keywords
    let interestOverlap = 0;
    userInterestsLower.forEach((ui) => {
      if (!ui) return;
      const inTags = problem.tags.some((t) => t.toLowerCase().includes(ui));
      const inCat = problem.category.toLowerCase().includes(ui);
      const inTitle = problem.title.toLowerCase().includes(ui);
      if (inTags || inCat || inTitle) interestOverlap += 1;
    });

    // Difficulty preference
    let difficultyBonus = 0;
    if (input.difficultyPreference && input.difficultyPreference !== "ANY") {
      if (problem.difficultyLevel === input.difficultyPreference) {
        difficultyBonus = 10;
      }
    }

    // Time commitment — bonus if problem fits in user's time
    let timeBonus = 0;
    if (input.timeCommitmentMonths && problem.estimatedTimelineMonths) {
      if (problem.estimatedTimelineMonths <= input.timeCommitmentMonths) {
        timeBonus = 5;
      }
    }

    // Team size
    let teamBonus = 0;
    if (input.teamSize && problem.teamTemplates.length > 0) {
      const fits = problem.teamTemplates.some(
        (t) => input.teamSize! >= t.minMembers && input.teamSize! <= t.maxMembers
      );
      if (fits) teamBonus = 5;
    }

    // Compute weighted score
    const skillScore = skillCoverage * 60; // 0-60
    const interestScore = Math.min(interestOverlap * 15, 30); // 0-30
    const baseScore = skillScore + interestScore + difficultyBonus + timeBonus + teamBonus;

    const matchScore = Math.min(Math.round(baseScore), 100);

    const reasonHighlights: string[] = [];
    if (matchedSkills.length > 0) {
      reasonHighlights.push(
        `Your skills in ${matchedSkills.slice(0, 3).join(", ")} directly apply.`
      );
    }
    if (interestOverlap > 0) {
      reasonHighlights.push(`Matches your interest in ${input.interests.slice(0, 2).join(", ")}.`);
    }
    if (problem.impactScore >= 90) {
      reasonHighlights.push(`Massive impact potential (${problem.impactScore}/100).`);
    }
    if (problem.innovationScore >= 90) {
      reasonHighlights.push(`High room for innovation (${problem.innovationScore}/100).`);
    }
    if (reasonHighlights.length === 0) {
      reasonHighlights.push("Adjacent to your profile.");
    }

    return {
      problem,
      matchScore,
      matchedSkills,
      reasonHighlights,
    };
  });

  return results
    .filter((r) => r.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 12);
}
