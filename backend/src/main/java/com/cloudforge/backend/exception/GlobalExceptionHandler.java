package com.cloudforge.backend.exception;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException exception) {

        Map<String, String> errors = new LinkedHashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(error.getField(), error.getDefaultMessage())
                );

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Validation failed");
        response.put("errors", errors);

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(ProjectNotFoundException.class)
        public ResponseEntity<Map<String, Object>> handleProjectNotFound(
                ProjectNotFoundException exception) {

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("message", exception.getMessage());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
        }

        @ExceptionHandler(DeploymentNotFoundException.class)
        public ResponseEntity<Map<String, Object>> handleDeploymentNotFound(
                DeploymentNotFoundException exception) {

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", exception.getMessage());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
        }

        @ExceptionHandler(InvalidDeploymentStateException.class)
                public ResponseEntity<Map<String, Object>> handleInvalidDeploymentState(
                        InvalidDeploymentStateException exception) {

                Map<String, Object> response = new LinkedHashMap<>();
                response.put("message", exception.getMessage());

                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(response);
        }

}