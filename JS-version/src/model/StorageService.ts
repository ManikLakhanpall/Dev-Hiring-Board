// ─── Model Layer: Storage Service ────────────────────────────────────────────
// Handles all localStorage read/write operations for persisted job state.

const SAVED_JOBS_KEY = "savedJobs";
const APPLIED_JOBS_KEY = "appliedJobs";

export const StorageService = {
  loadSavedJobs(): string[] {
    const data = localStorage.getItem(SAVED_JOBS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveSavedJobs(ids: string[]): void {
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(ids));
  },

  loadAppliedJobs(): string[] {
    const data = localStorage.getItem(APPLIED_JOBS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveAppliedJobs(ids: string[]): void {
    localStorage.setItem(APPLIED_JOBS_KEY, JSON.stringify(ids));
  },
};
