// ─── View Layer: Job View ─────────────────────────────────────────────────────
// Responsible for rendering job cards into the DOM.
// Has no knowledge of application state — it only receives data and callbacks.

import { Job, JobHandlers } from "../types";
import { clearElement, stripHtml } from "../services/utils";

// ── Private helpers ────────────────────────────────────────────────────────


function _formatSalary(job: Job): string {
  const min = job.salary_min;
  const max = job.salary_max;
  if (min && max && (min > 0 || max > 0)) {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  }
  return "Salary not specified";
}

function _formatDate(dateStr?: string): string {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr; // already relative or weird format
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function _createJobCard(
  job: Job,
  savedJobs: string[] = [],
  appliedJobs: string[] = [],
  handlers: JobHandlers = {}
): HTMLElement {
  const card = document.createElement("div");
  card.className = "job-card";

  const salary = _formatSalary(job);

  // Build card structure using DOM methods (no innerHTML for security & cleanliness)
  const cardContent = document.createElement("div");
  cardContent.className = "card-content";

  // Title (clamped in CSS)
  const titleEl = document.createElement("h2");
  titleEl.className = "job-title";
  titleEl.textContent = job.position || "";
  cardContent.appendChild(titleEl);

  // Company
  const companyEl = document.createElement("p");
  companyEl.className = "job-company";
  const companyStrong = document.createElement("strong");
  companyStrong.textContent = job.company || "";
  companyEl.appendChild(companyStrong);
  cardContent.appendChild(companyEl);

  // Meta (location + salary)
  const metaEl = document.createElement("div");
  metaEl.className = "job-meta";

  const locationEl = document.createElement("span");
  locationEl.className = "job-location";
  locationEl.textContent = job.location || "Remote";
  metaEl.appendChild(locationEl);

  const salaryEl = document.createElement("span");
  salaryEl.className = "job-salary";
  salaryEl.textContent = salary;
  metaEl.appendChild(salaryEl);

  cardContent.appendChild(metaEl);
  card.appendChild(cardContent);

  // Tags container
  const tagsContainer = document.createElement("div");
  tagsContainer.className = "tags";

  // Render limited tag badges
  const allTags = job.tags || [];
  const maxPreviewTags = 6;
  allTags.slice(0, maxPreviewTags).forEach((tag) => {
    const badge = document.createElement("span");
    badge.className = "tag";
    badge.textContent = tag;
    tagsContainer.appendChild(badge);
  });

  if (allTags.length > maxPreviewTags) {
    const more = document.createElement("span");
    more.className = "tag more";
    more.textContent = `+${allTags.length - maxPreviewTags}`;
    tagsContainer.appendChild(more);
  }

  card.appendChild(tagsContainer);

  // Details button
  const detailsBtn = document.createElement("button");
  detailsBtn.className = "details-btn";
  detailsBtn.textContent = "View Details";
  detailsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    handlers.onViewDetails?.(job);
  });
  card.appendChild(detailsBtn);

  // Actions footer
  const cardActions = document.createElement("div");
  cardActions.className = "card-actions";

  const saveButton = document.createElement("button");
  saveButton.className = "save-btn";
  saveButton.textContent = savedJobs.includes(String(job.id)) ? "Saved" : "Save";
  saveButton.addEventListener("click", (e) => {
    e.stopPropagation();
    handlers.onSave?.(job.id);
  });
  cardActions.appendChild(saveButton);

  const applyButton = document.createElement("button");
  applyButton.className = "apply-btn";
  applyButton.textContent = appliedJobs.includes(String(job.id)) ? "Applied" : "Mark Applied";
  applyButton.addEventListener("click", (e) => {
    e.stopPropagation();
    handlers.onApply?.(job.id);
  });
  cardActions.appendChild(applyButton);

  card.appendChild(cardActions);

  return card;
}

// ── Modal implementation (private) ─────────────────────────────────────────

let _currentEscapeHandler: ((e: KeyboardEvent) => void) | null = null;

