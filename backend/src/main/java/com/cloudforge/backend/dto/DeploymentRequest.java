package com.cloudforge.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DeploymentRequest {

    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotBlank(message = "Commit hash is required")
    private String commitHash;

    public DeploymentRequest() {
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getCommitHash() {
        return commitHash;
    }

    public void setCommitHash(String commitHash) {
        this.commitHash = commitHash;
    }
}