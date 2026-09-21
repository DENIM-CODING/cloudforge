package com.cloudforge.backend.controller;

import java.nio.file.Path;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cloudforge.backend.service.GitService;

@RestController
@RequestMapping("/api/git")
public class GitTestController {

    private final GitService gitService;

    public GitTestController(GitService gitService) {
        this.gitService = gitService;
    }

    @PostMapping("/clone")
    public String cloneRepository() throws Exception {

        Path directory = gitService.cloneRepository(
                "https://github.com/DENIM-CODING/cloudforge-demo.git"
        );

        gitService.checkoutCommit(
                directory,
                "6e21572"
        );

        return "Repository cloned and checked out at: " + directory;
    }
}