import { Job } from "../types";

// ─── Service Layer: Job API ───────────────────────────────────────────────────
// Responsible for fetching remote job data. Has no UI or state responsibilities.

const API_URL = "https://remoteok.com/api";

export const JobService = {
  async fetchJobs(): Promise<Job[]> {
    try {
      const response = await fetch(API_URL);
      const data: any[] = await response.json();
      return data.filter((job) => job.id) as Job[];
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  },
};
