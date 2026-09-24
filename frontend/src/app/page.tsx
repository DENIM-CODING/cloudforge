"use client";

import { FormEvent, useEffect, useState } from "react";
import { useDeployments } from "../hooks/useDeployments";
import { useProjects } from "../hooks/useProjects";

export default function Home() {
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    fetchProjects,
    createProject,
  } = useProjects();

  const {
    deployments,
    setDeployments,
    fetchDeployments,
    pollDeployment,
    createDeployment,
    stopDeployment,
    loading: deploymentsLoading,
    error: deploymentsError,
  } = useDeployments();

  const [name, setName] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");

  const [selectedProjectId, setSelectedProjectId] =
    useState<number | null>(null);

  const [commitHashes, setCommitHashes] =
    useState<Record<number, string>>({});

  const [deploymentError, setDeploymentError] =
    useState("");

  const [deployingProjectId, setDeployingProjectId] =
    useState<number | null>(null);

  const getDeploymentStatusClass = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "text-green-400";

      case "BUILDING":
        return "text-yellow-400";

      case "PENDING":
        return "text-blue-400";

      case "FAILED":
        return "text-red-400";

      case "STOPPED":
        return "text-gray-400";

      default:
        return "text-gray-400";
    }
  };

  const handleViewDeployments = async (projectId: number) => {
    setSelectedProjectId(projectId);
    await fetchDeployments(projectId);
  };

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await createProject(name, repositoryUrl);

      setName("");
      setRepositoryUrl("");

      await fetchProjects();
    } catch {
      // Error is already stored in useProjects
    }
  };

  const handleDeploy = async (projectId: number) => {
    setDeploymentError("");
    setDeployingProjectId(projectId);

    const commitHash = commitHashes[projectId];

    try {
      const deployment = await createDeployment(
        projectId,
        commitHash
      );

      setCommitHashes((current) => ({
        ...current,
        [projectId]: "",
      }));

      await fetchDeployments(projectId);

      pollDeployment(deployment.id);
    } catch (error) {
      setDeploymentError(
        error instanceof Error
          ? error.message
          : "Failed to create deployment"
      );
    } finally {
      setDeployingProjectId(null);
    }
  };

  const handleStopDeployment = async (
    deploymentId: number
  ) => {
    setDeploymentError("");

    try {
      const deployment = await stopDeployment(
        deploymentId
      );

      setDeployments((current) =>
        current.map((item) =>
          item.id === deployment.id
            ? deployment
            : item
        )
      );
    } catch (error) {
      setDeploymentError(
        error instanceof Error
          ? error.message
          : "Failed to stop deployment"
      );
    }
  };

  return (
    <main>
      <h1>CloudForge</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
        />

        <input
          type="text"
          placeholder="Repository URL"
          value={repositoryUrl}
          onChange={(event) =>
            setRepositoryUrl(event.target.value)
          }
        />

        <button type="submit">
          Create Project
        </button>
      </form>

      {projectsError && (
        <p>{projectsError}</p>
      )}

      <section>
        <h2>Projects</h2>

        {projectsLoading && (
          <p>Loading projects...</p>
        )}

        {projects.map((project) => (
          <div key={project.id}>
            <h3>{project.name}</h3>

            <p>{project.repositoryUrl}</p>

            <p>
              Status: {project.status}
            </p>

            <p>
              Created:{" "}
              {new Date(
                project.createdAt
              ).toLocaleString()}
            </p>

            <button
              onClick={() =>
                handleViewDeployments(project.id)
              }
            >
              View Deployments
            </button>

            <div>
              <input
                type="text"
                placeholder="Commit hash"
                value={
                  commitHashes[project.id] || ""
                }
                onChange={(event) =>
                  setCommitHashes((current) => ({
                    ...current,
                    [project.id]:
                      event.target.value,
                  }))
                }
              />

              <button
                onClick={() =>
                  handleDeploy(project.id)
                }
                disabled={
                  deployingProjectId ===
                    project.id ||
                  !(commitHashes[
                    project.id
                  ] || "").trim()
                }
              >
                {deployingProjectId ===
                project.id
                  ? "Deploying..."
                  : "Deploy"}
              </button>
            </div>
          </div>
        ))}
      </section>

      {selectedProjectId !== null && (
        <section>
          <h2>
            Deployments{" "}
            {selectedProject &&
              ` — ${selectedProject.name}`}
          </h2>

          {deploymentsLoading && (
            <p>Loading deployments...</p>
          )}

          {deploymentsError && (
            <p>{deploymentsError}</p>
          )}

          {!deploymentsLoading &&
            deployments.length === 0 && (
              <p>No deployments yet.</p>
            )}

          {deployments.map((deployment) => (
            <div key={deployment.id}>
              <p>
                Commit:{" "}
                {deployment.commitHash}
              </p>

              <p>
                Status:{" "}
                <span
                  className={getDeploymentStatusClass(
                    deployment.status
                  )}
                >
                  {deployment.status}
                </span>
              </p>

              {deployment.hostPort && (
                <p>
                  Host Port:{" "}
                  {deployment.hostPort}
                </p>
              )}

              {deployment.imageName && (
                <p>
                  Image:{" "}
                  {deployment.imageName}
                </p>
              )}

              {deployment.containerName && (
                <p>
                  Container:{" "}
                  {deployment.containerName}
                </p>
              )}

              <p>
                Created:{" "}
                {new Date(
                  deployment.createdAt
                ).toLocaleString()}
              </p>

              {deployment.status ===
                "SUCCESS" &&
                deployment.hostPort && (
                  <button
                    onClick={() =>
                      window.open(
                        `http://localhost:${deployment.hostPort}`,
                        "_blank"
                      )
                    }
                  >
                    Open Application
                  </button>
                )}

              {deployment.status ===
                "SUCCESS" && (
                  <button
                    onClick={() =>
                      handleStopDeployment(
                        deployment.id
                      )
                    }
                  >
                    Stop Deployment
                  </button>
                )}
            </div>
          ))}
        </section>
      )}

      {deploymentError && (
        <p>{deploymentError}</p>
      )}
    </main>
  );
}