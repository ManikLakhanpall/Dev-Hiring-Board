const SAVED_JOBS_KEY = "savedJobs";
const APPLIED_JOBS_KEY = "appliedJobs";

function loadSavedJobs() {
  return JSON.parse(localStorage.getItem(SAVED_JOBS_KEY)) || [];
}

function saveSavedJobs(ids) {
  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(ids));
}

function loadAppliedJobs() {
  return JSON.parse(localStorage.getItem(APPLIED_JOBS_KEY)) || [];
}

function saveAppliedJobs(ids) {
  localStorage.setItem(APPLIED_JOBS_KEY, JSON.stringify(ids));
}
