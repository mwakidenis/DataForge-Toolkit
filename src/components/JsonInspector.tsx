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
    try {
      return JSON.parse(jsonInput);
    } catch {
      return null;
    }
  }, [jsonInput]);

  const addSnippet = useCallback((snippet: string) => {
    setRecentSnippets((prev: string[]) => {
      const filtered = prev.filter((s: string) => s !== snippet);
      return [snippet, ...filtered].slice(0, 10);
    });
  }, [setRecentSnippets]);

  const getResult = useMemo(() => {
    if (!parsed) return { error: "Invalid JSON" as const };
    try {
      return { value: get(parsed, path) };
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }, [parsed, path]);

  const setResult = useMemo(() => {
    if (!parsed) return { error: "Invalid JSON" as const };
    try {
      const cloned = deepClone(parsed);
      const next = set(cloned, path, setValue);
      return { value: next };
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }, [parsed, path, setValue]);

  const cloneResult = useMemo(() => {
    if (!parsed) return { error: "Invalid JSON" as const };
    try {
      return { value: deepClone(parsed) };
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }, [parsed]);

  const pickKeysArray = pickKeys.split(",").map((k: string) => k.trim()).filter(Boolean);
  const omitKeysArray = omitKeys.split(",").map((k: string) => k.trim()).filter(Boolean);

  const pickResult = useMemo(() => {
    if (!parsed) return { error: "Invalid JSON" as const };
    try {
      return { value: pick(parsed, pickKeysArray as unknown as (keyof typeof parsed)[]) };
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }, [parsed, pickKeysArray]);

  const omitResult = useMemo(() => {
    if (!parsed) return { error: "Invalid JSON" as const };
    try {
      return { value: omit(parsed, omitKeysArray as unknown as (keyof typeof parsed)[]) };
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }, [parsed, omitKeysArray]);

  const handleJsonChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
  }, []);

  const handleLoadSnippet = useCallback((snippet: string) => {
    setJsonInput(snippet);
  }, []);

  return (
    <section className="card">
      <h3>2. Object & JSON Inspector</h3>
      <p className="tip">Safely inspect, get, set, clone, pick, and omit deep object properties.</p>

      <div className="section">
        <label>JSON input</label>
        <textarea value={jsonInput} onChange={handleJsonChange} />
        {parsed === null && <span className="error-msg">Invalid JSON — please fix syntax errors.</span>}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {parsed !== null && (
            <button className="btn btn-primary" onClick={() => addSnippet(jsonInput)}>
              Save snippet
            </button>
          )}
          {parsed === null && (
            <button className="btn" disabled title="Fix JSON errors before saving">
              Save snippet
            </button>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="section">
            <label>Deep get (path)</label>
            <input
              type="text"
              value={path}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPath(e.target.value)}
              placeholder="e.g. user.tags[0]"
            />
            <div className="output-title">Result</div>
            <div className="output-block">
              {getResult.error ? `Error: ${getResult.error}` : JSON.stringify(getResult.value, null, 2)}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <CopyButton text={getResult.error ? "" : JSON.stringify(getResult.value, null, 2)} />
            </div>
          </div>
        </div>
        <div className="col">
          <div className="section">
            <label>Deep set (path + value)</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                value={path}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPath(e.target.value)}
                placeholder="path"
                style={{ flex: 1 }}
              />
              <input
                type="text"
                value={setValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSetValue(e.target.value)}
                placeholder="value"
                style={{ flex: 1 }}
              />
            </div>
            <div className="output-title">Result</div>
            <div className="output-block">
              {setResult.error ? `Error: ${setResult.error}` : JSON.stringify(setResult.value, null, 2)}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <CopyButton text={setResult.error ? "" : JSON.stringify(setResult.value, null, 2)} />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="section">
            <label>Deep clone</label>
            <div className="output-block">
              {cloneResult.error ? `Error: ${cloneResult.error}` : JSON.stringify(cloneResult.value, null, 2)}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <CopyButton text={cloneResult.error ? "" : JSON.stringify(cloneResult.value, null, 2)} />
            </div>
          </div>
        </div>
        <div className="col">
          <div className="section">
            <label>Pick / Omit keys</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                value={pickKeys}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPickKeys(e.target.value)}
                placeholder="pick keys"
                style={{ flex: 1 }}
              />
              <input
                type="text"
                value={omitKeys}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOmitKeys(e.target.value)}
                placeholder="omit keys"
                style={{ flex: 1 }}
              />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <div>
                <div className="output-title">Picked</div>
                <div className="output-block">
                  {pickResult.error ? `Error: ${pickResult.error}` : JSON.stringify(pickResult.value, null, 2)}
                </div>
              </div>
              <div>
                <div className="output-title">Omitted</div>
                <div className="output-block">
                  {omitResult.error ? `Error: ${omitResult.error}` : JSON.stringify(omitResult.value, null, 2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <label>Recent snippets (localStorage)</label>
        {recentSnippets.length === 0 ? (
          <div className="empty-state">No saved snippets yet.</div>
        ) : (
          <div className="snippet-list">
            {recentSnippets.map((snippet: string, i: number) => (
              <div
                key={i}
                className="snippet-item"
                title={snippet}
                onClick={() => handleLoadSnippet(snippet)}
              >
                {snippet.length > 60 ? snippet.slice(0, 60) + "…" : snippet}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default JsonInspector;
