import { useState } from "react";
import { ErrorBoundary } from "@mwakidenis/logx-react/components/ErrorBoundary";
import ArrayTransformer from "./components/ArrayTransformer";
import JsonInspector from "./components/JsonInspector";
import StatsCalculator from "./components/StatsCalculator";

type Tool = "array" | "json" | "stats";

interface ToolDef {
  label: string;
  icon: string;
  badge?: string;
  component: () => JSX.Element;
}

const TOOLS: Record<Tool, ToolDef> = {
  array: {
    label: "Array & Text Transformer",
    icon: "↔",
    component: ArrayTransformer,
  },
  json: {
    label: "Object & JSON Inspector",
    icon: "{}",
    component: JsonInspector,
  },
  stats: {
    label: "Statistical Calculator",
    icon: "Σ",
    component: StatsCalculator,
  },
};

export function App(): JSX.Element {
  const [activeTool, setActiveTool] = useState<Tool>("array");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const Component = TOOLS[activeTool].component;
  const tool = TOOLS[activeTool];

  const fallback = (error: Error, reset: () => void) => (
    <div style={{ padding: 40, color: "#dc3545", textAlign: "center", background: "#fff", borderRadius: 8, border: "1px solid #dee2e6" }}>
      <h2 style={{ marginBottom: 12 }}>Toolkit Error</h2>
      <p style={{ marginBottom: 16 }}>{error.message}</p>
      <button onClick={reset} className="btn btn-primary">Restart Toolkit</button>
    </div>
  );

  return (
    <ErrorBoundary fallback={fallback}>
      <div className="app">
        {/* Header */}
        <header className="app-header">
          <div className="brand">
            <div className="brand-link">
              <div className="brand-image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#0d6efd" }}>
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <div className="brand-text-wrap">
                <div className="brand-text">DataForge Toolkit</div>
                <div className="brand-sub">Utility Dashboard</div>
              </div>
            </div>
            <button
              className="notice"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="header-actions">
            <div className="search-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" className="input-field" placeholder="Search tools &amp; utilities" />
            </div>
            <div className="notice">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="badge badge-danger">1</span>
            </div>
            <div className="user-profile">
              <div className="user-avatar">MD</div>
              <div className="user-info">
                <div className="user-name">Mwaki Denis</div>
                <div className="user-role">Toolkit Administrator</div>
              </div>
              <svg className="user-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <aside className={`app-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-brand">
            <div className="brand-link">
              <div className="brand-image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#0d6efd" }}>
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <div className="brand-text-wrap">
                <div className="brand-text">DataForge</div>
              </div>
            </div>
          </div>

          <div className="sidebar-wrapper">
            <div className="nav-header">Tools</div>
            <ul className="nav-list">
              {Object.entries(TOOLS).map(([key, def]) => (
                <li key={key} className="nav-item">
                  <a
                    className={`nav-link ${activeTool === key ? "active" : ""}`}
                    onClick={() => {
                      setActiveTool(key as Tool);
                      setSidebarOpen(false);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {def.icon === "↔" ? (
                        <>
                          <line x1="8" y1="12" x2="16" y2="12"></line>
                          <line x1="12" y1="8" x2="12" y2="16"></line>
                        </>
                      ) : def.icon === "{}" ? (
                        <path d="M21 7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      ) : (
                        <>
                          <polygon points="20.63 3 16 3 16 8 20.63 8"></polygon>
                          <path d="M3 16l5-5 5 5-5 5"></path>
                        </>
                      )}
                    </svg>
                    <p>{def.label}</p>
                  </a>
                </li>
              ))}
            </ul>

            <div className="nav-divider"></div>
            <div className="nav-header">System</div>
            <ul className="nav-list">
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={(e) => e.preventDefault()}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="2" x2="12" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line>
                  </svg>
                  <p>Dashboard</p>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={(e) => e.preventDefault()}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <p>Settings</p>
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <main className="app-main">
          <div className="app-content">
            <header className="content-header">
              <div>
                <div className="content-title">{tool.label}</div>
                <div className="content-subtitle">Powered by @mwakidenis/logx &amp; @mwakidenis/logx-react</div>
              </div>
              <div className="content-actions">
                <button className="btn btn-primary" onClick={() => window.location.reload()}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 4v6h6"></path><path d="M23 20v-6h-6"></path><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                  </svg>
                </button>
              </div>
            </header>
            <nav className="breadcrumb">
              <ol>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Home</a></li>
                <li>{tool.label}</li>
              </ol>
            </nav>
            <Component />
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
