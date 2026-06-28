function getUniqueTags(jobs) {
  const uniqueTags = new Set();

  jobs.forEach((job) => {
    (job.tags || []).forEach((tag) => {
      uniqueTags.add(tag);
    });
  });

  return [...uniqueTags].sort();
}

function stripHtml(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}

function toggleItem(array, id) {
  if (array.includes(id)) {
    return array.filter((item) => item !== id);
  }

  return [...array, id];
}
