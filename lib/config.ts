/** App-wide constants. Import from here instead of repeating literals. */
export const appConfig = {
  name: "Royale game of ur",
  description: "A fun, animated web app for playing the Royal Game of Ur in the browser, starting with local human-vs-computer and same-device human-vs-human play. Phase 1 focuses on a polished local playable game with legal move enforcement, simple rule-based AI, win state, and accessible animations without paid gameplay API or LLM calls.",
} as const;

/** Page title in the form "Section · App". */
export function pageTitle(section?: string): string {
  return section ? `${section} · ${appConfig.name}` : appConfig.name;
}
