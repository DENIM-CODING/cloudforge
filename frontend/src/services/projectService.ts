import { API_BASE_URL } from "../lib/api";

export const fetchProjects = async () => {
  const response = await fetch(
    `${API_BASE_URL}/projects`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
};

export const createProject = async (
  name: string,
  repositoryUrl: string
) => {
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

  return response.json();
};