let jobs = [];

async function init() {

    await fetchJobs();
    console.log("Jobs fetched:", jobs[0]);

}

init();