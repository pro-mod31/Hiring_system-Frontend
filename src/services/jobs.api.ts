/**
 * Jobs API — /api/v1/job
 *
 * GET  /job/            PUBLIC        → all jobs; query: ?status=open&recruiterId=1
 * GET  /job/:id         PUBLIC        → by ID
 * GET  /job/my/jobs     recruiter     → own posted jobs
 * POST /job/            recruiter     → create job
 *   body (jobPositionValidator): { recruiterId, title, description, requirements, department, location, salaryRange, status? }
 *   NOTE: recruiterId is REQUIRED by the Joi validator even though the controller also reads it from JWT.
 *         Always send recruiterId in the body.
 * PUT  /job/:id         recruiter, admin → update job (same fields, all optional)
 * DELETE /job/:id       recruiter, admin → delete job
 */
import api, { unwrap } from "./api";

export interface Job {
  id: number;
  recruiterId: number;
  title: string;
  description: string;
  requirements: string;
  department: string;
  location: string;
  salaryRange: string;
  status: "open" | "closed";
  Recruiter?: { id: number; firstName: string; lastName: string; email: string };
}

/** Fields sent to create a job — recruiterId is NOT included, backend reads it from JWT */
export interface CreateJobPayload {
  title: string;
  description: string;
  requirements: string;
  department: string;
  location: string;
  salaryRange: string;
  status?: "open" | "closed";
}

// Public — no auth needed
export const getJobs = async (params?: { status?: string; recruiterId?: number }): Promise<Job[]> => {
  const res = await api.get("/job", { params });
  const raw = unwrap<Job[]>(res);
  return Array.isArray(raw) ? raw : [];
};

export const getJobById = async (id: number): Promise<Job> => {
  const res = await api.get(`/job/${id}`);
  return unwrap<Job>(res);
};

// Recruiter: own posted jobs
export const getMyJobs = async (): Promise<Job[]> => {
  const res = await api.get("/job/my/jobs");
  const raw = unwrap<Job[]>(res);
  return Array.isArray(raw) ? raw : [];
};

// Recruiter: create job — recruiterId is set from JWT on the backend
export const createJob = async (data: CreateJobPayload): Promise<Job> => {
  const res = await api.post("/job", data);
  return unwrap<Job>(res);
};

// Recruiter / Admin: update job
export const updateJob = async (id: number, data: Partial<Omit<CreateJobPayload, "recruiterId">>): Promise<void> => {
  await api.put(`/job/${id}`, data);
};

// Recruiter / Admin: delete job
export const deleteJob = async (id: number): Promise<void> => {
  await api.delete(`/job/${id}`);
};
