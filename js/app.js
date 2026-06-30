const Controller = {
  async init() {
    try {
      const jobs = await JobService.fetchJobs();
      Model.setJobs(jobs);
      this.render();
      this.setupEventListeners();
      View.setupTabs(this.handleTabChange.bind(this));
    } catch (error) {
      console.error("Failed to initialize app:", error);
    }
  },

  setupEventListeners() {
    const searchInput = document.getElementById("search-input");
    const clearButton = document.getElementById("clear-filters");

    searchInput.addEventListener("input", (e) => {
      this.handleSearchChange(e.target.value);
    });

    clearButton?.addEventListener("click", () => {
      this.handleSearchChange("");
      Model.setTagFilters([]);
      Model.setCurrentTab("all");
      this.render();
    });
  },

  handleSearchChange(value) {
    Model.setSearch(value);
    this.render();
  },

  handleTagChange(selectedTags) {
    Model.setTagFilters(selectedTags);
    this.render();
  },

  handleTabChange(tab) {
    Model.setCurrentTab(tab);
    this.render();
  },

  handleSaveJob(jobId) {
    Model.toggleSavedJob(jobId);
    this.render();
  },

  handleApplyJob(jobId) {
    Model.toggleAppliedJob(jobId);
    this.render();
  },

  render() {
    const currentState = Model.getState();
    const visibleJobs = Model.getVisibleJobs();

    View.renderJobs(visibleJobs, currentState.savedJobs, currentState.appliedJobs, {
      onSave: this.handleSaveJob.bind(this),
      onApply: this.handleApplyJob.bind(this),
    });

    View.renderTagFilters(
      Model.getTagOptions(),
      currentState.filters.tags,
      this.handleTagChange.bind(this),
    );

    View.updateActiveTab(currentState.currentTab);
  },
};

window.Controller = Controller;
Controller.init();
