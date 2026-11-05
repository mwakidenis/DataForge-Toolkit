import { useCallback, useMemo, useState } from "react";
import { get, set, deepClone, pick, omit } from "@mwakidenis/logx/object";
import { useLocalStorage } from "@mwakidenis/logx-react/hooks/useLocalStorage";
import { CopyButton } from "@mwakidenis/logx-react/components/CopyButton";

export function JsonInspector(): JSX.Element {
  const [jsonInput, setJsonInput] = useState<string>('{\n  "user": {\n    "name": "Ada Lovelace",\n    "age": 36,\n    "tags": ["math", "computing"]\n  }\n}');
  const [path, setPath] = useState<string>("user.name");
  const [setValue, setSetValue] = useState<string>("Grace Hopper");
  const [pickKeys, setPickKeys] = useState<string>("name, age");
  const [omitKeys, setOmitKeys] = useState<string>("tags");

  const [recentSnippets, setRecentSnippets] = useLocalStorage<string[]>("dataforge:json-snippets", []);

  const parsed = useMemo(() => {
    try { return JSON.parse(jsonInput); } catch { return null; }
  }, [jsonInput]);

  const addSnippet = useCallback((snippet: string) => {
    setRecentSnippets((prev: string[]) => {
      const filtered = prev.filter((s: string) => s !== snippet);
      return [snippet, ...filtered].slice(0, 10);
    });
  }, [setRecentSnippets]);

  const getResult = useMemo(() => {
    if (!parsed) return { error: "Invalid JSON" as const };
    try { return { value: get(parsed, path) }; } catch (e) { return { error: e instanceof Error ? e.message : String(e) }; }
  }, [parsed, path]);

  const setResult = useMemo(() => {
    if (!parsed) return { error: "Invalid JSON" as const };
    try {
      const cloned = deepClone(parsed);
      const next = set(cloned, path, setValue);
      return { value: next };
    } catch (e) { return { error: e instanceof Error ? e.message : String(e) }; }
  }, [parsed, path, setValue]);

  const cloneResult = useMemo(() => {
    if (!parsed) return { error: "Invalid JSON" as const };
    try { return { value: deepClone(parsed) }; } catch (e) { return { error: e instanceof Error ? e.message : String(e) }; }
  }, [parsed]);

  const pickKeysArray = pickKeys.split(",").map((k: string) => k.trim()).filter(Boolean);
  const omitKeysArray = omitKeys.split(",").map((k: string) => k.trim()).filter(Boolean);

  const pickResult = useMemo(() => {
    if (!parsed) return { error: "Invalid JSON" as const };
    try { return { value: pick(parsed, pickKeysArray as unknown as (keyof typeof parsed)[]) }; } catch (e) { return { error: e instanceof Error ? e.message : String(e) }; }
  }, [parsed, pickKeysArray]);

  const omitResult = useMemo(() => {
    if (!parsed) return { error: "Invalid JSON" as const };
    try { return { value: omit(parsed, omitKeysArray as unknown as (keyof typeof parsed)[]) }; } catch (e) { return { error: e instanceof Error ? e.message : String(e) }; }
  }, [parsed, omitKeysArray]);

  const handleJsonChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
  }, []);

  const handleLoadSnippet = useCallback((snippet: string) => {
    setJsonInput(snippet);
  }, []);

  const canSave = parsed !== null;

  return (
    <section className="section-card">
      <div className="card-header">
        <div className="card-title">Object & JSON Inspector</div>
        <div className="card-tools">
          <button className="btn btn-outline btn-sm" disabled={!canSave} onClick={() => addSnippet(jsonInput)}>Save snippet</button>
        </div>
      </div>
      <div className="card-body">
        <div className="field-row">
          <div className="field-col" style={{ flex: 1.5 }}>
            <div className="field-label">JSON input</div>
            <textarea className="input-field" value={jsonInput} onChange={handleJsonChange} rows={8} />
            {parsed === null && <div className="tip" style={{ color: "#dc3545", marginTop: 0.375 }}>Invalid JSON — fix syntax errors before saving.</div>}
          </div>
          <div className="field-col" style={{ flex: 1 }}>
            <div className="field-label">Deep path</div>
            <input className="input-field" type="text" value={path} onChange={(e) => setPath(e.target.value)} placeholder="e.g. user.tags[0]" />
          </div>
        </div>

        <div className="four-col">
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 20.5 12 16 17" /></svg>
                Deep get
              </div>
              <div className="output-block">
                {getResult.error ? `Error: ${getResult.error}` : JSON.stringify(getResult.value, null, 2)}
              </div>
              <div className="output-actions">
                <CopyButton text={getResult.error ? "" : JSON.stringify(getResult.value, null, 2)} />
              </div>
            </div>
          </div>
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                Deep set
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 0.375 }}>
                <input className="input-field" type="text" value={setValue} onChange={(e) => setSetValue(e.target.value)} placeholder="set value" style={{ flex: 1 }} />
              </div>
              <div className="output-block">
                {setResult.error ? `Error: ${setResult.error}` : JSON.stringify(setResult.value, null, 2)}
              </div>
              <div className="output-actions">
                <CopyButton text={setResult.error ? "" : JSON.stringify(setResult.value, null, 2)} />
              </div>
            </div>
          </div>
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9 9 9 0 0 1 9 9z" /><line x1="12" y1="3" x2="12" y2="21" /></svg>
                Deep clone
              </div>
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
              <div className="output-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                Pick / Omit
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 0.375 }}>
                <input className="input-field" type="text" value={pickKeys} onChange={(e) => setPickKeys(e.target.value)} placeholder="pick keys" style={{ flex: 1 }} />
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 0.375 }}>
                <input className="input-field" type="text" value={omitKeys} onChange={(e) => setOmitKeys(e.target.value)} placeholder="omit keys" style={{ flex: 1 }} />
              </div>
              <div style={{ display: "flex", gap: 0.75 }}>
                <button className="btn btn-primary btn-sm" onClick={pickResult.error ? undefined : () => navigator.clipboard.writeText(JSON.stringify(pickResult.value, null, 2))}>Copy picked</button>
                <button className="btn btn-outline btn-sm" onClick={omitResult.error ? undefined : () => navigator.clipboard.writeText(JSON.stringify(omitResult.value, null, 2))}>Copy omitted</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.75, marginTop: 0.5 }}>
                <div style={{ border: "1px solid #dee2e6", borderRadius: 4, padding: "0.5rem", background: "#f8f9fa" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6c757d", marginBottom: 0.375 }}>Picked</div>
                  <div className="output-block" style={{ maxHeight: 140, marginBottom: 0 }}>{pickResult.error ? `Error: ${pickResult.error}` : JSON.stringify(pickResult.value, null, 2)}</div>
                </div>
                <div style={{ border: "1px solid #dee2e6", borderRadius: 4, padding: "0.5rem", background: "#f8f9fa" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6c757d", marginBottom: 0.375 }}>Omitted</div>
                  <div className="output-block" style={{ maxHeight: 140, marginBottom: 0 }}>{omitResult.error ? `Error: ${omitResult.error}` : JSON.stringify(omitResult.value, null, 2)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-card" style={{ marginTop: "1.25rem", border: "none", boxShadow: "none" }}>
          <div className="card-header">
            <div className="card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
              Recent snippets (localStorage)
            </div>
          </div>
          <div className="card-body">
            {recentSnippets.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16" y1="2" x2="16" y2="14" /><line x1="8" y1="2" x2="8" y2="14" /><line x1="12" y1="18" x2="12" y2="14" /><line x1="9" y1="18" x2="15" y2="18" /></svg>
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
      </div>
    </section>
  );
}

export default JsonInspector;
