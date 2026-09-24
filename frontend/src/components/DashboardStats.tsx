import {
  Activity,
  Box,
  FolderGit2,
  XCircle,
} from "lucide-react";

type DashboardStatsProps = {
  projectCount: number;
  deploymentCount: number;
  activeCount: number;
  failedCount: number;
};

export default function DashboardStats({
  projectCount,
  deploymentCount,
  activeCount,
  failedCount,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Projects",
      value: projectCount,
      icon: FolderGit2,
      description: "Connected repositories",
    },
    {
      label: "Deployments",
      value: deploymentCount,
      icon: Box,
      description: "Current project",
    },
    {
      label: "Active",
      value: activeCount,
      icon: Activity,
      description: "Running deployments",
    },
    {
      label: "Failed",
      value: failedCount,
      icon: XCircle,
      description: "Failed deployments",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="group rounded-xl border border-white/10 bg-[#0f0f12] p-4 transition hover:border-white/15"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon
                  size={15}
                  strokeWidth={1.8}
                  className="text-gray-500 transition group-hover:text-gray-300"
                />

                <span className="text-xs font-medium text-gray-500">
                  {stat.label}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-2xl font-semibold tracking-tight text-white">
                {stat.value}
              </p>

              <p className="mt-1 text-[11px] text-gray-600">
                {stat.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}