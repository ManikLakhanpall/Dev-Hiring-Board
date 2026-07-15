import { useEffect, useRef } from "react";
import { useJobs } from "../context/JobsContext";

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useJobs();
  const searchBar = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchBar.current?.focus();
  }, [])

  return (
    <div className="relative w-full max-w-sm ml-6">
      <input
        type="text"
        placeholder="Search jobs by title or description..."
        value={searchQuery}
        ref={searchBar}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none 
        focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
      />
    </div>
  );
}