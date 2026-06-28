const SAVED_JOBS_KEY = "savedJobs";
const APPLIED_JOBS_KEY = "appliedJobs";

function loadSavedJobs() {
    return JSON.parse(localStorage.getItem(SAVED_JOBS_KEY)) || [];
}

function saveSavedJobs() {
    localStorage.setItem(
        SAVED_JOBS_KEY,
        JSON.stringify(savedJobs)
    );
}