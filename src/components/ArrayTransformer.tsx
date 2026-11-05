import { useCallback, useMemo, useState } from "react";
import { unique, chunk, groupBy } from "@mwakidenis/logx/array";
import { camelCase, snakeCase, kebabCase } from "@mwakidenis/logx/string";
import { useDebouncedValue } from "@mwakidenis/logx-react/hooks/useDebouncedValue";
import { useCounter } from "@mwakidenis/logx-react/hooks/useCounter";
import { CopyButton } from "@mwakidenis/logx-react/components/CopyButton";

export function ArrayTransformer(): JSX.Element {
  const [rawInput, setRawInput] = useState<string>("apple, banana, apple, cherry, date, banana, elderberry");
  const { count: chunkSize, increment, decrement, reset } = useCounter(3, { min: 1, max: 20 });

  const debouncedInput = useDebouncedValue(rawInput, 300);

  const items = useMemo(() => {
    if (!debouncedInput.trim()) return [];
    return debouncedInput.split(/[,\n]+/).map((item: string) => item.trim()).filter(Boolean);
  }, [debouncedInput]);

  const uniqueItems = useMemo(() => {
    try { return unique(items); } catch { return items; }
  }, [items]);

  const chunkedItems = useMemo(() => {
    try { return chunk(items, chunkSize); } catch { return [items]; }
  }, [items, chunkSize]);

  const groupedItems = useMemo(() => {
    try { return groupBy(items, (value: string) => String(value).charAt(0).toUpperCase()); } catch { return {}; }
  }, [items]);

  const groupedEntries = useMemo(() => Object.entries(groupedItems), [groupedItems]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawInput(e.target.value);
  }, []);

  const handleResetChunk = useCallback(() => { reset(); }, [reset]);

  const caseLabels = ["camelCase", "snakeCase", "kebabCase"] as const;

  return (
    <section className="section-card">
      <div className="card-header">
        <div className="card-title">Array & Text Transformer</div>
        <div className="card-tools">
          <button className="btn btn-outline btn-sm" onClick={() => setRawInput("")}>Clear input</button>
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
              <div className="field-label">Chunk size</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button className="btn btn-outline" onClick={decrement}>−</button>
                <span style={{ minWidth: "36px", textAlign: "center", fontWeight: 700, color: "#0d6efd" }}>{chunkSize}</span>
                <button className="btn btn-outline" onClick={increment}>+</button>
                <button className="btn btn-outline btn-sm" onClick={handleResetChunk}>Reset</button>
              </div>
            </div>
          </div>
        </div>

        {/* Stat boxes */}
        <div className="stats-grid">
          <div className="small-box small-box-primary">
            <div className="inner">
              <h3>{items.length}</h3>
              <p>Total items parsed</p>
            </div>
            <div className="small-box-icon">📦</div>
            <div className="small-box-footer">
              <a href="#" onClick={(e) => e.preventDefault()}>More details</a>
            </div>
          </div>
          <div className="small-box small-box-success">
            <div className="inner">
              <h3>{uniqueItems.length}</h3>
              <p>Unique items</p>
            </div>
            <div className="small-box-icon">✅</div>
            <div className="small-box-footer">
              <a href="#" onClick={(e) => e.preventDefault()}>View</a>
            </div>
          </div>
          <div className="small-box small-box-info">
            <div className="inner">
              <h3>{Math.ceil(items.length / chunkSize)}</h3>
              <p>Chunk groups</p>
            </div>
            <div className="small-box-icon">🔢</div>
            <div className="small-box-footer">
              <a href="#" onClick={(e) => e.preventDefault()}>View</a>
            </div>
          </div>
          <div className="small-box small-box-warning">
            <div className="inner">
              <h3>{groupedEntries.length}</h3>
              <p>Letter groups</p>
            </div>
            <div className="small-box-icon">🔤</div>
            <div className="small-box-footer">
              <a href="#" onClick={(e) => e.preventDefault()}>View</a>
            </div>
          </div>
        </div>

        <div className="four-col">
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">Unique items</div>
              <div className="output-block">{JSON.stringify(uniqueItems, null, 2)}</div>
              <div className="output-actions">
                <CopyButton text={JSON.stringify(uniqueItems, null, 2)} />
              </div>
            </div>
          </div>
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">Chunked (size {chunkSize})</div>
              <div className="output-block">{JSON.stringify(chunkedItems, null, 2)}</div>
              <div className="output-actions">
                <CopyButton text={JSON.stringify(chunkedItems, null, 2)} />
              </div>
            </div>
          </div>
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">Grouped by first letter</div>
              <div className="output-block">{JSON.stringify(groupedItems, null, 2)}</div>
              <div className="output-actions">
                <CopyButton text={JSON.stringify(groupedItems, null, 2)} />
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
                  {groupedEntries.map(([letter, group]) => (
                    <tr key={letter}>
                      <td><span className="badge badge-primary">{letter}</span></td>
                      <td>{group.join(", ")}</td>
                      <td>{group.length}</td>
                    </tr>
                  ))}
                  {groupedEntries.length === 0 && (
                    <tr><td colSpan={3} style={{ textAlign: "center", color: "#adb5bd" }}>No data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="section-card" style={{ marginTop: "1.25rem", border: "none", boxShadow: "none" }}>
          <div className="card-header">
            <div className="card-title">Case conversions</div>
          </div>
          <div className="card-body">
            <div className="four-col">
              {caseLabels.map((label) => {
                const value =
                  label === "camelCase" ? camelCase(rawInput)
                  : label === "snakeCase" ? snakeCase(rawInput)
                  : kebabCase(rawInput);
                return (
                  <div key={label} className="small-box small-box-info" style={{ minHeight: 120, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div className="inner" style={{ padding: "0.625rem" }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6c757d", marginBottom: "0.5rem" }}>{label}</div>
                      <div style={{ fontSize: "0.8rem", color: "#212529", wordBreak: "break-word", maxHeight: 60, overflow: "hidden" }}>{value || "—"}</div>
                    </div>
                    <div className="small-box-icon" style={{ fontSize: 28, right: 10, bottom: 12 }}></div>
                    <div className="small-box-footer" style={{ paddingTop: "0.375rem" }}>
                      <button className="btn btn-outline btn-sm" onClick={() => navigator.clipboard.writeText(value)}>Copy</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ArrayTransformer;
