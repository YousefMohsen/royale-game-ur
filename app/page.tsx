import Link from "next/link";
import { appConfig } from "@/lib/config";
import { GAME_MODES, modeLabels, playHref } from "@/lib/modes";

const modeHints = {
  computer: "Play alone against a simple computer opponent.",
  human: "Share this device and take turns with a friend.",
} as const;

export default function HomePage() {
  return (
    <main className="page home">
      <h1 className="fade-in">{appConfig.name}</h1>
      <p className="muted">
        Race your seven pieces along the board in this 4,500-year-old game of luck and strategy.
      </p>
      <nav aria-label="Choose a game mode" className="mode-list">
        {GAME_MODES.map((mode) => (
          <Link key={mode} href={playHref(mode)} className="button button-primary">
            <span className="button-title">{modeLabels[mode]}</span>
            <span className="button-hint">{modeHints[mode]}</span>
          </Link>
        ))}
      </nav>
      <p>
        <Link href="/rules" className="link">
          How to play
        </Link>
      </p>
    </main>
  );
}
