import type { Job } from "../types";

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h2 className="text-xl font-semibold">
        {job.position}
      </h2>

      <p className="text-gray-600">
        {job.company}
      </p>

      <p className="text-sm text-gray-500">
        {job.location}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {job.tags?.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs bg-gray-100 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}