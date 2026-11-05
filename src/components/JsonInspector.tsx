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
      <div className="section-header">
        <div className="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
          Object & JSON Inspector
        </div>
        <div className="section-actions">
          <button className="btn btn-outline btn-sm" disabled={!canSave} onClick={() => addSnippet(jsonInput)}>Save snippet</button>
        </div>
      </div>
      <div className="section-body">
        <div className="field-row">
          <div className="field-col" style={{ flex: 1.5 }}>
            <div className="field-label">JSON input</div>
            <textarea className="input-field" value={jsonInput} onChange={handleJsonChange} rows={8} />
            {parsed === null && <div className="tip" style={{ color: var(--color-danger), marginTop: 6 }}>Invalid JSON — fix syntax errors before saving.</div>}
          </div>
          <div className="field-col" style={{ flex: 1 }}>
            <div className="field-label">Deep path</div>
            <input className="input-field" type="text" value={path} onChange={(e) => setPath(e.target.value)} placeholder="e.g. user.tags[0]" />
          </div>
        </div>

        <div className="three-col">
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 20.5 12 16 17"></polyline></svg>
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Deep set
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9 9 9 0 0 1 9 9z"></path><line x1="12" y1="3" x2="12" y2="21"></line></svg>
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
        </div>

        <div className="two-col">
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8 15 3"></path><line x1="12" y1="15" x2="12" y2="21"></line></svg>
                Picked keys
              </div>
              <div className="output-block">
                {pickResult.error ? `Error: ${pickResult.error}` : JSON.stringify(pickResult.value, null, 2)}
              </div>
            </div>
          </div>
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                Omitted keys
              </div>
              <div className="output-block">
                {omitResult.error ? `Error: ${omitResult.error}` : JSON.stringify(omitResult.value, null, 2)}
              </div>
            </div>
          </div>
        </div>

        <div className="section-card" style={{ marginTop: 20, border: "none", boxShadow: "none" }}>
          <div className="section-header">
            <div className="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Recent snippets (localStorage)
            </div>
          </div>
          <div className="section-body">
            {recentSnippets.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16" y1="2" x2="16" y2="14"></line><line x1="8" y1="2" x2="8" y2="14"></line><line x1="12" y1="18" x2="12" y2="14"></line><line x1="9" y1="18" x2="15" y2="18"></line></svg>
                <h3>No saved snippets yet</h3>
                <p>Save JSON snippets to localStorage to reuse them here.</p>
              </div>
            ) : (
              <div className="snippet-list">
                {recentSnippets.map((snippet: string, i: number) => (
                  <div key={i} className="snippet-item" title={snippet} onClick={() => handleLoadSnippet(snippet)}>
                    <span>{snippet.length > 60 ? snippet.slice(0, 60) + "…" : snippet}</span>
                    <span className="badge">{i + 1}</span>
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
