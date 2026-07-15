import axios from "axios";
import type { Job } from "../types";
import { getUniqueTags } from "../utils/filters";

const URL = "https://remoteok.com/api";

export async function fetchJobs() {
  try {
    const res = await axios.get(URL);

    // * 1. Filtering requests that have the jobID
    const jobs = res.data.filter((job: Job) => job.id);
    
    // * 2. Extract unique tags
    const tags = getUniqueTags(jobs);

    return { jobs, tags };
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    throw error;
  }
}