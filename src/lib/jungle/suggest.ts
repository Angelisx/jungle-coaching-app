// src/lib/jungle/suggest.ts
// Pure, deterministic gank-path suggestion logic. No network calls.

import { CAMPS, CHAMPIONS, SIDE_PATHS, findChampion, type Lane, type Side } from "./data";

export interface GankSuggestion {
  champion: string;
  side: Side;
  archetype: string;
  recommendedLane: Lane;
  level3Time: number; // seconds
  level3TimeLabel: string;
  pathSteps: string[];
  rationale: string;
  campTimingNotes: string[];
  alternativeIfBehind: string;
}

export function secondsToClock(total: number): string {
  const m = Math.floor(total / 60);
  const s = Math.round(total % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export function nextRespawn(campKey: string, afterClearTime: number): number {
  const camp = CAMPS.find((c) => c.key === campKey);
  if (!camp) return NaN;
  return afterClearTime + camp.respawn;
}

/**
 * Core suggestion engine. Given a champion name, side of map, and the lane
 * the player wants ganked (or "auto" to pick the champion's best lane),
 * returns a structured gank path + timing suggestion.
 */
export function suggestGankPath(
  championName: string,
  side: Side,
  requestedLane: Lane | "auto" = "auto"
): GankSuggestion | { error: string } {
  const champ = findChampion(championName);
  if (!champ) {
    return {
      error: `Unknown champion "${championName}". Try one of: ${CHAMPIONS.map((c) => c.name).join(", ")}`,
    };
  }

  const lane: Lane =
    requestedLane === "auto"
      ? champ.preferredLane === "either"
        ? "mid"
        : champ.preferredLane
      : requestedLane;

  const sidePaths = SIDE_PATHS[side];
  const match =
    sidePaths.find((p) => p.lane === lane) ?? sidePaths[0]; // fallback to first path on that side

  const pathSteps = [
    `Start: ${capitalize(match.firstCamp)}`,
    `Clear: ${capitalize(match.secondCamp)}`,
    `Gank: ${lane.toUpperCase()} lane`,
  ];

  const campTimingNotes = [
    `Camps spawn at 1:30. Expect level 3 around ${secondsToClock(champ.level3Time)}.`,
    `A full 6-camp clear for ${champ.name} runs roughly ${secondsToClock(champ.fullClearTime)}.`,
    `Scuttle crab spawns ~2:55/2:30 depending on side — worth a vision check before committing to the gank.`,
  ];

  let rationale: string;
  switch (champ.archetype) {
    case "level3_ganker":
      rationale = `${champ.name} spikes hard at level 3. Take the 3-camp path (${pathSteps[0]} → ${pathSteps[1]}) and look to gank ${lane} the moment you hit level 3 — don't full clear, you lose your window.`;
      break;
    case "early_skirmisher":
      rationale = `${champ.name} can gank or invade off a 3-camp path. If the enemy jungler is visible on the opposite side of the map, prioritize the gank; otherwise consider invading their camps instead.`;
      break;
    case "fast_clear_scaler":
      rationale = `${champ.name} wants the full 6-camp clear before doing anything else — ganking this early sacrifices your biggest advantage (clear speed). Only take this gank if it's a free, no-risk kill.`;
      break;
    case "objective_focused":
      rationale = `${champ.name} should treat this gank as a setup for the next objective (scuttle/dragon), not a pure kill. Ward the river before committing.`;
      break;
    case "invader":
      rationale = `${champ.name} wants to catch an isolated target. Only take this gank path if the ${lane} laner is overextended alone — otherwise consider invading the enemy jungle instead.`;
      break;
  }

  const alternativeIfBehind =
    champ.archetype === "fast_clear_scaler"
      ? "If you're behind on CS, skip this gank entirely and finish your full clear — your value comes from scaling, not an early kill."
      : "If this gank fails or the enemy jungler counter-ganks, fall back to clearing your second quadrant rather than forcing a second attempt.";

  return {
    champion: champ.name,
    side,
    archetype: champ.archetype,
    recommendedLane: lane,
    level3Time: champ.level3Time,
    level3TimeLabel: secondsToClock(champ.level3Time),
    pathSteps,
    rationale,
    campTimingNotes,
    alternativeIfBehind,
  };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
