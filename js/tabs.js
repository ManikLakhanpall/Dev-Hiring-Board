function filterSavedJobs(jobsToFilter) {
  if (currentTab !== "saved") {
    return jobsToFilter;
  }

  return jobsToFilter.filter((job) => savedJobs.includes(job.id));
}

function setupTabs() {
  const buttons = document.querySelectorAll("#tabs button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      currentTab = button.dataset.tab;
      updateJobs();
    });
  });
}
