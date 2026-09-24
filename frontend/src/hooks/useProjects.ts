import { useState } from "react";
import { API_BASE_URL } from "../lib/api";

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
      const response = await fetch(
        "http://localhost:8080/api/projects"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();

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
            const response = await fetch(
            `${API_BASE_URL}/projects`,
            {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                name,
                repositoryUrl,
                }),
            }
            );

            if (!response.ok) {
            const data = await response.json();

            throw new Error(
                data.message || "Failed to create project"
            );
            }

            return await response.json();
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