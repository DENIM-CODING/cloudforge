package com.cloudforge.backend.service;

import com.cloudforge.backend.entity.Deployment;
import com.cloudforge.backend.entity.DeploymentStatus;
import com.cloudforge.backend.repository.DeploymentRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class DeploymentWorker {

    private final DeploymentEngine deploymentEngine;
    private final DeploymentRepository deploymentRepository;

    public DeploymentWorker(
            DeploymentEngine deploymentEngine,
            DeploymentRepository deploymentRepository) {

        this.deploymentEngine = deploymentEngine;
        this.deploymentRepository = deploymentRepository;
    }

    @Async
    public void deploy(Deployment deployment) {

        try {
            deployment.setStatus(DeploymentStatus.BUILDING);
            deploymentRepository.save(deployment);

            String imageName =
                    "cloudforge-project-" +
                    deployment.getProject().getId() +
                    "-deployment-" +
                    deployment.getId();

            String containerName =
                    "cloudforge-deployment-" +
                    deployment.getId();

            int hostPort = deploymentEngine.deploy(
                    deployment.getProject().getRepositoryUrl(),
                    deployment.getCommitHash(),
                    imageName,
                    containerName
            );

            deployment.setHostPort(hostPort);
            deployment.setImageName(imageName);
            deployment.setContainerName(containerName);
            deployment.setStatus(DeploymentStatus.SUCCESS);

            deploymentRepository.save(deployment);

        } catch (Exception exception) {

            deployment.setStatus(DeploymentStatus.FAILED);
            deploymentRepository.save(deployment);

            System.out.println(
                    "[Deployment Worker] Failed: "
                            + exception.getMessage()
            );
        }
    }
}