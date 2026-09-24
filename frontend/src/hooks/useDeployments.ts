import { useEffect, useRef, useState } from "react";
import {
  fetchDeployment as fetchDeploymentApi,
  fetchDeployments as fetchDeploymentsApi,
  createDeployment as createDeploymentApi,
  stopDeployment as stopDeploymentApi,
} from "../services/deploymentService";
import {
  Deployment,
} from "../types/deployment";

export const useDeployments = () => {
  const [deployments, setDeployments] =
    useState<Deployment[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pollTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchDeployment = async (
    deploymentId: number
  ) => {
    return fetchDeploymentApi(deploymentId);
  };

  const fetchDeployments = async (
    projectId: number
  ) => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchDeploymentsApi(
        projectId
      );

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

  const createDeployment = async (
    projectId: number,
    commitHash: string
  ) => {
    try {
      return await createDeploymentApi(
        projectId,
        commitHash
      );
    } catch (error) {
      throw error;
    }
  };

  const stopDeployment = async (
    deploymentId: number
  ) => {
    try {
      return await stopDeploymentApi(
        deploymentId
      );
    } catch (error) {
      throw error;
    }
  };

  const pollDeployment = async (
    deploymentId: number
  ) => {
    try {
      const deployment =
        await fetchDeployment(deploymentId);

      setDeployments((current) =>
        current.map((item) =>
          item.id === deployment.id
            ? deployment
            : item
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
      console.error(
        "Polling deployment failed:",
        error
      );

      pollTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(
          pollTimeoutRef.current
        );
      }
    };
  }, []);

  return {
    deployments,
    setDeployments,
    fetchDeployment,
    fetchDeployments,
    createDeployment,
    stopDeployment,
    pollDeployment,
    loading,
    error,
  };
};