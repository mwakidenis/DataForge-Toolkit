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

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawInput(e.target.value);
  }, []);

  const handleResetChunk = useCallback(() => { reset(); }, [reset]);

  return (
    <section className="section-card">
      <div className="section-header">
        <div className="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" ry="1"></rect><rect x="14" y="3" width="7" height="7" rx="1" ry="1"></rect><rect x="14" y="14" width="7" height="7" rx="1" ry="1"></rect><rect x="3" y="14" width="7" height="7" rx="1" ry="1"></rect>
          </svg>
          Array & Text Transformer
        </div>
        <div className="section-actions">
          <button className="btn btn-outline btn-sm" onClick={() => setRawInput("")}>Clear</button>
        </div>
      </div>
      <div className="section-body">
        <div className="field-row">
          <div className="field-col" style={{ flex: 2 }}>
            <div className="field-label">Input values</div>
            <textarea
              className="input-field"
              value={rawInput}
              onChange={handleInputChange}
              placeholder="Enter comma- or newline-separated values"
              rows={6}
            />
            <div className="tip">Accepts comma-separated or newline-separated strings/numbers.</div>
          </div>
          <div className="field-col" style={{ flex: 1 }}>
            <div className="field-label">Chunk size</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button className="btn btn-outline" onClick={decrement}>−</button>
              <span style={{ minWidth: "34px", textAlign: "center", fontWeight: 700, color: var(--color-primary) }}>{chunkSize}</span>
              <button className="btn btn-outline" onClick={increment}>+</button>
              <button className="btn btn-outline btn-sm" onClick={handleResetChunk} style={{ marginLeft: 8 }}>Reset</button>
            </div>
          </div>
        </div>

        <div className="three-col">
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
                Unique items
              </div>
              <div className="output-block">{JSON.stringify(uniqueItems, null, 2)}</div>
              <div className="output-actions">
                <CopyButton text={JSON.stringify(uniqueItems, null, 2)} />
              </div>
            </div>
          </div>
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                Chunked (size {chunkSize})
              </div>
              <div className="output-block">{JSON.stringify(chunkedItems, null, 2)}</div>
              <div className="output-actions">
                <CopyButton text={JSON.stringify(chunkedItems, null, 2)} />
              </div>
            </div>
          </div>
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle><path d="M1 5h22M1 12h22M1 19h22"></path></svg>
                Grouped by first letter
              </div>
              <div className="output-block">{JSON.stringify(groupedItems, null, 2)}</div>
              <div className="output-actions">
                <CopyButton text={JSON.stringify(groupedItems, null, 2)} />
              </div>
            </div>
          </div>
        </div>

        <div className="section-card" style={{ marginTop: 20, border: "none", boxShadow: "none" }}>
          <div className="section-header">
            <div className="section-title">Case conversions</div>
          </div>
          <div className="section-body">
            <div className="three-col">
              {["camelCase", "snakeCase", "kebabCase"].map((label: string) => {
                const value =
                  label === "camelCase" ? camelCase(rawInput)
                  : label === "snakeCase" ? snakeCase(rawInput)
                  : kebabCase(rawInput);
                return (
                  <div key={label} className="stat-card">
                    <div className="stat-label">{label}</div>
                    <div className="output-block" style={{ maxHeight: "none", marginBottom: 10 }}>{value}</div>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <CopyButton text={value} />
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
