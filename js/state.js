let jobs = [];

let filters = {
  search: "",
  tags: [],
  remote: "all",
  sort: "date",
};

let savedJobs = loadSavedJobs();
let appliedJobs = loadAppliedJobs();
let currentTab = "all";
