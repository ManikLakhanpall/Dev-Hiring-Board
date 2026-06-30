const API_URL = "https://remoteok.com/api";

const JobService = {
  async fetchJobs() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      return data.filter((job) => job.id);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      alert("Failed to fetch jobs. Please try again later.");
      throw error;
    }
  },
};
