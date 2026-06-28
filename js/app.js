let jobs = [];

async function init() {

    await fetchJobs();
    renderJobs(jobs)

}

init();