"use client";

import { useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  GitCommit,
  Square,
  Terminal,
} from "lucide-react";

import { Deployment } from "../types/deployment";
import { getDeploymentStatusClass } from "../lib/deployment";

type DeploymentDetailsProps = {
  deployment: Deployment;
  onStop: (deploymentId: number) => void;
};

export default function DeploymentDetails({
  deployment,
  onStop,
}: DeploymentDetailsProps) {
  const [expanded, setExpanded] =
    useState(false);

  const isRunning =
    deployment.status === "SUCCESS";

  return (
    <article className="rounded-xl border border-white/10 bg-[#0f0f12] transition hover:border-white/15">
      {/* Main row */}
      <div className="flex items-center gap-4 px-4 py-4">
        {/* Icon */}
        <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] sm:flex">
          <GitCommit
            size={15}
            strokeWidth={1.8}
            className="text-gray-500"
          />
        </div>

        {/* Deployment */}
        <div className="w-20 shrink-0">
          <p className="text-[10px] text-gray-600">
            Deployment
          </p>

          <p className="mt-0.5 text-sm font-medium text-white">
            #{deployment.id}
          </p>
        </div>

        {/* Commit */}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-gray-600">
            Commit
          </p>

          <p className="mt-0.5 truncate font-mono text-xs text-gray-300">
            {deployment.commitHash}
          </p>
        </div>

        {/* Created */}
        <div className="hidden w-36 shrink-0 md:block">
          <p className="text-[10px] text-gray-600">
            Created
          </p>

          <p className="mt-0.5 truncate text-xs text-gray-400">
            {new Date(
              deployment.createdAt
            ).toLocaleString()}
          </p>
        </div>

        {/* Status */}
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${getDeploymentStatusClass(
            deployment.status
          )}`}
        >
          {deployment.status}
        </span>

        {/* Expand */}
        <button
          type="button"
          onClick={() =>
            setExpanded((current) => !current)
          }
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-600 transition hover:bg-white/[0.05] hover:text-gray-300"
          aria-label={
            expanded
              ? "Hide deployment details"
              : "Show deployment details"
          }
        >
          <ChevronDown
            size={15}
            className={`transition-transform ${
              expanded
                ? "rotate-180"
                : ""
            }`}
          />
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-white/[0.06] px-4 py-4">
          {/* Runtime */}
          {(deployment.hostPort ||
            deployment.containerName ||
            deployment.imageName) && (
            <div>
              <div className="flex items-center gap-2">
                <Terminal
                  size={13}
                  className="text-gray-600"
                />

                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-600">
                  Runtime
                </p>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {deployment.hostPort && (
                  <div>
                    <p className="text-[10px] text-gray-600">
                      Host Port
                    </p>

                    <p className="mt-1 font-mono text-xs text-gray-300">
                      {deployment.hostPort}
                    </p>
                  </div>
                )}

                {deployment.containerName && (
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-600">
                      Container
                    </p>

                    <p className="mt-1 truncate font-mono text-xs text-gray-300">
                      {deployment.containerName}
                    </p>
                  </div>
                )}

                {deployment.imageName && (
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-600">
                      Image
                    </p>

                    <p className="mt-1 truncate font-mono text-xs text-gray-300">
                      {deployment.imageName}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-4">
            {isRunning &&
              deployment.hostPort && (
                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      `http://localhost:${deployment.hostPort}`,
                      "_blank"
                    )
                  }
                  className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-black transition hover:bg-gray-200"
                >
                  <ExternalLink size={13} />

                  Open Application
                </button>
              )}

            {isRunning && (
              <button
                type="button"
                onClick={() =>
                  onStop(deployment.id)
                }
                className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-gray-400 transition hover:bg-white/[0.04] hover:text-white"
              >
                <Square size={12} />

                Stop
              </button>
            )}
          </div>
        </div>
      )}
    </article>
  );
}