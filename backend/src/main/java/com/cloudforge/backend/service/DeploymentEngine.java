package com.cloudforge.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;

import org.springframework.stereotype.Service;

@Service
public class DeploymentEngine {

    private final GitService gitService;
    private final DockerService dockerService;
    private final ContainerService containerService;
    
    public DeploymentEngine(
            GitService gitService,
            DockerService dockerService,
            ContainerService containerService) {

        this.gitService = gitService;
        this.dockerService = dockerService;
        this.containerService = containerService;
    }
    

    public int deploy(
            String repositoryUrl,
            String commitHash,
            String imageName,
            String containerName) throws Exception {

        Path directory = null;

        try {
            // 1. Clone repository
            directory = gitService.cloneRepository(repositoryUrl);

            // 2. Checkout requested commit
            gitService.checkoutCommit(directory, commitHash);

            // 3. Build Docker image
            dockerService.buildImage(
                    directory.toString(),
                    imageName
            );

            // 4. Run the container and get the port Docker assigned
            int hostPort = containerService.runContainer(
                    imageName,
                    containerName,
                    3000
            );

            System.out.println("[Deployment] Application running on port: " + hostPort);

            return hostPort;

        } finally {

            // 4. Delete temporary workspace
            if (directory != null) {
                deleteDirectory(directory);
            }
        }
    }

    private void deleteDirectory(Path directory) throws IOException {

        if (!Files.exists(directory)) {
            return;
        }

        try (var paths = Files.walk(directory)) {
            paths.sorted(Comparator.reverseOrder())
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                        } catch (IOException exception) {
                            throw new RuntimeException(
                                    "Failed to delete: " + path,
                                    exception
                            );
                        }
                    });
        }
    }
}