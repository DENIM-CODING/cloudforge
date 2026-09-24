import { API_BASE_URL } from "../lib/api";

export const fetchDeployment = async (
  deploymentId: number
) => {
  const response = await fetch(
    `${API_BASE_URL}/deployments/${deploymentId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch deployment");
  }

  return response.json();
};

export const fetchDeployments = async (
  projectId: number
) => {
  const response = await fetch(
    `${API_BASE_URL}/deployments/project/${projectId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch deployments");
  }

  return response.json();
};

export const createDeployment = async (
  projectId: number,
  commitHash: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/deployments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId,
        commitHash,
      }),
    }
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.message || "Failed to create deployment"
    );
  }

  return response.json();
};

export const stopDeployment = async (
  deploymentId: number
) => {
  const response = await fetch(
    `${API_BASE_URL}/deployments/${deploymentId}/stop`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.message || "Failed to stop deployment"
    );
  }

  return response.json();
};