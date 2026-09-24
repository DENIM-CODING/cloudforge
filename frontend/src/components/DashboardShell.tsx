"use client";

import { useEffect, useState } from "react";
import {
  FolderGit2,
  LayoutDashboard,
  Rocket,
  Settings,
} from "lucide-react";

type DashboardShellProps = {
  children: React.ReactNode;
};

type Section = "overview" | "projects" | "deployments";

export default function DashboardShell({
  children,
}: DashboardShellProps) {
  const [activeSection, setActiveSection] =
    useState<Section>("overview");

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        {
          id: "deployments",
          name: "deployments" as Section,
        },
        {
          id: "projects",
          name: "projects" as Section,
        },
        {
          id: "overview",
          name: "overview" as Section,
        },
      ];

      const scrollPosition =
        window.scrollY + 180;

      for (const section of sections) {
        const element =
          document.getElementById(section.id);

        if (!element) continue;

        const top = element.offsetTop;
        const bottom =
          top + element.offsetHeight;

        if (
          scrollPosition >= top &&
          scrollPosition < bottom
        ) {
          setActiveSection(section.name);
          return;
        }
      }

      setActiveSection("overview");
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    handleScroll();

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  const navItemClass = (section: Section) =>
    `group flex w-full items-center rounded-lg px-3 py-2.5 text-sm transition ${
      activeSection === section
        ? "bg-white/[0.06] text-white"
        : "text-gray-500 hover:bg-white/[0.04] hover:text-gray-200"
    }`;

  const navIconClass = (section: Section) =>
    activeSection === section
      ? "text-lime-400"
      : "text-gray-600 group-hover:text-gray-400";

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 border-r border-white/10 bg-[#0c0c0f] md:block">
          <div className="sticky top-0 flex h-screen flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-white/10 px-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-lime-400 text-sm font-bold text-black">
                  C
                </div>

                <div>
                  <p className="text-sm font-semibold tracking-tight text-white">
                    CloudForge
                  </p>

                  <p className="text-[10px] text-gray-600">
                    Developer Platform
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-5">
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
                Workspace
              </p>

              <div className="space-y-1">
                {/* Overview */}
                <button
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  className={navItemClass(
                    "overview"
                  )}
                >
                  <LayoutDashboard
                    size={16}
                    strokeWidth={1.8}
                    className={`mr-3 ${navIconClass(
                      "overview"
                    )}`}
                  />

                  <span>Overview</span>
                </button>

                {/* Projects */}
                <button
                  onClick={() =>
                    document
                      .getElementById("projects")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                  className={navItemClass(
                    "projects"
                  )}
                >
                  <FolderGit2
                    size={16}
                    strokeWidth={1.8}
                    className={`mr-3 ${navIconClass(
                      "projects"
                    )}`}
                  />

                  <span>Projects</span>
                </button>

                {/* Deployments */}
                <button
                  onClick={() =>
                    document
                      .getElementById("deployments")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                  className={navItemClass(
                    "deployments"
                  )}
                >
                  <Rocket
                    size={16}
                    strokeWidth={1.8}
                    className={`mr-3 ${navIconClass(
                      "deployments"
                    )}`}
                  />

                  <span>Deployments</span>
                </button>
              </div>

              {/* System */}
              <p className="mt-8 px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
                System
              </p>

              <button className="group flex w-full items-center rounded-lg px-3 py-2.5 text-sm text-gray-500 transition hover:bg-white/[0.04] hover:text-gray-200">
                <Settings
                  size={16}
                  strokeWidth={1.8}
                  className="mr-3 text-gray-600 transition group-hover:text-gray-400"
                />

                <span>Settings</span>
              </button>
            </nav>

            {/* Workspace footer */}
            <div className="border-t border-white/10 p-3">
              <div className="flex items-center gap-3 rounded-lg px-2 py-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-xs font-medium text-gray-300">
                  D
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm text-gray-300">
                    Denim
                  </p>

                  <p className="truncate text-[11px] text-gray-600">
                    Local workspace
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}