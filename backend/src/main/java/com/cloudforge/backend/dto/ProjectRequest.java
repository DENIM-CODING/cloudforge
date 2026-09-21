package com.cloudforge.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class ProjectRequest {

    @NotBlank(message = "Project name is required")
    private String name;

    @NotBlank(message = "Repository URL is required")
    private String repositoryUrl;

    public ProjectRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRepositoryUrl() {
        return repositoryUrl;
    }

    public void setRepositoryUrl(String repositoryUrl) {
        this.repositoryUrl = repositoryUrl;
    }
}