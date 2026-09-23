package com.cloudforge.backend.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.springframework.stereotype.Service;

@Service
public class ContainerService {

    public int runContainer(
        String imageName,
        String containerName,
        int containerPort)
        throws IOException, InterruptedException {

        ProcessBuilder runProcess = new ProcessBuilder(
                "docker",
                "run",
                "-d",
                "--name",
                containerName,
                "-p",
                "0:" + containerPort,
                imageName
        );

        runProcess.redirectErrorStream(true);

        Process process = runProcess.start();

        String containerId;

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()))) {

            containerId = reader.readLine();
        }

        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException(
                    "Docker container failed to start with exit code " + exitCode
            );
        }

        ProcessBuilder portProcess = new ProcessBuilder(
                "docker",
                "port",
                containerName,
                containerPort + "/tcp"
        );

        portProcess.redirectErrorStream(true);

        Process portCommand = portProcess.start();

        String portOutput;

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(portCommand.getInputStream()))) {

            portOutput = reader.readLine();
        }

        int portExitCode = portCommand.waitFor();

        if (portExitCode != 0 || portOutput == null) {
            throw new RuntimeException(
                    "Failed to determine assigned host port"
            );
        }

        System.out.println("[Docker Run] Container ID: " + containerId);
        System.out.println("[Docker Run] Port mapping: " + portOutput);

        String hostPort = portOutput.substring(
                portOutput.lastIndexOf(":") + 1
        );

        return Integer.parseInt(hostPort);
    }

    public void stopContainer(String containerName)
        throws IOException, InterruptedException {

        ProcessBuilder processBuilder = new ProcessBuilder(
                "docker",
                "stop",
                containerName
        );

        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()))) {

            String line;

            while ((line = reader.readLine()) != null) {
                System.out.println("[Docker Stop] " + line);
            }
        }

        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException(
                    "Docker stop failed with exit code " + exitCode
            );
        }
    }
}