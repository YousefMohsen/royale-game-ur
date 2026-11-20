import type { Metadata } from "next";
import Link from "next/link";
import { pageTitle } from "@/lib/config";
import { GameBoard } from "@/components/game-board";
import { modeLabels, parseMode } from "@/lib/modes";

export const metadata: Metadata = { title: pageTitle("Play") };

export default async function PlayPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ mode?: string | string[] }> }>) {
  const mode = parseMode((await searchParams).mode);

  if (!mode) {
    return (
      <main className="page">
        <h1>Choose a game mode</h1>
        <p className="muted" role="alert">
          That game mode is not available.
        </p>
        <Link href="/" className="link">
          Back to home
        </Link>
      </main>
    );
  }

  return (
    <main className="page">
      <h1 className="fade-in">{modeLabels[mode]}</h1>
      <GameBoard key={mode} mode={mode} />
    </main>
  );
}
