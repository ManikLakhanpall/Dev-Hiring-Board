import type { Job } from "../types";

export function getUniqueTags(jobs: Job[]): string[] {
  return [...new Set(jobs.flatMap((job) => job.tags))];
}
