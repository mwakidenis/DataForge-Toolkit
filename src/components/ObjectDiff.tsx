import { useCallback, useMemo } from "react";
import { useLocalStorage } from "@mwakidenis/logx-react/hooks/useLocalStorage";
import { deepDiff, formatDiffForDisplay } from "../services/diffService";

export function ObjectDiff(): JSX.Element {
  const [beforeInput, setBeforeInput] = useLocalStorage<string>("dataforge:diff-before", '{\n  "name": "Alice",\n  "age": 30,\n  "city": "New York",\n  "tags": ["admin", "user"]\n}');
  const [afterInput, setAfterInput] = useLocalStorage<string>("dataforge:diff-after", '{\n  "name": "Alice Smith",\n  "age": 31,\n  "city": "San Francisco",\n  "tags": ["admin", "editor"]\n}');

  const beforeParsed = useMemo(() => {
    try { return JSON.parse(beforeInput); } catch { return null; }
  }, [beforeInput]);

  const afterParsed = useMemo(() => {
    try { return JSON.parse(afterInput); } catch { return null; }
  }, [afterInput]);

  const diffResult = useMemo(() => {
    if (!beforeParsed || !afterParsed) return null;
    try {
      return deepDiff(beforeParsed, afterParsed);
    } catch {
      return null;
    }
  }, [beforeParsed, afterParsed]);

  const display = useMemo(() => {
    if (!diffResult) return null;
    return formatDiffForDisplay(diffResult);
  }, [diffResult]);

  const handleBeforeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBeforeInput(e.target.value);
  }, [setBeforeInput]);

  const handleAfterChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAfterInput(e.target.value);
  }, [setAfterInput]);

  const handleCopyDiff = useCallback(() => {
    if (diffResult) navigator.clipboard.writeText(JSON.stringify(diffResult, null, 2));
  }, [diffResult]);

  const changeStyle = (type: string): React.CSSProperties => {
    switch (type) {
      case "added": return { color: "#198754", fontWeight: 600 };
      case "removed": return { color: "#dc3545", fontWeight: 600 };
      case "modified": return { color: "#ffc107", fontWeight: 600 };
      default: return { color: "#6c757d" };
    }
  };

  return (
    <section className="section-card">
      <div className="card-header">
        <div className="card-title">Object Diff</div>
        <div className="card-tools">
          <button className="btn btn-outline btn-sm" onClick={() => navigator.clipboard.writeText(JSON.stringify(diffResult, null, 2))}>Copy diff</button>
        </div>
      </div>
      <div className="card-body">
        <div className="field-row">
          <div className="field-col" style={{ flex: 1 }}>
            <div className="field-label">Before</div>
            <textarea className="input-field" value={beforeInput} onChange={handleBeforeChange} rows={8} />
            {!beforeParsed && <div className="tip" style={{ color: "#dc3545", marginTop: 0.375 }}>Invalid JSON</div>}
          </div>
          <div className="field-col" style={{ flex: 1 }}>
            <div className="field-label">After</div>
            <textarea className="input-field" value={afterInput} onChange={handleAfterChange} rows={8} />
            {!afterParsed && <div className="tip" style={{ color: "#dc3545", marginTop: 0.375 }}>Invalid JSON</div>}
          </div>
        </div>

        {diffResult && display && (
          <div className="section-card" style={{ marginTop: 1.25, border: "none", boxShadow: "none" }}>
            <div className="card-header">
              <div className="card-title">Diff Summary</div>
            </div>
            <div className="card-body">
              <div className="stats-grid">
                <div className="small-box text-bg-success">
                  <div className="inner">
                    <h3>{display.addedCount}</h3>
                    <p>Added</p>
                  </div>
                  <div className="small-box-icon"><i className="bi bi-plus-circle"></i></div>
                </div>
                <div className="small-box text-bg-danger">
                  <div className="inner">
                    <h3>{display.removedCount}</h3>
                    <p>Removed</p>
                  </div>
                  <div className="small-box-icon"><i className="bi bi-dash-circle"></i></div>
                </div>
                <div className="small-box text-bg-warning">
                  <div className="inner">
                    <h3>{display.modifiedCount}</h3>
                    <p>Modified</p>
                  </div>
                  <div className="small-box-icon"><i className="bi bi-pencil"></i></div>
                </div>
                <div className="small-box text-bg-info">
                  <div className="inner">
                    <h3>{display.unchangedCount}</h3>
                    <p>Unchanged</p>
                  </div>
                  <div className="small-box-icon"><i className="bi bi-equal"></i></div>
                </div>
              </div>

              <div className="output-wrap" style={{ marginTop: 1 }}>
                <div className="output-label">Changes</div>
                <div className="output-block" style={{ maxHeight: 200, overflowY: "auto" }}>
                  {diffResult.changes.map((change, i) => (
                    <div key={i} style={{ padding: 0.5, borderBottom: "1px solid #dee2e6", fontFamily: "monospace", fontSize: 0.85, ...changeStyle(change.type) }}>
                      <span style={{ textTransform: "uppercase", fontSize: 0.7, opacity: 0.7, marginRight: 0.5 }}>{change.type}</span>
                      <span style={{ color: "#212529" }}>{change.path}</span>
                      {change.type === "modified" && (
                        <span style={{ color: "#6c757d", marginLeft: 0.5 }}>(before: {JSON.stringify(change.before)} → after: {JSON.stringify(change.after)})</span>
                      )}
                      {change.type === "added" && (
                        <span style={{ color: "#6c757d", marginLeft: 0.5 }}>(value: {JSON.stringify(change.after)})</span>
                      )}
                      {change.type === "removed" && (
                        <span style={{ color: "#6c757d", marginLeft: 0.5 }}>(value: {JSON.stringify(change.before)})</span>
                      )}
                    </div>
                  ))}
                  {diffResult.changes.length === 0 && <div style={{ color: "#6c757d", padding: 0.5 }}>No changes detected</div>}
                </div>
              </div>

              <div className="toolbar" style={{ marginTop: 0.75, justifyContent: "flex-end" }}>
                <span className="badge badge-info">{display.summary}</span>
                <button className="btn btn-primary btn-sm" onClick={handleCopyDiff}>Copy diff JSON</button>
              </div>
            </div>
          </div>
        )}

        {!diffResult && beforeParsed && afterParsed && (
          <div className="section-card" style={{ marginTop: 1.25, border: "none", boxShadow: "none" }}>
            <div className="card-header">
              <div className="card-title">Diff Result</div>
            </div>
            <div className="card-body">
              <div className="empty-state">
                <h3>Identical objects</h3>
                <p>No differences detected between the two objects.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ObjectDiff;
