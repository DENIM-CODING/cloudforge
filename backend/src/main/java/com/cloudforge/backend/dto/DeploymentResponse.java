package com.cloudforge.backend.dto;

import java.time.LocalDateTime;

import com.cloudforge.backend.entity.DeploymentStatus;

public class DeploymentResponse {

    private Long id;
    private Long projectId;
    private String commitHash;
    private DeploymentStatus status;
    private Integer hostPort;
    private String imageName;
    private String containerName;
    private LocalDateTime createdAt;

    public DeploymentResponse() {
    }

    public DeploymentResponse(
            Long id,
            Long projectId,
            String commitHash,
            DeploymentStatus status,
            Integer hostPort,
            String imageName,
            String containerName,
            LocalDateTime createdAt) {

        this.id = id;
        this.projectId = projectId;
        this.commitHash = commitHash;
        this.status = status;
        this.hostPort = hostPort;
        this.imageName = imageName;
        this.containerName = containerName;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public String getCommitHash() {
        return commitHash;
    }

    public DeploymentStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public Integer getHostPort() {
        return hostPort;
    }

    public String getImageName() {
        return imageName;
    }

    public String getContainerName() {
        return containerName;
    }
}