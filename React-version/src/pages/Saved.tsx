import JobCard from "../components/JobCard";
import SearchBar from "../components/SearchBar";
import { useJobs } from "../context/JobsContext";

export default function Saved() {
  const { jobs, loading, savedJobIds, searchQuery } = useJobs();

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading saved jobs...</p>
      </main>
    );
  }

  const savedJobsList = jobs.filter((job) => {
    const isSaved = savedJobIds.includes(job.id);
    return isSaved;
  });

  const filteredJobs = savedJobsList.filter((job) => {
    const q = searchQuery.toLowerCase();
    return (
      job.position.toLowerCase().includes(q) ||
      job.description.toLowerCase().includes(q)
    );
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Saved Jobs</h1>
          <SearchBar />
        </div>

        {filteredJobs.length === 0 ? (
          <p className="text-gray-500">No saved jobs found.</p>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
