async function init() {
  await fetchJobs();

  renderTagFilters();
  setupEventListeners();
  setupTabs();
  updateJobs();
}

function updateJobs() {
  let filteredJobs = [...jobs];

  filteredJobs = searchJobs(filteredJobs);
  filteredJobs = filterJobs(filteredJobs);
  filteredJobs = filterSavedJobs(filteredJobs);
  filteredJobs = filterAppliedJobs(filteredJobs);

  renderJobs(filteredJobs);
}

function setupEventListeners() {
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("input", (e) => {
    filters.search = e.target.value;
    updateJobs();
  });
}

init();
