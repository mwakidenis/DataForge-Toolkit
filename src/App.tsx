import { useState } from "react";
import { ErrorBoundary } from "@mwakidenis/logx-react/components/ErrorBoundary";
import ArrayTransformer from "./components/ArrayTransformer";
import JsonInspector from "./components/JsonInspector";
import StatsCalculator from "./components/StatsCalculator";

type Tool = "array" | "json" | "stats";

const TOOLS: Record<Tool, { label: string; component: () => JSX.Element }> = {
  array: { label: "Array & Text Transformer", component: ArrayTransformer },
  json: { label: "Object & JSON Inspector", component: JsonInspector },
  stats: { label: "Statistical Calculator", component: StatsCalculator },
};

export function App(): JSX.Element {
  const [activeTool, setActiveTool] = useState<Tool>("array");
  const Component = TOOLS[activeTool].component;

  const fallback = (error: Error, reset: () => void) => (
    <div style={{ padding: 24, color: "#991b1b", textAlign: "center" }}>
      <h2>Toolkit Error</h2>
      <p>{error.message}</p>
      <button onClick={reset} style={{ marginTop: 12, padding: "8px 16px" }}>
        Restart Toolkit
      </button>
    </div>
  );

  return (
    <ErrorBoundary fallback={fallback}>
      <div className="app">
        <header className="header">
          <h1>DataForge Toolkit</h1>
          <p>Powered by @mwakidenis/logx and @mwakidenis/logx-react</p>
        </header>
        <nav className="nav">
          {Object.entries(TOOLS).map(([key, tool]) => (
            <button
              key={key}
              className={activeTool === key ? "active" : ""}
              onClick={() => setActiveTool(key as Tool)}
            >
              {tool.label}
            </button>
          ))}
        </nav>
        <main className="main">
          <Component />
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
