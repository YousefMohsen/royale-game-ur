import type { Player } from "@/lib/game";

export type RollDisplay = Readonly<{ value: number; player: Player; id: number }>;

/** Four pyramid dice in a carved tray; marked tips count toward the roll. */
export function DiceTray({
  roll,
  rolling,
  canRoll,
  onRoll,
  hint,
  rollerName,
}: Readonly<{
  roll: RollDisplay | undefined;
  rolling: boolean;
  canRoll: boolean;
  onRoll: () => void;
  hint: string;
  rollerName: string | undefined;
}>) {
  const shown = rolling ? undefined : roll;
  return (
    <div className="dice-tray" data-rolling={rolling || undefined} data-testid="dice-tray">
      <div className="dice-bed" aria-hidden="true">
        <div key={roll?.id ?? "none"} className={`dice${rolling ? " dice-rolling" : ""}${shown ? " dice-settled" : ""}`}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`die${shown && i < shown.value ? " die-marked" : ""}`} style={{ "--die-index": i } as React.CSSProperties}>
              <span className="die-tip" />
            </span>
          ))}
        </div>
      </div>
      <div className="dice-info">
        {shown ? (
          <p className="roll-result" data-testid="roll-result">
            Roll: {shown.value}
          </p>
        ) : (
          <p className="roll-result roll-result-empty" data-testid="roll-result-empty">
            {rolling ? "Rolling…" : "No roll yet"}
          </p>
        )}
        {shown && rollerName && <p className="muted dice-roller">{rollerName} rolled {shown.value === 0 ? "no marked tips" : `${shown.value} marked ${shown.value === 1 ? "tip" : "tips"}`}</p>}
        <p className="muted dice-hint">{hint}</p>
        <button type="button" className="control control-primary dice-button" onClick={onRoll} disabled={!canRoll}>
          Roll dice
        </button>
      </div>
    </div>
  );
}
