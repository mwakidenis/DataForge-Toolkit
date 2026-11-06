import { useCallback, useMemo, useState } from "react";
import { useDebouncedValue } from "@mwakidenis/logx-react/hooks/useDebouncedValue";
import { useCounter } from "@mwakidenis/logx-react/hooks/useCounter";
import { useLocalStorage } from "@mwakidenis/logx-react/hooks/useLocalStorage";
import { CopyButton } from "@mwakidenis/logx-react/components/CopyButton";
import { transformArray } from "../services/arrayService";

export function ArrayTransformer(): JSX.Element {
  const [rawInput, setRawInput] = useLocalStorage<string>("dataforge:array-input", "apple, banana, apple, cherry, date, banana, elderberry");
  const [delimiter, setDelimiter] = useState<"," | "\n" | ";" | "|" | "\t">(",");
  const [regexPattern, setRegexPattern] = useState<string>("");
  const { count: chunkSize, increment, decrement, reset } = useCounter(3, { min: 1, max: 20 });

  const debouncedInput = useDebouncedValue(rawInput, 300);

  const result = useMemo(() => {
    return transformArray(debouncedInput, {
      delimiter,
      chunkSize,
      regexPattern: regexPattern.trim() ? regexPattern : undefined,
    });
  }, [debouncedInput, delimiter, chunkSize, regexPattern]);

  const { dedup, chunk, group, caseTransform, stats, regexFilter } = result;

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawInput(e.target.value);
  }, [setRawInput]);

  const handleDelimiterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setDelimiter(e.target.value as "," | "\n" | ";" | "|" | "\t");
  }, [setDelimiter]);

  const handleRegexChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRegexPattern(e.target.value);
  }, [setRegexPattern]);

  const handleResetChunk = useCallback(() => { reset(); }, [reset]);

  const handleClearInput = useCallback(() => { setRawInput(""); }, [setRawInput]);

  return (
    <section className="section-card">
      <div className="card-header">
        <div className="card-title">Array & Text Transformer</div>
        <div className="card-tools">
          <button className="btn btn-outline btn-sm" onClick={handleClearInput}>Clear input</button>
        </div>
      </div>
      <div className="card-body">
        <div className="toolbar">
          <div className="field-row">
            <div className="field-col" style={{ flex: 2 }}>
              <div className="field-label">Input values</div>
              <textarea
                className="input-field"
                value={rawInput}
                onChange={handleInputChange}
                placeholder="Enter comma- or newline-separated values"
                rows={4}
              />
              <div className="tip">Accepts comma-separated or newline-separated strings/numbers.</div>
            </div>
            <div className="field-col" style={{ flex: 1 }}>
              <div className="field-label">Delimiter</div>
              <select className="input-field" value={delimiter} onChange={handleDelimiterChange}>
                <option value=",">Comma (,)</option>
                <option value="\n">Newline</option>
                <option value=";">Semicolon (;)</option>
                <option value="|">Pipe (|)</option>
                <option value="\t">Tab</option>
              </select>
              <div className="field-label" style={{ marginTop: 0.75 }}>Chunk size</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button className="btn btn-outline" onClick={decrement}>−</button>
                <span style={{ minWidth: "36px", textAlign: "center", fontWeight: 700, color: "#0d6efd" }}>{chunkSize}</span>
                <button className="btn btn-outline" onClick={increment}>+</button>
                <button className="btn btn-outline btn-sm" onClick={handleResetChunk}>Reset</button>
              </div>
            </div>
          </div>
          <div className="field-row" style={{ marginTop: 0.75 }}>
            <div className="field-col" style={{ flex: 1 }}>
              <div className="field-label">Regex filter (optional)</div>
              <input
                className="input-field"
                type="text"
                value={regexPattern}
                onChange={handleRegexChange}
                placeholder="e.g. ^a"
              />
              <div className="tip">Filter items matching the regex pattern.</div>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="small-box text-bg-primary">
            <div className="inner">
              <h3>{stats.count}</h3>
              <p>Total items parsed</p>
            </div>
            <div className="small-box-icon"><i className="bi bi-box-seam"></i></div>
            <div className="small-box-footer">
              <a href="#" onClick={(e) => e.preventDefault()}>More details</a>
            </div>
          </div>
          <div className="small-box text-bg-success">
            <div className="inner">
              <h3>{dedup.unique.length}</h3>
              <p>Unique items</p>
            </div>
            <div className="small-box-icon"><i className="bi bi-check-square"></i></div>
            <div className="small-box-footer">
              <a href="#" onClick={(e) => e.preventDefault()}>View</a>
            </div>
          </div>
          <div className="small-box text-bg-info">
            <div className="inner">
              <h3>{chunk.totalChunks}</h3>
              <p>Chunk groups</p>
            </div>
            <div className="small-box-icon"><i className="bi bi-layout-three-columns"></i></div>
            <div className="small-box-footer">
              <a href="#" onClick={(e) => e.preventDefault()}>View</a>
            </div>
          </div>
          <div className="small-box text-bg-warning">
            <div className="inner">
              <h3>{group.groupCount}</h3>
              <p>Letter groups</p>
            </div>
            <div className="small-box-icon"><i className="bi bi-fonts"></i></div>
            <div className="small-box-footer">
              <a href="#" onClick={(e) => e.preventDefault()}>View</a>
            </div>
          </div>
        </div>

        <div className="four-col">
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">Unique items</div>
              <div className="output-block">{JSON.stringify(dedup.unique, null, 2)}</div>
              <div className="output-actions">
                <CopyButton text={JSON.stringify(dedup.unique, null, 2)} />
              </div>
            </div>
          </div>
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">Chunked (size {chunk.chunkSize})</div>
              <div className="output-block">{JSON.stringify(chunk.chunks, null, 2)}</div>
              <div className="output-actions">
                <CopyButton text={JSON.stringify(chunk.chunks, null, 2)} />
              </div>
            </div>
          </div>
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">Grouped by first letter</div>
              <div className="output-block">{JSON.stringify(group.groups, null, 2)}</div>
              <div className="output-actions">
                <CopyButton text={JSON.stringify(group.groups, null, 2)} />
              </div>
            </div>
          </div>
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">Table view</div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Group</th>
                    <th>Items</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {group.entries.map(([letter, grp]) => (
                    <tr key={letter}>
                      <td><span className="badge badge-primary">{letter}</span></td>
                      <td>{grp.join(", ")}</td>
                      <td>{grp.length}</td>
                    </tr>
                  ))}
                  {group.entries.length === 0 && (
                    <tr><td colSpan={3} style={{ textAlign: "center", color: "#adb5bd" }}>No data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {regexFilter && (
          <div className="section-card" style={{ marginTop: "1.25rem", border: "none", boxShadow: "none" }}>
            <div className="card-header">
              <div className="card-title">Regex Filter Results</div>
            </div>
            <div className="card-body">
              <div className="four-col">
                <div className="field-col">
                  <div className="small-box text-bg-info">
                    <div className="inner">
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255,255,255,0.8)", marginBottom: 0.375 }}>Matched</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>{regexFilter.matched.length}</div>
                    </div>
                    <div className="small-box-icon"><i className="bi bi-search"></i></div>
                  </div>
                </div>
                <div className="field-col">
                  <div className="small-box text-bg-secondary" style={{ background: "#6c757d" }}>
                    <div className="inner">
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255,255,255,0.8)", marginBottom: 0.375 }}>Remaining</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>{regexFilter.filtered.length}</div>
                    </div>
                    <div className="small-box-icon"><i className="bi bi-dash-circle"></i></div>
                  </div>
                </div>
              </div>
              <div className="output-wrap" style={{ marginTop: 1 }}>
                <div className="output-label">Matched items</div>
                <div className="output-block">{JSON.stringify(regexFilter.matched, null, 2)}</div>
                <div className="output-actions">
                  <CopyButton text={JSON.stringify(regexFilter.matched, null, 2)} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="section-card" style={{ marginTop: "1.25rem", border: "none", boxShadow: "none" }}>
          <div className="card-header">
            <div className="card-title">Case conversions</div>
          </div>
          <div className="card-body">
            <div className="four-col">
              {Object.entries(caseTransform).map(([label, value]) => (
                <div key={label} className="small-box text-bg-info" style={{ minHeight: 120, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div className="inner" style={{ padding: "0.625rem" }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255,255,255,0.8)", marginBottom: "0.5rem" }}>{label}</div>
                    <div style={{ fontSize: "0.8rem", color: "#fff", wordBreak: "break-word", maxHeight: 60, overflow: "hidden" }}>{value || "—"}</div>
                  </div>
                  <div className="small-box-icon" style={{ fontSize: "28px", right: 10, bottom: 12 }}></div>
                  <div className="small-box-footer" style={{ paddingTop: "0.375rem" }}>
                    <button className="btn btn-outline btn-sm" onClick={() => navigator.clipboard.writeText(value)}>Copy</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ArrayTransformer;
