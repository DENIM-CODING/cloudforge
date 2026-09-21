package com.cloudforge.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cloudforge.backend.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}