"use client";

import { FormEvent, useEffect, useState } from "react";
import { useDeployments } from "../hooks/useDeployments";
import { useProjects } from "../hooks/useProjects";
import DeploymentDetails from "../components/DeploymentDetails";
import ProjectCard from "../components/ProjectCard";
import DashboardShell from "../components/DashboardShell";
import DashboardStats from "../components/DashboardStats";

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
  <DashboardShell>
    <main>
      {/* Header */}
      <div
        id="overview"
        className="border-b border-white/10"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-white">
                Overview
              </h1>

              <span className="rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-400">
                Local
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Manage your projects and deployments.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("create-project")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
            className="flex items-center gap-2 rounded-lg bg-lime-400 px-4 py-2 text-sm font-medium text-black transition hover:bg-lime-300"
          >
            <span className="text-base leading-none">
              +
            </span>

            New Project
          </button>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}
        <DashboardStats
          projectCount={projects.length}
          deploymentCount={deployments.length}
          activeCount={
            deployments.filter(
              (deployment) =>
                deployment.status === "SUCCESS"
            ).length
          }
          failedCount={
            deployments.filter(
              (deployment) =>
                deployment.status === "FAILED"
            ).length
          }
        />

        {/* Project error */}
        {projectsError && (
          <p className="mt-6 text-sm text-red-400">
            {projectsError}
          </p>
        )}

        {/* Create Project */}
        <section
          id="create-project"
          className="mt-10"
        >
          <div className="mb-4">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-600">
              New project
            </p>

            <h2 className="mt-2 text-lg font-medium text-white">
              Create a new project
            </h2>

            <p className="mt-1 max-w-xl text-sm text-gray-500">
              Connect a Git repository to CloudForge
              and deploy your application from a
              specific commit.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-white/10 bg-[#0f0f12] p-5"
          >
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Project name */}
              <div>
                <label
                  htmlFor="project-name"
                  className="mb-2 block text-xs font-medium text-gray-400"
                >
                  Project name
                </label>

                <input
                  id="project-name"
                  type="text"
                  placeholder="my-project"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-white/25 focus:bg-black/30"
                />
              </div>

              {/* Repository */}
              <div>
                <label
                  htmlFor="repository-url"
                  className="mb-2 block text-xs font-medium text-gray-400"
                >
                  Repository URL
                </label>

                <input
                  id="repository-url"
                  type="text"
                  placeholder="https://github.com/username/repository"
                  value={repositoryUrl}
                  onChange={(event) =>
                    setRepositoryUrl(event.target.value)
                  }
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-white/25 focus:bg-black/30"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-5">
              <p className="text-xs text-gray-600">
                Public Git repositories are supported.
              </p>

              <button
                type="submit"
                disabled={
                  !name.trim() ||
                  !repositoryUrl.trim()
                }
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Create Project
              </button>
            </div>
          </form>
        </section>

        {/* Projects */}
        <section
          id="projects"
          className="mt-12"
        >
          <div className="mb-5">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-600">
              Workspace
            </p>

            <h2 className="mt-2 text-lg font-medium text-white">
              Projects
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your connected repositories.
            </p>
          </div>

          {/* Loading */}
          {projectsLoading && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-52 animate-pulse rounded-xl border border-white/10 bg-[#0f0f12]"
                />
              ))}
            </div>
          )}

          {/* Empty */}
          {!projectsLoading &&
            projects.length === 0 && (
              <div className="rounded-xl border border-dashed border-white/10 px-6 py-10 text-center">
                <p className="text-sm text-gray-500">
                  No projects yet.
                </p>

                <p className="mt-1 text-xs text-gray-600">
                  Create your first project above
                  to get started.
                </p>
              </div>
            )}

          {/* Project cards */}
          {!projectsLoading && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  commitHash={
                    commitHashes[project.id] || ""
                  }
                  isDeploying={
                    deployingProjectId === project.id
                  }
                  onViewDeployments={
                    handleViewDeployments
                  }
                  onDeploy={handleDeploy}
                  onCommitHashChange={(
                    projectId,
                    value
                  ) =>
                    setCommitHashes((current) => ({
                      ...current,
                      [projectId]: value,
                    }))
                  }
                />
              ))}
            </div>
          )}
        </section>

        {/* Deployments */}
        <section
          id="deployments"
          className="mt-12"
        >
          {/* Heading */}
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-gray-600">
                Activity
              </p>

              <h2 className="mt-2 text-lg font-medium text-white">
                Deployments
                {selectedProject &&
                  ` — ${selectedProject.name}`}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {selectedProject
                  ? "Recent deployment activity for this project."
                  : "Select a project to view its deployment activity."}
              </p>
            </div>

            {/* Close selected project */}
            {selectedProjectId !== null && (
              <button
                type="button"
                onClick={() => {
                  setSelectedProjectId(null);
                  setDeployments([]);
                }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-gray-500 transition hover:bg-white/[0.05] hover:text-white"
                aria-label="Close project deployments"
              >
                <span className="text-lg leading-none">
                  ×
                </span>
              </button>
            )}
          </div>

          {/* No project selected */}
          {selectedProjectId === null && (
            <div className="rounded-xl border border-dashed border-white/10 px-6 py-12 text-center">
              <p className="text-sm text-gray-400">
                No project selected
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Select "View Deployments" from a
                project to see its deployment history.
              </p>
            </div>
          )}

          {/* Selected project */}
          {selectedProjectId !== null && (
            <>
              {/* Loading */}
              {deploymentsLoading && (
                <div className="space-y-3">
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-16 animate-pulse rounded-xl border border-white/10 bg-[#0f0f12]"
                    />
                  ))}
                </div>
              )}

              {/* Error */}
              {deploymentsError && (
                <p className="text-sm text-red-400">
                  {deploymentsError}
                </p>
              )}

              {/* Empty */}
              {!deploymentsLoading &&
                !deploymentsError &&
                deployments.length === 0 && (
                  <div className="rounded-xl border border-dashed border-white/10 px-6 py-10 text-center">
                    <p className="text-sm text-gray-500">
                      No deployments yet.
                    </p>

                    <p className="mt-1 text-xs text-gray-600">
                      Deploy a commit from the project
                      above to see it here.
                    </p>
                  </div>
                )}

              {/* Deployment list */}
              {!deploymentsLoading &&
                deployments.length > 0 && (
                  <div className="space-y-3">
                    {deployments.map((deployment) => (
                      <DeploymentDetails
                        key={deployment.id}
                        deployment={deployment}
                        onStop={handleStopDeployment}
                      />
                    ))}
                  </div>
                )}
            </>
          )}
        </section>

        {/* Deployment error */}
        {deploymentError && (
          <p className="mt-6 text-sm text-red-400">
            {deploymentError}
          </p>
        )}
      </div>
    </main>
  </DashboardShell>
);
}