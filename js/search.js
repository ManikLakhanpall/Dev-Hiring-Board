function searchJobs(jobsToSearch) {

    if (!filters.search.trim()) {
        return jobsToSearch;
    }

    const keyword = filters.search.toLowerCase();

    return jobsToSearch.filter(job => {

        const title = (job.position || "").toLowerCase();

        return (
            title.includes(keyword)
        );
    });
}

function stripHtml(html) {

    const temp = document.createElement("div");

    temp.innerHTML = html;

    return temp.textContent || temp.innerText || "";

}

