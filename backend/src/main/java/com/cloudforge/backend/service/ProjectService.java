package com.cloudforge.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cloudforge.backend.dto.ProjectRequest;
import com.cloudforge.backend.entity.Project;
import com.cloudforge.backend.repository.ProjectRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public Project createProject(ProjectRequest request) {

    Project project = new Project();

    project.setName(request.getName());
    project.setRepositoryUrl(request.getRepositoryUrl());

    return projectRepository.save(project);
}

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
}