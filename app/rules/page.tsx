import type { Metadata } from "next";
import Link from "next/link";
import { pageTitle } from "@/lib/config";

export const metadata: Metadata = { title: pageTitle("How to play") };

export default function RulesPage() {
  return (
    <main className="page rules">
      <h1>How to play</h1>
      <p className="muted">
        The Royal Game of Ur is a two-player race. Bring all seven of your pieces around the board
        and off the end before your opponent does.
      </p>

      <section aria-labelledby="rules-objective">
        <h2 id="rules-objective">Objective</h2>
        <p>
          Each player has seven pieces. The first player to bear off all seven pieces wins.
        </p>
      </section>

      <section aria-labelledby="rules-rolling">
        <h2 id="rules-rolling">Rolling</h2>
        <p>
          On your turn you roll four dice. The number of marked sides facing up is your roll, from
          0 to 4. A roll of 0 passes the turn.
        </p>
      </section>

      <section aria-labelledby="rules-moving">
        <h2 id="rules-moving">Moving</h2>
        <ul>
          <li>
            Your path has 14 steps. A piece starts off the board and enters on step 1 or further,
            moving forward by the number you rolled.
          </li>
          <li>Steps 1–4 and 13–14 are private to you. Steps 5–12 are the shared middle lane.</li>
          <li>You choose which piece to move. You cannot land on your own piece.</li>
          <li>
            To bear a piece off the board you must roll the exact number needed. Rolling too much
            is not allowed for that piece.
          </li>
        </ul>
      </section>

      <section aria-labelledby="rules-captures">
        <h2 id="rules-captures">Captures</h2>
        <p>
          If you land on an opponent piece in the shared middle lane, it is captured and goes back
          to the start.
        </p>
      </section>

      <section aria-labelledby="rules-rosettes">
        <h2 id="rules-rosettes">Rosettes and safe squares</h2>
        <ul>
          <li>Rosette squares are on steps 4, 8 and 14.</li>
          <li>Landing on a rosette gives you another turn.</li>
          <li>
            The central rosette (step 8) is safe: a piece there cannot be captured, and your
            opponent cannot land on it.
          </li>
        </ul>
      </section>

      <section aria-labelledby="rules-passing">
        <h2 id="rules-passing">Passing</h2>
        <p>If you roll but have no legal move, your turn passes to the other player.</p>
      </section>

      <section aria-labelledby="rules-winning">
        <h2 id="rules-winning">Winning</h2>
        <p>The first player to bear off all seven pieces wins the game.</p>
      </section>

      <p>
        <Link href="/" className="link">
          Back to home
        </Link>
      </p>
    </main>
  );
}
