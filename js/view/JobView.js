// ─── View Layer: Job View ─────────────────────────────────────────────────────
// Responsible for rendering job cards into the DOM.
// Has no knowledge of application state — it only receives data and callbacks.

// ── Private helpers ────────────────────────────────────────────────────────

function _formatSalary(job) {
  const min = job.salary_min;
  const max = job.salary_max;
  if (min && max && (min > 0 || max > 0)) {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  }
  return "Salary not specified";
}

function _formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr; // already relative or weird format
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function _createJobCard(job, savedJobs = [], appliedJobs = [], handlers = {}) {
  const card = document.createElement("div");
  card.className = "job-card";

  const salary = _formatSalary(job);

  card.innerHTML = `
    <div class="card-content">
      <h2 class="job-title">${job.position}</h2>
      <p class="job-company"><strong>${job.company}</strong></p>
      <div class="job-meta">
        <span class="job-location">${job.location || "Remote"}</span>
        <span class="job-salary">${salary}</span>
      </div>
      <div class="tags"></div>
    </div>

    <button class="details-btn">View Details</button>

    <div class="card-actions"></div>
  `;

  // Render tag badges
  const tagsContainer = card.querySelector(".tags");
  (job.tags || []).forEach((tag) => {
    const badge = document.createElement("span");
    badge.className = "tag";
    badge.textContent = tag;
    tagsContainer.appendChild(badge);
  });

  // Action buttons — appended to the footer container so we can pin them at bottom
  const cardActions = card.querySelector(".card-actions");

  const saveButton = document.createElement("button");
  saveButton.className = "save-btn";
  saveButton.textContent = savedJobs.includes(job.id) ? "Saved" : "Save";
  cardActions.appendChild(saveButton);

  const applyButton = document.createElement("button");
  applyButton.className = "apply-btn";
  applyButton.textContent = appliedJobs.includes(job.id) ? "Applied" : "Mark Applied";
  cardActions.appendChild(applyButton);

  // Event listeners
  card.querySelector(".details-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    handlers.onViewDetails?.(job);
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

// ── Modal implementation (private) ─────────────────────────────────────────

let _currentEscapeHandler = null;

function _closeModal() {
  const modal = document.getElementById("job-modal");
  if (!modal) return;

  modal.classList.add("hidden");

  // Cleanup escape listener
  if (_currentEscapeHandler) {
    document.removeEventListener("keydown", _currentEscapeHandler);
    _currentEscapeHandler = null;
  }
}

function _updateActionButtons(savedJobs = [], appliedJobs = []) {
  const modal = document.getElementById("job-modal");
  if (!modal || modal.classList.contains("hidden")) return;

  const saveBtn = document.getElementById("modal-save-btn");
  const applyBtn = document.getElementById("modal-apply-btn");

  const jobId = saveBtn?.dataset.jobId;
  if (!jobId) return;

  const isSaved = savedJobs.some((id) => String(id) === jobId);
  const isApplied = appliedJobs.some((id) => String(id) === jobId);

  if (saveBtn) {
    saveBtn.textContent = isSaved ? "Saved" : "Save";
  }
  if (applyBtn) {
    applyBtn.textContent = isApplied ? "Applied" : "Mark Applied";
  }
}

function _showJobModal(job, savedJobs = [], appliedJobs = [], handlers = {}) {
  const modal = document.getElementById("job-modal");
  if (!modal) {
    console.warn("Modal element #job-modal not found in DOM");
    return;
  }

  // Populate content
  const logoEl = document.getElementById("modal-logo");
  const logoSrc = job.company_logo || job.logo || "";
  if (logoEl) {
    if (logoSrc) {
      logoEl.src = logoSrc;
      logoEl.alt = `${job.company || "Company"} logo`;
      logoEl.classList.remove("hidden");
    } else {
      logoEl.classList.add("hidden");
      logoEl.removeAttribute("src");
    }
  }

  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text || "";
  };

  setText("modal-position", job.position);
  setText("modal-company-name", job.company);

  setText("modal-location", job.location || "Remote");
  setText("modal-salary", _formatSalary(job));
  setText("modal-date", _formatDate(job.date));

  // Tags
  const tagsContainer = document.getElementById("modal-tags");
  if (tagsContainer) {
    tagsContainer.innerHTML = "";
    (job.tags || []).forEach((tag) => {
      const badge = document.createElement("span");
      badge.className = "tag";
      badge.textContent = tag;
      tagsContainer.appendChild(badge);
    });
  }

  // Description
  const descEl = document.getElementById("modal-description");
  if (descEl) {
    descEl.innerHTML = job.description || "<p>No description provided.</p>";
  }

  // Action buttons
  const saveBtn = document.getElementById("modal-save-btn");
  const applyBtn = document.getElementById("modal-apply-btn");
  const linkEl = document.getElementById("modal-external-link");

  const jobIdStr = String(job.id);
  const isSaved = savedJobs.some((id) => String(id) === jobIdStr);
  const isApplied = appliedJobs.some((id) => String(id) === jobIdStr);

  if (saveBtn) {
    saveBtn.dataset.jobId = jobIdStr;
    saveBtn.textContent = isSaved ? "Saved" : "Save";
    // Fresh listener
    saveBtn.onclick = (e) => {
      e.preventDefault();
      handlers.onSave?.(job.id);
      // Controller will call update after state change
    };
  }
  if (applyBtn) {
    applyBtn.dataset.jobId = jobIdStr;
    applyBtn.textContent = isApplied ? "Applied" : "Mark Applied";
    applyBtn.onclick = (e) => {
      e.preventDefault();
      handlers.onApply?.(job.id);
    };
  }

  // External link
  if (linkEl) {
    const external = job.apply_url || job.url;
    if (external) {
      linkEl.href = external;
      linkEl.style.display = "";
    } else {
      linkEl.style.display = "none";
    }
  }

  // Show modal
  modal.classList.remove("hidden");

  // Close handlers (fresh each time)
  const backdrop = modal.querySelector(".modal-backdrop");
  const closeBtn = modal.querySelector(".modal-close");

  if (backdrop) {
    // Remove previous if any (by replacing node is overkill) — use onclick for simplicity
    backdrop.onclick = () => _closeModal();
  }
  if (closeBtn) {
    closeBtn.onclick = () => _closeModal();
  }

  // Escape key
  if (_currentEscapeHandler) {
    document.removeEventListener("keydown", _currentEscapeHandler);
  }
  _currentEscapeHandler = (e) => {
    if (e.key === "Escape") {
      _closeModal();
    }
  };
  document.addEventListener("keydown", _currentEscapeHandler);

  // Optional: focus close button for a11y
  setTimeout(() => closeBtn && closeBtn.focus(), 50);
}

// ── Public API ─────────────────────────────────────────────────────────────

export const JobView = {
  /**
   * Renders a list of jobs into the #job-list container.
   * @param {Array}    jobsToRender
   * @param {string[]} savedJobs    - Array of saved job IDs
   * @param {string[]} appliedJobs  - Array of applied job IDs
   * @param {Object}   handlers     - { onSave, onApply, onViewDetails }
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

  /**
   * Opens the job detail modal.
   * @param {Object} job
   * @param {string[]} savedJobs
   * @param {string[]} appliedJobs
   * @param {Object} handlers - { onSave, onApply }
   */
  showJobModal(job, savedJobs = [], appliedJobs = [], handlers = {}) {
    _showJobModal(job, savedJobs, appliedJobs, handlers);
  },

  /**
   * Updates the Save / Apply button labels inside an open modal.
   * Safe to call even if modal is closed.
   */
  updateModalActionButtons(savedJobs = [], appliedJobs = []) {
    _updateActionButtons(savedJobs, appliedJobs);
  },
};
