# Jungle Coach

A lightweight League of Legends jungle coaching tool — v1 MVP for SORA-13.

Pick a champion, your starting side of the map, and a target lane, and get a
suggested gank path + timing rationale based on known jungle camp respawn
timers and champion power-spike archetypes.

## What it does (v1)

- 20-champion reference table (archetype, level-3 timing, full-clear timing, preferred lane)
- Camp respawn timer data (blue/red buff, small camps, scuttle, dragon, herald, baron)
- Deterministic gank-path suggestion engine (`src/lib/jungle/suggest.ts`) — pure functions, fully unit tested, zero network calls
- Simple React + Vite UI, dark themed

## What it deliberately doesn't do yet

- No live game data / Riot API integration (Spectator API, DDragon) — that's the natural v2
- No 1v1 win-odds calculator
- No item recommendations or team comp analysis

## Stack

React + TypeScript + Vite, deployed to Netlify.

## Dev

```
npm install
npm run dev      # local dev server
npm run build    # production build
npx vitest run   # unit tests (15 tests against known reference timer values)
```
