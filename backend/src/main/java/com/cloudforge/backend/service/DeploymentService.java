package com.cloudforge.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cloudforge.backend.dto.DeploymentRequest;
import com.cloudforge.backend.dto.DeploymentResponse;
import com.cloudforge.backend.entity.Deployment;
import com.cloudforge.backend.entity.DeploymentStatus;
import com.cloudforge.backend.entity.Project;
import com.cloudforge.backend.exception.ProjectNotFoundException;
import com.cloudforge.backend.repository.DeploymentRepository;
import com.cloudforge.backend.repository.ProjectRepository;

@Service
public class DeploymentService {

    private final DeploymentRepository deploymentRepository;
    private final ProjectRepository projectRepository;
    private final DeploymentEngine deploymentEngine;

    public DeploymentService( DeploymentRepository deploymentRepository, ProjectRepository projectRepository, DeploymentEngine deploymentEngine) {
        this.deploymentRepository = deploymentRepository;
        this.projectRepository = projectRepository;
        this.deploymentEngine = deploymentEngine;
    }

    public DeploymentResponse createDeployment(DeploymentRequest request) {

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ProjectNotFoundException(request.getProjectId()));

        Deployment deployment = new Deployment();

        deployment.setCommitHash(request.getCommitHash());
        deployment.setProject(project);

        // First save → status becomes PENDING
        deployment = deploymentRepository.save(deployment);

        try {

                // Deployment has officially started
                deployment.setStatus(DeploymentStatus.BUILDING);
                deploymentRepository.save(deployment);

                String imageName =
                        "cloudforge-project-" +
                        project.getId() +
                        "-deployment-" +
                        deployment.getId();

                String containerName =
                        "cloudforge-deployment-" +
                        deployment.getId();

                int hostPort = deploymentEngine.deploy(
                        project.getRepositoryUrl(),
                        request.getCommitHash(),
                        imageName,
                        containerName
                );

                deployment.setHostPort(hostPort);
                deployment.setImageName(imageName);
                deployment.setContainerName(containerName);
                deployment.setStatus(DeploymentStatus.SUCCESS);

        } catch (Exception exception) {

                // Something failed during deployment
                deployment.setStatus(DeploymentStatus.FAILED);

                System.out.println(
                        "[Deployment] Failed: " + exception.getMessage()
                );
        }

        deploymentRepository.save(deployment);

        return toResponse(deployment);
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
                deployment.getHostPort(),
                deployment.getImageName(),
                deployment.getContainerName(),
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