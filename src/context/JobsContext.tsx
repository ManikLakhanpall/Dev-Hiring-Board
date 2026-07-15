import { createContext, useContext, useState, useEffect } from 'react';
import { fetchJobs } from '../api/jobs';
import type { Job } from '../types';
import type { ReactNode } from 'react';

interface JobsContextType {
  jobs: Job[];
  tags: string[];
  loading: boolean;
  error: string;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

  return (
    <JobsContext.Provider value={{ jobs, tags, loading, error }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
}
