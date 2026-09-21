export default async function Home() {
  const response = await fetch("http://localhost:8080/api/health", {
    cache: "no-store",
  });

  const message = await response.text();

  return (
    <main>
      <h1>CloudForge</h1>

      <p>{message}</p>
    </main>
  );
}