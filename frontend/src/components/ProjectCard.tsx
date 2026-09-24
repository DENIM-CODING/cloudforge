import {
  ExternalLink,
  GitBranch,
  Rocket,
} from "lucide-react";
import { Project } from "../hooks/useProjects";

type ProjectCardProps = {
  project: Project;
  deploymentCount?: number;
  onViewDeployments: (projectId: number) => void;
  onDeploy: (projectId: number) => void;
  commitHash: string;
  onCommitHashChange: (
    projectId: number,
    value: string
  ) => void;
  isDeploying: boolean;
};

export default function ProjectCard({
  project,
  deploymentCount,
  onViewDeployments,
  onDeploy,
  commitHash,
  onCommitHashChange,
  isDeploying,
}: ProjectCardProps) {
  return (
    <article className="group rounded-xl border border-white/10 bg-[#0f0f12] p-5 transition hover:border-white/20">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
            <GitBranch
              size={17}
              strokeWidth={1.8}
              className="text-gray-500"
            />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium text-white">
              {project.name}
            </h3>

            <p className="mt-1 truncate text-xs text-gray-600">
              {project.repositoryUrl}
            </p>
          </div>
        </div>

        {/* Status */}
        <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-[10px] font-medium text-green-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />

          {project.status}
        </span>
      </div>

      {/* Metadata */}
      <div className="mt-5 flex items-center gap-5 text-xs text-gray-600">
        <span>
          Created{" "}
          {new Date(
            project.createdAt
          ).toLocaleDateString()}
        </span>

        {deploymentCount !== undefined && (
          <span>
            {deploymentCount} deployments
          </span>
        )}
      </div>

      {/* Deployment input */}
      <div className="mt-5 border-t border-white/[0.06] pt-4">
        <label
          htmlFor={`commit-${project.id}`}
          className="mb-2 block text-[11px] font-medium text-gray-500"
        >
          Commit to deploy
        </label>

        <input
          id={`commit-${project.id}`}
          type="text"
          placeholder="e.g. 6e21572"
          value={commitHash}
          onChange={(event) =>
            onCommitHashChange(
              project.id,
              event.target.value
            )
          }
          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs font-mono text-gray-300 outline-none transition placeholder:text-gray-700 focus:border-white/20"
        />
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() =>
            onViewDeployments(project.id)
          }
          className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-gray-400 transition hover:bg-white/[0.04] hover:text-white"
        >
          <ExternalLink size={14} />

          View Deployments
        </button>

        <button
          type="button"
          onClick={() =>
            onDeploy(project.id)
          }
          disabled={
            isDeploying || !commitHash.trim()
          }
          className="ml-auto flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Rocket size={14} />

          {isDeploying && (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-black/20 border-t-black" />
          )}

          {isDeploying
            ? "Deploying..."
            : "Deploy"}
        </button>
      </div>
    </article>
  );
}