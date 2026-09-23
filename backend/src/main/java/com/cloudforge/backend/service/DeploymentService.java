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
    private final DeploymentWorker deploymentWorker;
    private final ContainerService containerService;

        public DeploymentService(
                DeploymentRepository deploymentRepository,
                ProjectRepository projectRepository,
                DeploymentWorker deploymentWorker,
                ContainerService containerService) {

        this.deploymentRepository = deploymentRepository;
        this.projectRepository = projectRepository;
        this.deploymentWorker = deploymentWorker;
        this.containerService = containerService;
        }

        public DeploymentResponse createDeployment(DeploymentRequest request) {

                Project project = projectRepository.findById(request.getProjectId())
                        .orElseThrow(() ->
                                new ProjectNotFoundException(request.getProjectId()));

                Deployment deployment = new Deployment();

                deployment.setCommitHash(request.getCommitHash());
                deployment.setProject(project);

                deployment = deploymentRepository.save(deployment);

                deploymentWorker.deploy(deployment.getId());

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

    public DeploymentResponse stopDeployment(Long deploymentId) {

        Deployment deployment = deploymentRepository.findById(deploymentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Deployment with id " + deploymentId + " not found"
                        )
                );

        if (deployment.getStatus() != DeploymentStatus.SUCCESS) {
                throw new RuntimeException(
                        "Only successful deployments can be stopped"
                );
        }

        try {

                containerService.stopContainer(
                        deployment.getContainerName()
                );

                deployment.setStatus(DeploymentStatus.STOPPED);

                deploymentRepository.save(deployment);

                return toResponse(deployment);

        } catch (Exception exception) {

                System.out.println(
                        "[Deployment] Failed to stop container: "
                                + exception.getMessage()
                );

                throw new RuntimeException(
                        "Failed to stop deployment",
                        exception
                );
        }
        }
}