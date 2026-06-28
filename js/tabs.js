function filterSavedJobs(jobsToFilter) {
  if (currentTab !== "saved") {
    return jobsToFilter;
  }

  return jobsToFilter.filter((job) => savedJobs.includes(job.id));
}

function filterAppliedJobs(jobsToFilter) {
  if (currentTab !== "applied") {
    return jobsToFilter;
  }

  return jobsToFilter.filter((job) => appliedJobs.includes(job.id));
}

function setupTabs() {
  const buttons = document.querySelectorAll("#tabs button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      currentTab = button.dataset.tab;

      buttons.forEach((btn) => btn.classList.remove("active-tab"));
      button.classList.add("active-tab");

      updateJobs();
    });
  });
}
