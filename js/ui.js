function renderJobs(jobs) {
  const jobList = document.getElementById("job-list");

  jobList.innerHTML = "";

  if (jobs.length === 0) {
    jobList.innerHTML = `
            <div class="empty-state">
                <h2>No jobs found</h2>
                <p>Try changing filters.</p>
            </div>
        `;

    return;
  }

  jobs.forEach((job) => {
    const card = createJobCard(job);
    jobList.appendChild(card);
  });
}

function createJobCard(job) {
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

        <button class="details-btn">
            View Details
        </button>
    `;

  const tagsContainer = card.querySelector(".tags");

  job.tags.forEach((tag) => {
    const badge = document.createElement("span");

    badge.className = "tag";

    badge.textContent = tag;

    tagsContainer.appendChild(badge);
  });

  const description = document.createElement("div");

  description.className = "description hidden";
  description.innerHTML = job.description;

  card.appendChild(description);

  const button = card.querySelector(".details-btn");

  const saveButton = document.createElement("button");
  saveButton.textContent = savedJobs.includes(job.id) ? "Saved" : "Save Now!";
  card.appendChild(saveButton);

  saveButton.addEventListener("click", (e) => {
    e.stopPropagation();
    if (savedJobs.includes(job.id)) {
        savedJobs = savedJobs.filter(id => id !== job.id);
    } else {
        savedJobs.push(job.id);
    }
    saveSavedJobs();
    updateJobs();
});

  button.addEventListener("click", () => {
    description.classList.toggle("hidden");
  });

  return card;
}
