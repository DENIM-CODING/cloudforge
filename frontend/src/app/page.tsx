"use client";

import { FormEvent, useEffect, useState } from "react";

type Project = {
  id: number;
  name: string;
  repositoryUrl: string;
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    const response = await fetch("http://localhost:8080/api/projects");

    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }

    const data = await response.json();
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const response = await fetch("http://localhost:8080/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        repositoryUrl,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.message || "Failed to create project");
      return;
    }

    setName("");
    setRepositoryUrl("");

    await fetchProjects();
  };

  return (
    <main>
      <h1>CloudForge</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <input
          type="text"
          placeholder="Repository URL"
          value={repositoryUrl}
          onChange={(event) => setRepositoryUrl(event.target.value)}
        />

        <button type="submit">Create Project</button>
      </form>

      {error && <p>{error}</p>}

      <section>
        <h2>Projects</h2>

        {projects.map((project) => (
          <div key={project.id}>
            <h3>{project.name}</h3>
            <p>{project.repositoryUrl}</p>
          </div>
        ))}
      </section>
    </main>
  );
}