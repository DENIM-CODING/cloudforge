package com.cloudforge.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cloudforge.backend.service.DockerService;

@RestController
@RequestMapping("/api/docker")
public class DockerTestController {

    private final DockerService dockerService;

    public DockerTestController(DockerService dockerService) {
        this.dockerService = dockerService;
    }

    @PostMapping("/build")
    public String buildDockerImage() throws Exception {

        dockerService.buildImage(
                "/Users/denim/Desktop/cloudforge-demo",
                "cloudforge-demo-java"
        );

        return "Docker image built successfully";
    }
}