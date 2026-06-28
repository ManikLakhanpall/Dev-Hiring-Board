let jobs = [];

let filters = {
    search: "",
    tags: [],
    remote: "all",
    sort: "date"
};

let savedJobs = [];
let appliedJobs = [];

function updateJobs() {
  let filteredJobs = [...jobs];

  filteredJobs = searchJobs(filteredJobs);

  renderJobs(filteredJobs);
}

function setupEventListeners() {

    const searchInput = document.getElementById("search-input");

    searchInput.addEventListener("input", e => {

        filters.search = e.target.value;

        updateJobs();
    });

}

async function init() {
  await fetchJobs();
  setupEventListeners();
  updateJobs();
}

init();
