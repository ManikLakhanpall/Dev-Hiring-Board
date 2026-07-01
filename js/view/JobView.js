// ─── View Layer: Job View ─────────────────────────────────────────────────────
// Responsible for rendering job cards into the DOM.
// Has no knowledge of application state — it only receives data and callbacks.

// ── Private helper ─────────────────────────────────────────────────────────

function _createJobCard(job, savedJobs = [], appliedJobs = [], handlers = {}) {
  const card = document.createElement("div");
  card.className = "job-card";

  const salary =
    job.salary_min && job.salary_max
      ? `$${job.salary_min} - $${job.salary_max}`
      : "Salary not specified";

  card.innerHTML = `
    <h2>${job.position}</h2>
    <p><strong>${job.company}</strong></p>
    <p>${job.location || "Remote"}</p>
    <p>${salary}</p>
    <div class="tags"></div>
    <button class="details-btn">View Details</button>
  `;

  // Render tag badges
  const tagsContainer = card.querySelector(".tags");
  (job.tags || []).forEach((tag) => {
    const badge = document.createElement("span");
    badge.className = "tag";
    badge.textContent = tag;
    tagsContainer.appendChild(badge);
  });

  // Job description (collapsed by default)
  const description = document.createElement("div");
  description.className = "description hidden";
  description.innerHTML = job.description;
  card.appendChild(description);

  // Action buttons
  const saveButton = document.createElement("button");
  saveButton.className = "save-btn";
  saveButton.textContent = savedJobs.includes(job.id) ? "Saved" : "Save";
  card.appendChild(saveButton);

  const applyButton = document.createElement("button");
  applyButton.className = "apply-btn";
  applyButton.textContent = appliedJobs.includes(job.id) ? "Applied" : "Mark Applied";
  card.appendChild(applyButton);

  // Event listeners
  card.querySelector(".details-btn").addEventListener("click", () => {
    description.classList.toggle("hidden");
  });

  saveButton.addEventListener("click", (e) => {
    e.stopPropagation();
    handlers.onSave?.(job.id);
  });

  applyButton.addEventListener("click", (e) => {
    e.stopPropagation();
    handlers.onApply?.(job.id);
  });

  return card;
}

// ── Public API ─────────────────────────────────────────────────────────────

export const JobView = {
  /**
   * Renders a list of jobs into the #job-list container.
   * @param {Array}    jobsToRender
   * @param {string[]} savedJobs    - Array of saved job IDs
   * @param {string[]} appliedJobs  - Array of applied job IDs
   * @param {Object}   handlers     - { onSave, onApply }
   */
  renderJobs(jobsToRender, savedJobs = [], appliedJobs = [], handlers = {}) {
    const jobList = document.getElementById("job-list");
    jobList.innerHTML = "";

    if (jobsToRender.length === 0) {
      jobList.innerHTML = `
        <div class="empty-state">
          <h2>No jobs found</h2>
          <p>Try changing filters.</p>
        </div>
      `;
      return;
    }

    jobsToRender.forEach((job) => {
      const card = _createJobCard(job, savedJobs, appliedJobs, handlers);
      jobList.appendChild(card);
    });
  },
};
