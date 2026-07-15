import { useState } from "react";
import type { Job } from "../types";
import { useJobs } from "../context/JobsContext";
import Modal from "./Modal";

export default function JobCard({ job }: { job: Job }) {
  const { savedJobIds, appliedJobIds, toggleSavedJob, toggleAppliedJob } = useJobs();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isSaved = savedJobIds.includes(job.id);
  const isApplied = appliedJobIds.includes(job.id);

  return (
    <>
      <div className="flex h-72 flex-col rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <h2 className="text-xl font-semibold line-clamp-2 shrink-0">
          {job.position}
        </h2>

        <p className="mt-2 text-gray-600 shrink-0">
          {job.company}
        </p>

        <p className="text-sm text-gray-500 shrink-0">
          {job.location}
        </p>

        <div className="mt-3 flex flex-wrap gap-2 flex-1 overflow-y-auto content-start pb-2">
          {job.tags?.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="rounded bg-gray-100 px-2 py-1 text-xs"
            >
              {tag}
            </span>
          ))}

          {job.tags && job.tags.length > 5 && (
            <span className="rounded bg-gray-100 px-2 py-1 text-xs">
              +{job.tags.length - 5}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            View Details
          </button>

          <button
            onClick={() => toggleSavedJob(job.id)}
            className={`px-3 py-1 rounded text-white transition-colors cursor-pointer ${
              isSaved
                ? "bg-gray-400 hover:bg-gray-500"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSaved ? "Remove Save" : "Save"}
          </button>

          <button
            onClick={() => toggleAppliedJob(job.id)}
            className={`px-3 py-1 rounded text-white transition-colors cursor-pointer ${
              isApplied
                ? "bg-gray-400 hover:bg-gray-500"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isApplied ? "Remove Apply" : "Apply"}
          </button>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={job.position}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
                <h3 className="font-semibold text-gray-800 text-lg">{job.company}</h3>
                <p className="text-gray-500">{job.location}</p>
            </div>
            
            <div className="flex gap-2">
                <button
                    onClick={() => toggleSavedJob(job.id)}
                    className={`px-3 py-1 rounded text-white transition-colors cursor-pointer ${
                    isSaved
                        ? "bg-gray-400 hover:bg-gray-500"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                >
                    {isSaved ? "Remove Save" : "Save"}
                </button>
                <button
                    onClick={() => toggleAppliedJob(job.id)}
                    className={`px-3 py-1 rounded text-white transition-colors cursor-pointer ${
                    isApplied
                        ? "bg-gray-400 hover:bg-gray-500"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                >
                    {isApplied ? "Remove Apply" : "Apply"}
                </button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Job Description</h3>
            <div 
              className="text-gray-700 space-y-3 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}