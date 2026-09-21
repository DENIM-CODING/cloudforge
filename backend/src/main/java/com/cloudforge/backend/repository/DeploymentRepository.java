package com.cloudforge.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cloudforge.backend.entity.Deployment;

public interface DeploymentRepository extends JpaRepository<Deployment, Long> {

    List<Deployment> findByProjectId(Long projectId);
}