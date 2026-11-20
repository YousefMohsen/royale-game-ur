import type { Metadata } from "next";
import Link from "next/link";
import { pageTitle } from "@/lib/config";

export const metadata: Metadata = { title: pageTitle("How to play") };

export default function RulesPage() {
  return (
    <main className="page">
      <h1>How to play</h1>
      <ul>
        <li>Each player has seven pieces that travel from start to finish along their path.</li>
        <li>Roll four dice: the number of marked sides up is how far you move (0 to 4).</li>
        <li>Landing on an opponent piece in the shared middle lane sends it back to start.</li>
        <li>Rosette squares are safe and give you another turn.</li>
        <li>The first player to bring all seven pieces home wins.</li>
      </ul>
      <Link href="/" className="link">
        Back to home
      </Link>
    </main>
  );
}
