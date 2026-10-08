import { useState } from "react";
import "./index.css";
import { CHAMPIONS, type Lane, type Side } from "./lib/jungle/data";
import { suggestGankPath, type GankSuggestion } from "./lib/jungle/suggest";

function App() {
  const [championName, setChampionName] = useState(CHAMPIONS[0].name);
  const [side, setSide] = useState<Side>("blue");
  const [lane, setLane] = useState<Lane | "auto">("auto");
  const [result, setResult] = useState<GankSuggestion | { error: string } | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(suggestGankPath(championName, side, lane));
  }

  return (
    <>
      <h1>🌿 Jungle Coach</h1>
      <p className="subtitle">
        Pick your champion, side of the map, and target lane — get a gank path and timing
        suggestion based on known camp respawn timers and champion power spikes.
      </p>

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <label htmlFor="champion">Champion</label>
            <select id="champion" value={championName} onChange={(e) => setChampionName(e.target.value)}>
              {CHAMPIONS.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="side">Starting side</label>
            <select id="side" value={side} onChange={(e) => setSide(e.target.value as Side)}>
              <option value="blue">Blue side</option>
              <option value="red">Red side</option>
            </select>
          </div>
          <div>
            <label htmlFor="lane">Target lane</label>
            <select id="lane" value={lane} onChange={(e) => setLane(e.target.value as Lane | "auto")}>
              <option value="auto">Auto (champion's best lane)</option>
              <option value="top">Top</option>
              <option value="mid">Mid</option>
              <option value="bot">Bot</option>
            </select>
          </div>
        </div>
        <button type="submit" className="primary">
          Suggest gank path
        </button>
      </form>

      {result && "error" in result && (
        <div className="card">
          <p className="error-text">{result.error}</p>
        </div>
      )}

      {result && !("error" in result) && <ResultCard result={result} />}

      <footer>
        Jungle Coach v1 — gank path suggestions from static reference timers, no live game data.
        Built for SORA-13.
      </footer>
    </>
  );
}

function ResultCard({ result }: { result: GankSuggestion }) {
  return (
    <div className="card">
      <div className="result-header">
        <h2>
          {result.champion} — {result.recommendedLane.toUpperCase()} gank
        </h2>
        <span className="badge">Level 3 at {result.level3TimeLabel}</span>
      </div>

      <div className="path-steps">
        {result.pathSteps.map((step, i) => (
          <>
            {i > 0 && <span className="path-arrow">→</span>}
            <span key={step} className="path-step">
              {step}
            </span>
          </>
        ))}
      </div>

      <p className="rationale">{result.rationale}</p>

      <ul className="notes-list">
        {result.campTimingNotes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>

      <p className="alternative">⚠ {result.alternativeIfBehind}</p>
    </div>
  );
}

export default App;
