package com.cloudforge.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cloudforge.backend.dto.DeploymentRequest;
import com.cloudforge.backend.dto.DeploymentResponse;
import com.cloudforge.backend.entity.Deployment;
import com.cloudforge.backend.entity.Project;
import com.cloudforge.backend.exception.ProjectNotFoundException;
import com.cloudforge.backend.repository.DeploymentRepository;
import com.cloudforge.backend.repository.ProjectRepository;

@Service
public class DeploymentService {

    private final DeploymentRepository deploymentRepository;
    private final ProjectRepository projectRepository;

    public DeploymentService(
            DeploymentRepository deploymentRepository,
            ProjectRepository projectRepository) {

        this.deploymentRepository = deploymentRepository;
        this.projectRepository = projectRepository;
    }

    public DeploymentResponse createDeployment(DeploymentRequest request) {

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() ->
                        new ProjectNotFoundException(request.getProjectId())
                );

        Deployment deployment = new Deployment();

        deployment.setCommitHash(request.getCommitHash());
        deployment.setProject(project);

        Deployment savedDeployment = deploymentRepository.save(deployment);

        return toResponse(savedDeployment);
    }

    public List<DeploymentResponse> getAllDeployments() {

        return deploymentRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private DeploymentResponse toResponse(Deployment deployment) {

        return new DeploymentResponse(
                deployment.getId(),
                deployment.getProject().getId(),
                deployment.getCommitHash(),
                deployment.getStatus(),
                deployment.getCreatedAt()
        );
    }

    public List<DeploymentResponse> getDeploymentsByProject(Long projectId) {

        projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new ProjectNotFoundException(projectId)
                );

        return deploymentRepository.findByProjectId(projectId)
                .stream()
                .map(this::toResponse)
                .toList();
    }
}