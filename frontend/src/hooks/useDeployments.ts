import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../lib/api";

export type Deployment = {
  id: number;
  projectId: number;
  commitHash: string;
  status: string;
  hostPort: number | null;
  imageName: string | null;
  containerName: string | null;
  createdAt: string;
};



export const useDeployments = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDeployment = async (deploymentId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/deployments/${deploymentId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch deployment");
    }

    return await response.json();
  };

  const fetchDeployments = async (projectId: number) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/deployments/project/${projectId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch deployments");
      }

      const data = await response.json();

      setDeployments(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch deployments"
      );
    } finally {
      setLoading(false);
    }
  };

  const pollDeployment = async (deploymentId: number) => {
    try {
      const deployment = await fetchDeployment(deploymentId);

      setDeployments((current) =>
        current.map((item) =>
          item.id === deployment.id ? deployment : item
        )
      );

      if (
        deployment.status === "PENDING" ||
        deployment.status === "BUILDING"
      ) {
        pollTimeoutRef.current = setTimeout(() => {
          pollDeployment(deploymentId);
        }, 2000);
      } else {
        pollTimeoutRef.current = null;
      }
    } catch (error) {
      console.error("Polling deployment failed:", error);
      pollTimeoutRef.current = null;
    }
  };

  const createDeployment = async (
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

      return await response.json();
    };

    const stopDeployment = async (deploymentId: number) => {
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

      return await response.json();
    };


 useEffect(() => {
    return () => {
        if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
        }
    };
 }, []);

  return {
    deployments,
    setDeployments,
    fetchDeployment,
    fetchDeployments,
    pollDeployment,
    createDeployment,
    stopDeployment,
    loading,
    error,
  };
};