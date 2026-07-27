/**
 * Solve Them, Engineering Innovation Platform
 * Type definitions for the Problems dataset.
 *
 * This module is the single source of truth for the world-problems dataset
 * that powers the /solve-them public page and the AI Innovation Engine.
 *
 * Each Problem follows the same shape as the Prisma `Problem` model so we can
 * migrate to a database-backed source later without touching the UI layer.
 */

export type ProblemScope = "GLOBAL" | "REGIONAL" | "NATIONAL" | "LOCAL";
export type DifficultyLevel = "EASY" | "MEDIUM" | "HARD" | "EXTREME";

export interface ProblemSolution {
  title: string;
  description: string;
}

export interface ProblemSkill {
  skill: string;
  importance: number; // 1-10
}

export interface ProblemTeam {
  templateName: string;
  minMembers: number;
  maxMembers: number;
  estimatedTimelineMonths?: number;
  roles: string[];
}

export interface ProblemRoadmap {
  phase: string;
  title: string;
  description: string;
  duration?: string;
}

export interface Problem {
  /** Stable URL slug, e.g. "ai-flood-prediction-platform" */
  slug: string;
  title: string;
  /** 1-2 sentence public description shown on cards */
  summary: string;
  /** Full public description shown on detail page */
  description: string;

  /** Top-level category */
  category: string;
  /** Multi-tag for flexible filtering */
  tags: string[];
  /** Where this problem was sourced from (WHO, UN, research paper, etc.) */
  source?: string;
  sourceUrl?: string;

  scope: ProblemScope;
  regions: string[];
  countriesAffected: string[];
  /** Human-readable string e.g. "19 Million+" */
  peopleAffected?: string;

  // Scoring (0-100 unless noted)
  severity: number;       // how bad is this problem?
  difficulty: number;     // 1-10 scale
  marketNeed: number;     // demand for solutions
  globalDemand: number;   // % of world that needs this solved
  futureImportance: number;
  innovationScore: number;
  impactScore: number;

  canEngineersSolve: boolean;
  engineerSolvableNote?: string;

  estimatedTimelineMonths?: number;
  difficultyLevel: DifficultyLevel;
  projectTypes: string[];

  /** Locked content (only shown to logged-in users) */
  solutions: ProblemSolution[];
  skills: ProblemSkill[];
  teamTemplates: ProblemTeam[];
  roadmaps: ProblemRoadmap[];
}

export const PROBLEM_CATEGORIES = [
  "Healthcare",
  "Climate Change",
  "Artificial Intelligence",
  "Cyber Security",
  "Agriculture",
  "Education",
  "Energy",
  "Water & Sanitation",
  "Transportation",
  "Housing",
  "Mental Health",
  "Poverty",
  "Hunger",
  "Equality",
  "Disaster Response",
  "Ocean & Marine",
  "Biodiversity",
  "Waste Management",
  "Space",
  "Quantum Computing",
  "Robotics",
  "Biotechnology",
  "Materials Science",
  "Urban Planning",
  "Financial Inclusion",
  "Accessibility",
] as const;

export type ProblemCategory = (typeof PROBLEM_CATEGORIES)[number];
