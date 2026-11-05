import { useState } from "react";
import { ErrorBoundary } from "@mwakidenis/logx-react/components/ErrorBoundary";
import ArrayTransformer from "./components/ArrayTransformer";
import JsonInspector from "./components/JsonInspector";
import StatsCalculator from "./components/StatsCalculator";

type Tool = "array" | "json" | "stats";

interface ToolDef {
  label: string;
  icon: string;
  component: () => JSX.Element;
}

const TOOLS: Record<Tool, ToolDef> = {
  array: { label: "Array & Text Transformer", icon: "bi-sliders", component: ArrayTransformer },
  json: { label: "Object & JSON Inspector", icon: "bi-file-earmark-text", component: JsonInspector },
  stats: { label: "Statistical Calculator", icon: "bi-calculator", component: StatsCalculator },
};

export function App(): JSX.Element {
  const [activeTool, setActiveTool] = useState<Tool>("array");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const Component = TOOLS[activeTool].component;
  const tool = TOOLS[activeTool];

  const fallback = (error: Error, reset: () => void) => (
    <div style={{ padding: 24, color: "#dc3545", textAlign: "center", background: "#fff", border: "1px solid #dee2e6", borderRadius: "0.375rem" }}>
      <h2 style={{ marginBottom: 12 }}>Toolkit Error</h2>
      <p style={{ marginBottom: 16 }}>{error.message}</p>
      <button onClick={reset} className="btn btn-primary">Restart Toolkit</button>
    </div>
  );

  return (
    <ErrorBoundary fallback={fallback}>
      <div className="app-wrapper">
        {/* Header — top right only */}
        <header className="app-header">
          <div className="container-fluid">
            <ul className="navbar-nav">
              <li className="nav-item">
                <button
                  className="nav-link"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  aria-label="Toggle sidebar"
                >
                  <i className="bi bi-list"></i>
                </button>
              </li>
            </ul>

            <form className="navbar-search" role="search">
              <label className="visually-hidden">Search</label>
              <div className="navbar-search-field">
                <input type="search" className="input-field" placeholder="Search…" autoComplete="off" />
                <button className="nav-link navbar-search-submit" type="submit" aria-label="Submit search">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>

            <ul className="navbar-nav navbar-end">
              <li className="nav-item">
                <button className="nav-link notice" aria-label="Notifications: 1 unread">
                  <i className="bi bi-bell"></i>
                  <span className="navbar-badge badge badge-danger">1</span>
                </button>
              </li>
              <li className="nav-item">
                <div className="user-profile">
                  <div className="user-avatar">MD</div>
                  <div className="user-info">
                    <div className="user-name">Mwaki Denis</div>
                    <div className="user-role">Toolkit Administrator</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </header>

        {/* Sidebar — spans all rows */}
        <aside className={`app-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-brand">
            <a href="#" className="brand-link" onClick={(e) => e.preventDefault()}>
              <i className="bi bi-grid-1x2 brand-image" style={{ color: "#0d6efd", fontSize: "1.5rem" }}></i>
              <div className="brand-text-wrap">
                <div className="brand-text">DataForge Toolkit</div>
                <div className="brand-sub">Utility Dashboard</div>
              </div>
            </a>
          </div>

          <div className="sidebar-search" role="search">
            <label className="visually-hidden">Filter menu</label>
            <input type="search" className="input-field" placeholder="Filter menu…" autoComplete="off" />
            <i className="bi bi-search"></i>
          </div>

          <div className="sidebar-wrapper">
            <nav aria-label="Main navigation">
              <ul className="nav sidebar-menu flex-column">
                {Object.entries(TOOLS).map(([key, def]) => (
                  <li key={key} className="nav-item">
                    <a
                      className={`nav-link ${activeTool === key ? "active" : ""}`}
                      href="#"
                      onClick={(e) => { e.preventDefault(); setActiveTool(key as Tool); setSidebarOpen(false); }}
                    >
                      <i className={`nav-icon bi ${def.icon}`}></i>
                      <p>{def.label}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main content — middle right */}
        <main className="app-main">
          <div className="app-content-header">
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-6">
                  <h1 className="mb-0 fs-3">{tool.label}</h1>
                  <p className="mb-0 text-secondary fs-7">Powered by @mwakidenis/logx and @mwakidenis/logx-react</p>
                </div>
                <div className="col-sm-6">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb float-sm-end">
                      <li className="breadcrumb-item"><a href="#" onClick={(e) => e.preventDefault()}>Home</a></li>
                      <li className="breadcrumb-item active" aria-current="page">{tool.label}</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          <div className="app-content">
            <div className="container-fluid">
              <Component />
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
