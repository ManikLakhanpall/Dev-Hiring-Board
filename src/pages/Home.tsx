import JobCard from "../components/JobCard";
import { useJobs } from "../context/JobsContext";

export default function Home() {
  const { jobs, loading, error } = useJobs();

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading jobs...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  if (jobs.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No jobs found matching your search.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 max-w-screen">
      <div className="mx-auto max-w-6xl p-6">
        <h1 className="mb-6 text-3xl font-bold">Remote Developer Jobs</h1>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </main>
  );
}