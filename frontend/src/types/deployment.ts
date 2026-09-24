export type DeploymentStatus =
  | "PENDING"
  | "BUILDING"
  | "SUCCESS"
  | "FAILED"
  | "STOPPED";

export type Deployment = {
  id: number;
  projectId: number;
  commitHash: string;
  status: DeploymentStatus;
  hostPort: number | null;
  imageName: string | null;
  containerName: string | null;
  createdAt: string;
};