function _closeModal(): void {
  const modal = document.getElementById("job-modal");
  if (!modal) return;

  modal.classList.add("hidden");
  document.body.classList.remove("modal-open");

  // Cleanup escape listener
  if (_currentEscapeHandler) {
    document.removeEventListener("keydown", _currentEscapeHandler);
    _currentEscapeHandler = null;
  }
}

function _updateActionButtons(savedJobs: string[] = [], appliedJobs: string[] = []): void {
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

function _showJobModal(
  job: Job,
  savedJobs: string[] = [],
  appliedJobs: string[] = [],
  handlers: JobHandlers = {}
): void {
  const modal = document.getElementById("job-modal");
  if (!modal) {
    console.warn("Modal element #job-modal not found in DOM");
    return;
  }

  // Populate content
  const logoEl = document.getElementById("modal-logo") as HTMLImageElement | null;
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

  const setText = (id: string, text?: string) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text || "";
  };

  setText("modal-position", job.position);
  setText("modal-company-name", job.company);

  setText("modal-location", job.location || "Remote");
  setText("modal-salary", _formatSalary(job));
  setText("modal-date", _formatDate(job.date));

  // Tags (modal shows all)
  const tagsContainer = document.getElementById("modal-tags");
  if (tagsContainer) {
    clearElement(tagsContainer);
    (job.tags || []).forEach((tag) => {
      const badge = document.createElement("span");
      badge.className = "tag";
      badge.textContent = tag;
      tagsContainer.appendChild(badge);
    });
  }

  // Description — stripHtml removes all tags so no inline event handlers can
  // execute when the content enters the live DOM (Finding 1 from code review).
  const descEl = document.getElementById("modal-description");
  if (descEl) {
    descEl.textContent = stripHtml(job.description || "No description provided.");
  }

  // Action buttons
  const saveBtn = document.getElementById("modal-save-btn");
  const applyBtn = document.getElementById("modal-apply-btn");
  const linkEl = document.getElementById("modal-external-link") as HTMLAnchorElement | null;

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

  // Show modal + lock background scroll
  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");

  // Close handlers (fresh each time)
  const backdrop = modal.querySelector<HTMLElement>(".modal-backdrop");
  const closeBtn = modal.querySelector<HTMLElement>(".modal-close");

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
  _currentEscapeHandler = (e: KeyboardEvent) => {
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
   * @param {Job[]}    jobsToRender
   * @param {string[]} savedJobs    - Array of saved job IDs
   * @param {string[]} appliedJobs  - Array of applied job IDs
   * @param {JobHandlers}   handlers     - { onSave, onApply, onViewDetails }
   */
  renderJobs(
    jobsToRender: Job[],
    savedJobs: string[] = [],
    appliedJobs: string[] = [],
    handlers: JobHandlers = {}
  ): void {
    const jobList = document.getElementById("job-list");
    if (!jobList) return;
    
    clearElement(jobList);

    if (jobsToRender.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state";

      const h2 = document.createElement("h2");
      h2.textContent = "No jobs found";
      empty.appendChild(h2);

      const p = document.createElement("p");
      p.textContent = "Try changing filters.";
      empty.appendChild(p);

      jobList.appendChild(empty);
      return;
    }

    jobsToRender.forEach((job) => {
      const card = _createJobCard(job, savedJobs, appliedJobs, handlers);
      jobList.appendChild(card);
    });
  },

  /**
   * Opens the job detail modal.
   * @param {Job} job
   * @param {string[]} savedJobs
   * @param {string[]} appliedJobs
   * @param {JobHandlers} handlers - { onSave, onApply }
   */
  showJobModal(
    job: Job,
    savedJobs: string[] = [],
    appliedJobs: string[] = [],
    handlers: JobHandlers = {}
  ): void {
    _showJobModal(job, savedJobs, appliedJobs, handlers);
  },

  /**
   * Updates the Save / Apply button labels inside an open modal.
   * Safe to call even if modal is closed.
   */
  updateModalActionButtons(savedJobs: string[] = [], appliedJobs: string[] = []): void {
    _updateActionButtons(savedJobs, appliedJobs);
  },
};
