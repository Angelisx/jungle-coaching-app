// src/lib/jungle/data.ts
// Reference jungle timer + champion data (current as of researched patch).
// All times are in seconds from game start (0:00).

export type Side = "blue" | "red";
export type Lane = "top" | "mid" | "bot";
export type Archetype =
  | "level3_ganker"
  | "fast_clear_scaler"
  | "early_skirmisher"
  | "objective_focused"
  | "invader";

export interface CampTimer {
  key: string;
  label: string;
  initialSpawn: number; // seconds
  respawn: number; // seconds, time after clear
}

// Respawn times sourced from community timer references (small camps 2:15,
// buffs 5:00, scuttle 2:30 after first clear window, dragon 5:00, herald 8:00
// initial / 6:00 after, baron 20:00 initial / 6:00 after).
export const CAMPS: CampTimer[] = [
  { key: "blue", label: "Blue Sentinel", initialSpawn: 90, respawn: 300 },
  { key: "red", label: "Red Brambleback", initialSpawn: 90, respawn: 300 },
  { key: "gromp", label: "Gromp", initialSpawn: 90, respawn: 135 },
  { key: "krugs", label: "Krugs", initialSpawn: 90, respawn: 135 },
  { key: "raptors", label: "Raptors", initialSpawn: 90, respawn: 135 },
  { key: "wolves", label: "Wolves", initialSpawn: 90, respawn: 135 },
  { key: "scuttle", label: "Scuttle Crab", initialSpawn: 175, respawn: 150 },
  { key: "dragon", label: "Dragon", initialSpawn: 300, respawn: 300 },
  { key: "herald", label: "Rift Herald", initialSpawn: 480, respawn: 360 },
  { key: "baron", label: "Baron Nashor", initialSpawn: 1200, respawn: 360 },
];

export interface ChampionProfile {
  name: string;
  archetype: Archetype;
  /** Seconds to hit level 3, roughly, with a 3-camp path */
  level3Time: number;
  /** Full 6-camp clear time in seconds */
  fullClearTime: number;
  preferredLane: Lane | "either";
  notes: string;
}

export const CHAMPIONS: ChampionProfile[] = [
  { name: "Lee Sin", archetype: "level3_ganker", level3Time: 170, fullClearTime: 225, preferredLane: "mid", notes: "Strongest 3-camp gank window in the game; ults for vision/engage at level 3." },
  { name: "Vi", archetype: "level3_ganker", level3Time: 175, fullClearTime: 210, preferredLane: "either", notes: "Vault Breaker through walls lets you gank almost any lane off a 3-camp path." },
  { name: "Xin Zhao", archetype: "level3_ganker", level3Time: 170, fullClearTime: 220, preferredLane: "either", notes: "Three-hit passive + knockup at level 3 is a clean gank combo." },
  { name: "Elise", archetype: "early_skirmisher", level3Time: 175, fullClearTime: 215, preferredLane: "either", notes: "Rappel engage at level 3; also a strong invader vs scaling junglers." },
  { name: "Jarvan IV", archetype: "level3_ganker", level3Time: 170, fullClearTime: 220, preferredLane: "bot", notes: "EQ flag-and-drag combo is lethal with any lane CC follow-up." },
  { name: "Pantheon", archetype: "level3_ganker", level3Time: 175, fullClearTime: 225, preferredLane: "top", notes: "W stun into E leap is one of the hardest level-3 all-ins." },
  { name: "Wukong", archetype: "level3_ganker", level3Time: 175, fullClearTime: 220, preferredLane: "top", notes: "Decoy + knockup rewards an early gank before enemy wards it." },
  { name: "Viego", archetype: "early_skirmisher", level3Time: 175, fullClearTime: 220, preferredLane: "either", notes: "Snag a reset off any kill to chain into a second gank the same trip." },
  { name: "Warwick", archetype: "early_skirmisher", level3Time: 180, fullClearTime: 210, preferredLane: "either", notes: "Near-zero clear HP cost thanks to Q sustain; ult is a long-range gank tool once up." },
  { name: "Sejuani", archetype: "objective_focused", level3Time: 190, fullClearTime: 215, preferredLane: "either", notes: "Tankier clears; ganks are a setup for the next objective, not pure kill pressure." },
  { name: "Nunu & Willump", archetype: "objective_focused", level3Time: 195, fullClearTime: 205, preferredLane: "either", notes: "Consume-boosted clear is extremely fast; prioritizes scuttle/drake control over kills." },
  { name: "Ivern", archetype: "objective_focused", level3Time: 190, fullClearTime: 215, preferredLane: "either", notes: "Ganks are about the Daisy/Brush follow-up more than raw damage." },
  { name: "Graves", archetype: "fast_clear_scaler", level3Time: 190, fullClearTime: 195, preferredLane: "either", notes: "One of the fastest full clears in the game; smoke-screen ganks are a bonus, not the plan." },
  { name: "Karthus", archetype: "fast_clear_scaler", level3Time: 195, fullClearTime: 195, preferredLane: "either", notes: "Full clear every time; near-zero early gank value, scales instead." },
  { name: "Master Yi", archetype: "fast_clear_scaler", level3Time: 195, fullClearTime: 200, preferredLane: "either", notes: "Full clear to a fast item spike; only gank off a free opening." },
  { name: "Hecarim", archetype: "fast_clear_scaler", level3Time: 185, fullClearTime: 205, preferredLane: "top", notes: "Full clear then a fast rotation using E's movement speed stacking." },
  { name: "Kayn", archetype: "fast_clear_scaler", level3Time: 190, fullClearTime: 210, preferredLane: "either", notes: "Full clear to unlock Rhaast/Shadow Assassin form before committing to fights." },
  { name: "Amumu", archetype: "objective_focused", level3Time: 195, fullClearTime: 220, preferredLane: "either", notes: "Weak until level 6 ult; clear safe and look for an AoE stun opening." },
  { name: "Rengar", archetype: "invader", level3Time: 175, fullClearTime: 210, preferredLane: "either", notes: "Bush-jump ganks are strongest once a lane overextends near brush." },
  { name: "Kha'Zix", archetype: "invader", level3Time: 175, fullClearTime: 210, preferredLane: "either", notes: "Isolation-target ganks; wants to catch a split laner alone." },
];

export function findChampion(name: string): ChampionProfile | undefined {
  const n = name.trim().toLowerCase();
  return CHAMPIONS.find((c) => c.name.toLowerCase() === n);
}

/** Simple path graph: which camps connect to which gank lane on each side. */
export const SIDE_PATHS: Record<Side, { firstCamp: string; secondCamp: string; lane: Lane }[]> = {
  blue: [
    { firstCamp: "red", secondCamp: "krugs", lane: "mid" },
    { firstCamp: "red", secondCamp: "krugs", lane: "bot" },
    { firstCamp: "blue", secondCamp: "gromp", lane: "top" },
    { firstCamp: "blue", secondCamp: "wolves", lane: "mid" },
  ],
  red: [
    { firstCamp: "blue", secondCamp: "gromp", lane: "top" },
    { firstCamp: "red", secondCamp: "krugs", lane: "mid" },
    { firstCamp: "red", secondCamp: "raptors", lane: "bot" },
    { firstCamp: "blue", secondCamp: "wolves", lane: "mid" },
  ],
};
