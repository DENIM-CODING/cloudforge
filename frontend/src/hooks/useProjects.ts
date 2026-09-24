import { useState } from "react";
import {
  fetchProjects as fetchProjectsApi,
  createProject as createProjectApi,
} from "../services/projectService";

export type Project = {
  id: number;
  name: string;
  repositoryUrl: string;
  createdAt: string;
  status: string;
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchProjectsApi();

      setProjects(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch projects"
      );
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (
    name: string,
    repositoryUrl: string
  ) => {
    setError("");

    try {
      const project = await createProjectApi(
        name,
        repositoryUrl
      );

      return project;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create project";

      setError(message);

      throw error;
    }
  };

  return {
    projects,
    setProjects,
    loading,
    error,
    fetchProjects,
    createProject,
  };
};