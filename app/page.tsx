import { appConfig } from "@/lib/config";

export default function HomePage() {
  return (
    <main className="page">
      <h1 className="fade-in">{appConfig.name}</h1>
      <p className="muted">{appConfig.description}</p>
    </main>
  );
}
