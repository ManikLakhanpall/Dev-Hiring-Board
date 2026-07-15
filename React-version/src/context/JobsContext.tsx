import { createContext, useContext, useState, useEffect } from "react";
import { fetchJobs } from "../api/jobs";
import {
  getSavedJobs,
  setSavedJobs,
  getAppliedJobs,
  setAppliedJobs,
} from "../utils/storage";
import type { Job } from "../types";
import type { ReactNode } from "react";

interface JobsContextType {
  jobs: Job[];
  tags: string[];
  loading: boolean;
  error: string;

  savedJobIds: number[];
  toggleSavedJob: (jobId: number) => void;

  appliedJobIds: number[];
  toggleAppliedJob: (jobId: number) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [savedJobIds, setSavedJobIdsState] = useState<number[]>([]);
  const [appliedJobIds, setAppliedJobIdsState] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // * 1. Initialize from local storage on mount
    setSavedJobIdsState(getSavedJobs());
    setAppliedJobIdsState(getAppliedJobs());

    async function loadJobs() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchJobs();
        setJobs(data.jobs);
        setTags(data.tags);
      } catch (err) {
        setError("Failed to load jobs. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  const toggleSavedJob = (jobId: number) => {
    let newSavedIds: number[];

    if (savedJobIds.includes(jobId)) {
      newSavedIds = savedJobIds.filter((id) => id !== jobId);
    } else {
      newSavedIds = [...savedJobIds, jobId];
    }

    setSavedJobIdsState(newSavedIds);
    setSavedJobs(newSavedIds); 
  };

  const toggleAppliedJob = (jobId: number) => {
    let newAppliedIds: number[];

    if (appliedJobIds.includes(jobId)) {
      newAppliedIds = appliedJobIds.filter((id) => id !== jobId);
    } else {
      newAppliedIds = [...appliedJobIds, jobId];
    }

    setAppliedJobIdsState(newAppliedIds);
    setAppliedJobs(newAppliedIds);
  };

  return (
    <JobsContext.Provider
      value={{
        jobs,
        tags,
        loading,
        error,
        savedJobIds,
        toggleSavedJob,
        appliedJobIds,
        toggleAppliedJob,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
}
