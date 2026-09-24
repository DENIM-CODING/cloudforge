"use client";

import { FormEvent, useEffect, useState } from "react";

type Project = {
  id: number;
  name: string;
  repositoryUrl: string;
  createdAt: string;
  status: string;
};

type Deployment = {
  id: number;
  projectId: number;
  commitHash: string;
  status: string;
  createdAt: string;
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [name, setName] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [error, setError] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [commitHashes, setCommitHashes] = useState<Record<number, string>>({});
  const [deploymentError, setDeploymentError] = useState("");
  const [deployingProjectId, setDeployingProjectId] = useState<number | null>(null);

  const fetchProjects = async () => {
    const response = await fetch("http://localhost:8080/api/projects");

    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }

    const data = await response.json();
    setProjects(data);
  };


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

  const fetchDeployment = async (deploymentId: number) => {
    const response = await fetch(
      `http://localhost:8080/api/deployments/${deploymentId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch deployment");
    }

    return response.json();
  };

  const pollDeployment = async (deploymentId: number) => {
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
      setTimeout(() => {
        pollDeployment(deploymentId);
      }, 2000);
    }
  };

  const fetchDeployments = async (projectId: number) => {
    setSelectedProjectId(projectId);

    const response = await fetch(
      `http://localhost:8080/api/deployments/project/${projectId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch deployments");
    }

    const data = await response.json();
    setDeployments(data);
  };

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const response = await fetch("http://localhost:8080/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        repositoryUrl,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.message || "Failed to create project");
      return;
    }

    setName("");
    setRepositoryUrl("");

    await fetchProjects();
  };

  const handleDeploy = async (projectId: number) => {
    setDeploymentError("");
    setDeployingProjectId(projectId);

    const commitHash = commitHashes[projectId];

    const response = await fetch("http://localhost:8080/api/deployments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId,
        commitHash,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      setDeploymentError(data.message || "Failed to create deployment");
      setDeployingProjectId(null);
      return;
    }

    const deployment = await response.json();

    setCommitHashes((current) => ({
      ...current,
      [projectId]: "",
    }));

    setDeployingProjectId(null);

    await fetchDeployments(projectId);

    pollDeployment(deployment.id);
  };

  return (
    <main>
      <h1>CloudForge</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <input
          type="text"
          placeholder="Repository URL"
          value={repositoryUrl}
          onChange={(event) => setRepositoryUrl(event.target.value)}
        />

        <button type="submit">Create Project</button>
      </form>

      {error && <p>{error}</p>}

      <section>
        <h2>Projects</h2>

        {projects.map((project) => (
          <div key={project.id}>
            <h3>{project.name}</h3>

            <p>{project.repositoryUrl}</p>

            <p>Status: {project.status}</p>

            <p>
              Created:{" "}
              {new Date(project.createdAt).toLocaleString()}
            </p>

            <button onClick={() => fetchDeployments(project.id)}>
              View Deployments
            </button>

            <div>
              <input
                type="text"
                placeholder="Commit hash"
                value={commitHashes[project.id] || ""}
                onChange={(event) =>
                  setCommitHashes((current) => ({
                    ...current,
                    [project.id]: event.target.value,
                  }))
                }
              />

              <button
                onClick={() => handleDeploy(project.id)}
                disabled={
                  deployingProjectId === project.id ||
                  !(commitHashes[project.id] || "").trim()
                }
              >
                {deployingProjectId === project.id ? "Deploying..." : "Deploy"}
              </button>
            </div>
          </div>
        ))}
      </section>
      
      {selectedProjectId !== null && (
        <section>
          <h2>Deployments {selectedProject && ` — ${selectedProject.name}`}</h2>
          
          {deployments.length === 0 ? (
            <p>No deployments yet.</p>
          ) : (
            deployments.map((deployment) => (
              <div key={deployment.id}>
                <p>Commit: {deployment.commitHash}</p>
                <p>
                  Status:{" "}
                  <span className={getDeploymentStatusClass(deployment.status)}>
                    {deployment.status}
                  </span>
                </p>
                <p>
                  Created:{" "}
                  {new Date(deployment.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </section>
      )}
      {deploymentError && <p>{deploymentError}</p>}
    </main>
  );
}