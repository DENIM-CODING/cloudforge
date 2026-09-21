package com.cloudforge.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cloudforge.backend.entity.Project;
import com.cloudforge.backend.repository.ProjectRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
}