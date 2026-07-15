export interface Job {
  id: string | number;
  position: string;
  company: string;
  company_logo?: string;
  logo?: string;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  tags?: string[];
  description?: string;
  date?: string;
  url?: string;
  apply_url?: string;
}

export interface FilterState {
  search: string;
  tags: string[];
}



export interface JobModelState {
  jobs: Job[];
  tagOptions: string[];
  filters: FilterState;
  savedJobs: string[];
  appliedJobs: string[];
  currentTab: string;
}

export interface JobHandlers {
  onSave?: (jobId: string | number) => void;
  onApply?: (jobId: string | number) => void;
  onViewDetails?: (job: Job) => void;
}
