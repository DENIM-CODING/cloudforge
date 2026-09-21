package com.cloudforge.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cloudforge.backend.service.DeploymentEngine;

@RestController
@RequestMapping("/api/deployment-test")
public class DeploymentTestController {

    private final DeploymentEngine deploymentEngine;

    public DeploymentTestController(DeploymentEngine deploymentEngine) {
        this.deploymentEngine = deploymentEngine;
    }

    @PostMapping
    public String deploy() throws Exception {

        deploymentEngine.deploy(
                "https://github.com/DENIM-CODING/cloudforge-demo.git",
                "6e21572",
                "cloudforge-deploy-test"
        );

        return "Deployment pipeline completed successfully";
    }
}