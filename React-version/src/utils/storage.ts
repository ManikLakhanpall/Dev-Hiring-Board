export function getSavedJobs(): number[] {
  return JSON.parse(
    localStorage.getItem("savedJobs") || "[]"
  );
}

export function setSavedJobs(ids: number[]) {
  localStorage.setItem("savedJobs", JSON.stringify(ids));
}

export function getAppliedJobs(): number[] {
  return JSON.parse(
    localStorage.getItem("appliedJobs") || "[]"
  );
}

export function setAppliedJobs(ids: number[]) {
  localStorage.setItem("appliedJobs", JSON.stringify(ids));
}