import { describe, it, expect } from "vitest";
import { secondsToClock, suggestGankPath, nextRespawn } from "./suggest";
import { findChampion, CAMPS } from "./data";

describe("secondsToClock", () => {
  it("formats whole minutes", () => {
    expect(secondsToClock(90)).toBe("1:30");
  });
  it("pads single-digit seconds", () => {
    expect(secondsToClock(65)).toBe("1:05");
  });
  it("handles zero", () => {
    expect(secondsToClock(0)).toBe("0:00");
  });
});

describe("nextRespawn", () => {
  it("computes blue buff respawn (5:00 after clear)", () => {
    // Cleared at 1:40 (100s) -> respawns at 1:40 + 5:00 = 6:40 (400s)
    expect(nextRespawn("blue", 100)).toBe(400);
  });
  it("computes small camp respawn (2:15 after clear)", () => {
    expect(nextRespawn("krugs", 100)).toBe(235);
  });
  it("returns NaN for unknown camp", () => {
    expect(Number.isNaN(nextRespawn("not-a-camp", 100))).toBe(true);
  });
});

describe("CAMPS reference data", () => {
  it("has correct initial spawn times (1:30 for all basic camps)", () => {
    const basic = CAMPS.filter((c) => ["blue", "red", "gromp", "krugs", "raptors", "wolves"].includes(c.key));
    for (const c of basic) {
      expect(c.initialSpawn).toBe(90);
    }
  });
  it("has correct Baron initial spawn (20:00)", () => {
    expect(CAMPS.find((c) => c.key === "baron")?.initialSpawn).toBe(1200);
  });
  it("has correct Herald initial spawn (8:00)", () => {
    expect(CAMPS.find((c) => c.key === "herald")?.initialSpawn).toBe(480);
  });
});

describe("findChampion", () => {
  it("is case-insensitive", () => {
    expect(findChampion("lee sin")?.name).toBe("Lee Sin");
    expect(findChampion("LEE SIN")?.name).toBe("Lee Sin");
  });
  it("returns undefined for unknown champions", () => {
    expect(findChampion("Not A Real Champ")).toBeUndefined();
  });
});

describe("suggestGankPath", () => {
  it("returns an error for an unknown champion", () => {
    const result = suggestGankPath("Fakemon", "blue");
    expect("error" in result).toBe(true);
  });

  it("builds a 3-camp gank path for a level-3 ganker (Lee Sin)", () => {
    const result = suggestGankPath("Lee Sin", "blue", "mid");
    if ("error" in result) throw new Error("unexpected error");
    expect(result.champion).toBe("Lee Sin");
    expect(result.recommendedLane).toBe("mid");
    expect(result.pathSteps).toHaveLength(3);
    expect(result.pathSteps[2]).toContain("MID");
    expect(result.rationale).toMatch(/level 3/i);
  });

  it("recommends a full clear rationale for fast-clear scalers (Karthus)", () => {
    const result = suggestGankPath("Karthus", "red", "auto");
    if ("error" in result) throw new Error("unexpected error");
    expect(result.archetype).toBe("fast_clear_scaler");
    expect(result.rationale).toMatch(/full.*clear/i);
    expect(result.alternativeIfBehind).toMatch(/full clear/i);
  });

  it("auto-picks the champion's preferred lane when lane is 'auto'", () => {
    const result = suggestGankPath("Jarvan IV", "red", "auto");
    if ("error" in result) throw new Error("unexpected error");
    expect(result.recommendedLane).toBe("bot"); // Jarvan IV's preferredLane
  });
});
