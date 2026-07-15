import JobCard from "../components/JobCard";
import { useJobs } from "../context/JobsContext";

export default function Applied() {
  const { jobs, loading, appliedJobIds } = useJobs();

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading applied jobs...</p>
      </main>
    );
  }

  const appliedJobsList = jobs.filter((job) => {
    const isApplied = appliedJobIds.includes(job.id);
    
    return isApplied;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-6">
        <h1 className="mb-6 text-3xl font-bold">Applied Jobs</h1>

        {appliedJobsList.length === 0 ? (
          <p className="text-gray-500">No applied jobs found.</p>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appliedJobsList.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
