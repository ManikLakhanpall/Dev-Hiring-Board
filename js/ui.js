function renderJobs(jobs) {
    const jobList = document.getElementById("job-list");

    jobList.innerHTML = "";

    jobs.forEach((job) => {
        const card = createJobCard(job);
        jobList.appendChild(card);
    })
}

function createJobCard(job) {
    const card = document.createElement("div");
    card.className = "job-card";

    card.innerHTML = `
        <h2>${job.position}</h2>

        <p>${job.company}</p>

        <p>${job.location || "Remote"}</p>
    `;

    return card;
}
