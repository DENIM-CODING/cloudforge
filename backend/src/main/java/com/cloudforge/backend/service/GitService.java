package com.cloudforge.backend.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.stereotype.Service;

@Service
public class GitService {

    public Path cloneRepository(String repositoryUrl) throws IOException, InterruptedException {

        Path directory = Files.createTempDirectory("cloudforge-");

        ProcessBuilder processBuilder = new ProcessBuilder(
                "git",
                "clone",
                repositoryUrl,
                directory.toString()
        );

        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()))) {

            String line;

            while ((line = reader.readLine()) != null) {
                System.out.println("[Git] " + line);
            }
        }

        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException(
                    "Git clone failed with exit code " + exitCode
            );
        }

        return directory;
    }

    public void checkoutCommit(Path directory, String commitHash)
            throws IOException, InterruptedException {

        ProcessBuilder processBuilder = new ProcessBuilder(
                "git",
                "checkout",
                commitHash
        );

        processBuilder.directory(directory.toFile());
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()))) {

            String line;

            while ((line = reader.readLine()) != null) {
                System.out.println("[Git] " + line);
            }
        }

        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException(
                    "Git checkout failed with exit code " + exitCode
            );
        }
    }
}