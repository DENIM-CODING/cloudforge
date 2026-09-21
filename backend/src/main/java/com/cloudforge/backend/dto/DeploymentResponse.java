package com.cloudforge.backend.dto;

import java.time.LocalDateTime;

public class DeploymentResponse {

    private Long id;
    private Long projectId;
    private String commitHash;
    private String status;
    private LocalDateTime createdAt;

    public DeploymentResponse() {
    }

    public DeploymentResponse(
            Long id,
            Long projectId,
            String commitHash,
            String status,
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

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}