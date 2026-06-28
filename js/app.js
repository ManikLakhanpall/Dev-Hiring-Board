let jobs = [];

let filters = {
    search: "",
    tags: [],
    remote: "all",
    sort: "date"
};

let savedJobs = [];
let appliedJobs = [];

async function init() {
  await fetchJobs();

  renderTagFilters()

  setupEventListeners();

  updateJobs();
}

function updateJobs() {
  let filteredJobs = [...jobs];

  filteredJobs = searchJobs(filteredJobs);

  filteredJobs = filterJobs(filteredJobs)

  renderJobs(filteredJobs);
}

function setupEventListeners() {

    const searchInput = document.getElementById("search-input");

    searchInput.addEventListener("input", e => {

        filters.search = e.target.value;

        updateJobs();
    });

}

init();
