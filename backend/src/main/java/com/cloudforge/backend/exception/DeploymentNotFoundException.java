package com.cloudforge.backend.exception;

public class DeploymentNotFoundException extends RuntimeException {

    public DeploymentNotFoundException(Long deploymentId) {
        super("Deployment with id " + deploymentId + " not found");
    }
}