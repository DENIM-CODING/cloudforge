import { DeploymentStatus } from "../types/deployment";

export const getDeploymentStatusClass = (
  status: DeploymentStatus
) => {
  switch (status) {
    case "SUCCESS":
      return "bg-green-500/10 text-green-400";

    case "BUILDING":
      return "bg-yellow-500/10 text-yellow-400";

    case "PENDING":
      return "bg-blue-500/10 text-blue-400";

    case "FAILED":
      return "bg-red-500/10 text-red-400";

    case "STOPPED":
      return "bg-gray-500/10 text-gray-400";

    default:
      return "bg-gray-500/10 text-gray-400";
  }
};