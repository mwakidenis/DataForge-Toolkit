import { useCallback, useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { CopyButton } from "../ui/CopyButton";
import {
  safeParseJson,
  deepGet,
  deepSet,
  deepCloneJson,
  pickOmitKeys,
  validateJsonStructure,
  type JsonObject,
} from "../services/jsonService";

export function JsonInspector(): JSX.Element {
  const [jsonInput, setJsonInput] = useLocalStorage<string>("dataforge:json-input", '{\n  "user": {\n    "name": "Ada Lovelace",\n    "age": 36,\n    "tags": ["math", "computing"]\n  }\n}');
  const [path, setPath] = useState<string>("user.name");
  const [setValue, setSetValue] = useState<string>("Grace Hopper");
  const [pickKeys, setPickKeys] = useState<string>("name, age");
  const [omitKeys, setOmitKeys] = useState<string>("tags");
  const [viewMode, setViewMode] = useState<"raw" | "tree">("raw");

  const [recentSnippets, setRecentSnippets] = useLocalStorage<string[]>("dataforge:json-snippets", []);

  const parseResult = useMemo(() => safeParseJson(jsonInput), [jsonInput]);

  const addSnippet = useCallback((snippet: string) => {
    setRecentSnippets((prev: string[]) => {
      const filtered = prev.filter((s: string) => s !== snippet);
      return [snippet, ...filtered].slice(0, 10);
    });
  }, [setRecentSnippets]);

  const parsed = parseResult.ok ? parseResult.data : null;
  const canSave = parsed !== null;

  const getResult = useMemo(() => {
    if (!parsed) return { ok: false, error: "Invalid JSON", code: "INVALID_JSON" } as const;
    return deepGet(parsed, path);
  }, [parsed, path]);

  const setResult = useMemo(() => {
    if (!parsed) return { ok: false, error: "Invalid JSON", code: "INVALID_JSON" } as const;
    return deepSet(parsed as JsonObject, path, setValue);
  }, [parsed, path, setValue]);

  const cloneResult = useMemo(() => {
    if (!parsed) return { error: "Invalid JSON" as const };
    try {
      return { value: deepCloneJson(parsed) };
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }, [parsed]);

  const pickKeysArray = pickKeys.split(",").map((k: string) => k.trim()).filter(Boolean);
  const omitKeysArray = omitKeys.split(",").map((k: string) => k.trim()).filter(Boolean);

  const pickOmitResult = useMemo(() => {
    if (!parsed) return { ok: false, error: "Invalid JSON", code: "INVALID_JSON" } as const;
    return pickOmitKeys(parsed as JsonObject, pickKeysArray, omitKeysArray);
  }, [parsed, pickKeysArray, omitKeysArray]);

  const structureValidation = useMemo(() => {
    if (!parsed) return { valid: false, errors: ["Invalid JSON"] as string[] };
    return validateJsonStructure(parsed);
  }, [parsed]);

  const handleJsonChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
  }, [setJsonInput]);

  const handleLoadSnippet = useCallback((snippet: string) => {
    setJsonInput(snippet);
  }, [setJsonInput]);

  const renderJsonValue = (value: unknown, depth: number = 0): JSX.Element => {
    const indent = depth * 20;
    if (value === null) {
      return <span key="null" style={{ color: "#8be9fd" }}>null</span>;
    }
    if (typeof value === "boolean") {
      return <span key="bool" style={{ color: "#ff79c6" }}>{String(value)}</span>;
    }
    if (typeof value === "number") {
      return <span key="num" style={{ color: "#ffa7c4" }}>{value}</span>;
    }
    if (typeof value === "string") {
      return <span key="str" style={{ color: "#b5f4a5" }}>"{value}"</span>;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return <span key="arr" style={{ color: "#9dcdff" }}>[]</span>;
      return (
        <div key="arr" style={{ marginLeft: indent }}>
          <span style={{ color: "#9dcdff" }}>[</span>
          {value.map((item, i) => (
            <div key={i} style={{ marginLeft: 12 }}>
              {renderJsonValue(item, depth + 1)}
              {i < value.length - 1 && <span>,</span>}
            </div>
          ))}
          <span style={{ color: "#9dcdff" }}>]</span>
        </div>
      );
    }
    if (typeof value === "object") {
      const keys = Object.keys(value as Record<string, unknown>);
      if (keys.length === 0) return <span key="obj" style={{ color: "#9dcdff" }}>{"{}"}</span>;
      return (
        <div key="obj" style={{ marginLeft: indent }}>
          <span style={{ color: "#9dcdff" }}>{"{"}</span>
          {keys.map((key) => (
            <div key={key} style={{ marginLeft: 12 }}>
              <span style={{ color: "#9dcdff" }}>"{key}"</span>: {renderJsonValue((value as Record<string, unknown>)[key], depth + 1)},{" "}
            </div>
          ))}
          <span style={{ color: "#9dcdff" }}>{"}"}</span>
        </div>
      );
    }
    return <span key="other" style={{ color: "#6c757d" }}>{String(value)}</span>;
  };

  return (
    <section className="section-card">
      <div className="card-header">
        <div className="card-title">Object & JSON Inspector</div>
        <div className="card-tools">
          <label style={{ fontSize: "0.75rem", fontWeight: 600, marginRight: 0.5, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6c757d" }}>View:</label>
          <div style={{ display: "flex", gap: 0.25 }}>
            <button
              className={`btn btn-sm ${viewMode === "raw" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setViewMode("raw")}
            >
              Raw
            </button>
            <button
              className={`btn btn-sm ${viewMode === "tree" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setViewMode("tree")}
            >
              Tree
            </button>
          </div>
          <button className="btn btn-outline btn-sm" disabled={!canSave} onClick={() => addSnippet(jsonInput)}>Save snippet</button>
        </div>
      </div>
      <div className="card-body">
        <div className="field-row">
          <div className="field-col" style={{ flex: 1.5 }}>
            <div className="field-label">JSON input</div>
            <textarea className="input-field" value={jsonInput} onChange={handleJsonChange} rows={8} />
            {!parseResult.ok && (
              <div className="tip" style={{ color: "#dc3545", marginTop: 0.375 }}>
                Invalid JSON — {parseResult.error}
              </div>
            )}
            {structureValidation.valid === false && structureValidation.errors.length > 0 && (
              <div className="tip" style={{ color: "#dc3545", marginTop: 0.375 }}>
                {structureValidation.errors.join(", ")}
              </div>
            )}
          </div>
          <div className="field-col" style={{ flex: 1 }}>
            <div className="field-label">Deep path</div>
            <input className="input-field" type="text" value={path} onChange={(e) => setPath(e.target.value)} placeholder="e.g. user.tags[0]" />
          </div>
        </div>

        <div className="four-col">
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">Deep get</div>
              <div className="output-block">
                {getResult.ok ? JSON.stringify(getResult.data, null, 2) : `Error: ${getResult.error}`}
              </div>
              <div className="output-actions">
                <CopyButton text={getResult.ok ? JSON.stringify(getResult.data, null, 2) : ""} />
              </div>
            </div>
          </div>
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">Deep set</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 0.375 }}>
                <input className="input-field" type="text" value={setValue} onChange={(e) => setSetValue(e.target.value)} placeholder="set value" style={{ flex: 1 }} />
              </div>
              <div className="output-block">
                {setResult.ok ? JSON.stringify(setResult.data, null, 2) : `Error: ${setResult.error}`}
              </div>
              <div className="output-actions">
                <CopyButton text={setResult.ok ? JSON.stringify(setResult.data, null, 2) : ""} />
              </div>
            </div>
          </div>
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">Deep clone</div>
              <div className="output-block">
                {cloneResult.error ? `Error: ${cloneResult.error}` : JSON.stringify(cloneResult.value, null, 2)}
              </div>
              <div className="output-actions">
                <CopyButton text={cloneResult.error ? "" : JSON.stringify(cloneResult.value, null, 2)} />
              </div>
            </div>
          </div>
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">Pick / Omit</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 0.375 }}>
                <input className="input-field" type="text" value={pickKeys} onChange={(e) => setPickKeys(e.target.value)} placeholder="pick keys" style={{ flex: 1 }} />
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 0.375 }}>
                <input className="input-field" type="text" value={omitKeys} onChange={(e) => setOmitKeys(e.target.value)} placeholder="omit keys" style={{ flex: 1 }} />
              </div>
              <div style={{ display: "flex", gap: 0.75 }}>
                <button className="btn btn-primary btn-sm" onClick={() => pickOmitResult.ok && navigator.clipboard.writeText(JSON.stringify(pickOmitResult.data.picked, null, 2))}>Copy picked</button>
                <button className="btn btn-outline btn-sm" onClick={() => pickOmitResult.ok && navigator.clipboard.writeText(JSON.stringify(pickOmitResult.data.omitted, null, 2))}>Copy omitted</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.75, marginTop: 0.5 }}>
                <div style={{ border: "1px solid #dee2e6", borderRadius: 4, padding: "0.5rem", background: "#f8f9fa" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6c757d", marginBottom: 0.375 }}>Picked</div>
                  <div className="output-block" style={{ maxHeight: 140, marginBottom: 0 }}>{pickOmitResult.ok ? JSON.stringify(pickOmitResult.data.picked, null, 2) : `Error: ${pickOmitResult.error}`}</div>
                </div>
                <div style={{ border: "1px solid #dee2e6", borderRadius: 4, padding: "0.5rem", background: "#f8f9fa" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6c757d", marginBottom: 0.375 }}>Omitted</div>
                  <div className="output-block" style={{ maxHeight: 140, marginBottom: 0 }}>{pickOmitResult.ok ? JSON.stringify(pickOmitResult.data.omitted, null, 2) : `Error: ${pickOmitResult.error}`}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-card" style={{ marginTop: "1.25rem", border: "none", boxShadow: "none" }}>
          <div className="card-header">
            <div className="card-title">
              <i className="bi bi-journals me-2"></i> Recent snippets (localStorage)
            </div>
          </div>
          <div className="card-body">
            {recentSnippets.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-journal-text" style={{ fontSize: "2.5rem" }}></i>
                <h3>No saved snippets yet</h3>
                <p>Save JSON snippets to localStorage to reuse them here.</p>
              </div>
            ) : (
              <div style={{ border: "1px solid #dee2e6", borderRadius: 4, background: "#fff" }}>
                {recentSnippets.map((snippet: string, i: number) => (
                  <div key={i} style={{ padding: 0.75, borderBottom: i < recentSnippets.length - 1 ? "1px solid #e9ecef" : "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.2s" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#e7f1ff"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }} onClick={() => handleLoadSnippet(snippet)}>
                    <span style={{ fontSize: 0.8, fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, monospace", color: "#212529", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={snippet}>{snippet.length > 60 ? snippet.slice(0, 60) + "…" : snippet}</span>
                    <span className="badge badge-secondary">{i + 1}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {viewMode === "tree" && parsed && (
          <div className="section-card" style={{ marginTop: "1.25rem", border: "none", boxShadow: "none" }}>
            <div className="card-header">
              <div className="card-title">Tree View</div>
            </div>
            <div className="card-body">
              <div style={{ border: "1px solid #dee2e6", borderRadius: 4, padding: 1, background: "#f8f9fa", maxHeight: 400, overflowY: "auto" }}>
                {renderJsonValue(parsed)}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default JsonInspector;
