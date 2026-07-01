// ─── Model Layer: Storage Service ────────────────────────────────────────────
// Handles all localStorage read/write operations for persisted job state.

const SAVED_JOBS_KEY = "savedJobs";
const APPLIED_JOBS_KEY = "appliedJobs";

export const StorageService = {
  loadSavedJobs() {
    return JSON.parse(localStorage.getItem(SAVED_JOBS_KEY)) || [];
  },

  saveSavedJobs(ids) {
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(ids));
  },

  loadAppliedJobs() {
    return JSON.parse(localStorage.getItem(APPLIED_JOBS_KEY)) || [];
  },

  saveAppliedJobs(ids) {
    localStorage.setItem(APPLIED_JOBS_KEY, JSON.stringify(ids));
  },
};
