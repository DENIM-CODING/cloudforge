package com.cloudforge.backend.exception;

public class InvalidDeploymentStateException extends RuntimeException {

    public InvalidDeploymentStateException(
            String message) {
        super(message);
    }
}