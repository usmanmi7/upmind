/**
 * Engineering Resources — Access Layer
 *
 * Wraps the static resources dataset with the same shape as a Prisma client
 * would, so we can swap to DB-backed data later without touching the UI.
 */

import { RESOURCES, type EngineeringResource, type ResourceType } from "../resources-data";

export type { EngineeringResource, ResourceType };

export interface ResourceFilterOpts {
  query?: string;
  category?: string; // "All" means no filter
  type?: ResourceType | "All";
  isPremium?: "all" | "free" | "premium";
  limit?: number;
}

export function getAllResources(): EngineeringResource[] {
  return RESOURCES;
}

export function getResourceBySlug(slug: string): EngineeringResource | undefined {
  return RESOURCES.find((r) => r.slug === slug);
}

export function getRelatedResources(slug: string, limit = 3): EngineeringResource[] {
  const target = getResourceBySlug(slug);
  if (!target) return [];
  return RESOURCES.filter(
    (r) => r.slug !== slug && r.category === target.category
  ).slice(0, limit);
}

export function filterResources(opts: ResourceFilterOpts): EngineeringResource[] {
  let results = RESOURCES;

  if (opts.query) {
    const q = opts.query.toLowerCase().trim();
    results = results.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }

  if (opts.category && opts.category !== "All") {
    results = results.filter((r) => r.category === opts.category);
  }

  if (opts.type && opts.type !== "All") {
    results = results.filter((r) => r.type === opts.type);
  }

  if (opts.isPremium === "free") {
    results = results.filter((r) => !r.isPremium);
  } else if (opts.isPremium === "premium") {
    results = results.filter((r) => r.isPremium);
  }

  // Sort newest first
  results = [...results].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (opts.limit) {
    results = results.slice(0, opts.limit);
  }

  return results;
}

export function getResourceCategories(): string[] {
  const set = new Set<string>();
  RESOURCES.forEach((r) => set.add(r.category));
  return Array.from(set).sort();
}

export function getResourceStats() {
  return {
    total: RESOURCES.length,
    categories: new Set(RESOURCES.map((r) => r.category)).size,
    freeCount: RESOURCES.filter((r) => !r.isPremium).length,
    premiumCount: RESOURCES.filter((r) => r.isPremium).length,
  };
}
