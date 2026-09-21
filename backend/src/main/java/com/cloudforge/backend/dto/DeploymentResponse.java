package com.cloudforge.backend.dto;

import java.time.LocalDateTime;

import com.cloudforge.backend.entity.DeploymentStatus;

public class DeploymentResponse {

    private Long id;
    private Long projectId;
    private String commitHash;
    private DeploymentStatus status;
    private LocalDateTime createdAt;

    public DeploymentResponse() {
    }

    public DeploymentResponse(
            Long id,
            Long projectId,
            String commitHash,
            DeploymentStatus status,
            LocalDateTime createdAt) {

        this.id = id;
        this.projectId = projectId;
        this.commitHash = commitHash;
        this.status = status;
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
}