package com.cloudforge.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cloudforge.backend.dto.DeploymentRequest;
import com.cloudforge.backend.dto.DeploymentResponse;
import com.cloudforge.backend.service.DeploymentService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/deployments")
public class DeploymentController {

    private final DeploymentService deploymentService;

    public DeploymentController(DeploymentService deploymentService) {
        this.deploymentService = deploymentService;
    }

    @PostMapping
    public DeploymentResponse createDeployment(
            @Valid @RequestBody DeploymentRequest request) {

        return deploymentService.createDeployment(request);
    }

    @GetMapping
    public List<DeploymentResponse> getAllDeployments() {
        return deploymentService.getAllDeployments();
    }

    @GetMapping("/project/{projectId}")
    public List<DeploymentResponse> getDeploymentsByProject(
            @PathVariable Long projectId) {

        return deploymentService.getDeploymentsByProject(projectId);
    }

    @PostMapping("/{deploymentId}/stop")
    public DeploymentResponse stopDeployment(
            @PathVariable Long deploymentId) {

        return deploymentService.stopDeployment(deploymentId);
    }
}