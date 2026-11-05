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
    return debouncedInput
      .split(/[,\n]+/)
      .map((item: string) => item.trim())
      .filter(Boolean);
  }, [debouncedInput]);

  const uniqueItems = useMemo(() => {
    try {
      return unique(items);
    } catch {
      return items;
    }
  }, [items]);

  const chunkedItems = useMemo(() => {
    try {
      return chunk(items, chunkSize);
    } catch {
      return [items];
    }
  }, [items, chunkSize]);

  const groupedItems = useMemo(() => {
    try {
      return groupBy(items, (value: string) => String(value).charAt(0).toUpperCase());
    } catch {
      return {};
    }
  }, [items]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawInput(e.target.value);
  }, []);

  const handleResetChunk = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <section className="card">
      <h3>1. Array & Text Transformer</h3>
      <p className="tip">Enter comma- or newline-separated values. Outputs update as you type (debounced).</p>

      <div className="section">
        <label>Input values</label>
        <textarea
          value={rawInput}
          onChange={handleInputChange}
          placeholder="e.g. apple, banana, cherry, date"
        />
      </div>

      <div className="row">
        <div className="col">
          <div className="section">
            <label>Unique items</label>
            <div className="output-block">
              {JSON.stringify(uniqueItems, null, 2)}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <CopyButton text={JSON.stringify(uniqueItems, null, 2)} />
            </div>
          </div>
        </div>
        <div className="col">
          <div className="section">
            <label>Chunked (size)</label>
            <div className="slider-row">
              <button className="btn" onClick={decrement}>−</button>
              <span style={{ minWidth: "28px", textAlign: "center", color: "#94a3b8" }}>{chunkSize}</span>
              <button className="btn" onClick={increment}>+</button>
              <button className="btn btn-danger" onClick={handleResetChunk} style={{ marginLeft: 8 }}>
                Reset
              </button>
            </div>
            <div className="output-block">
              {JSON.stringify(chunkedItems, null, 2)}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <CopyButton text={JSON.stringify(chunkedItems, null, 2)} />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="section">
            <label>Grouped by first letter</label>
            <div className="output-block">
              {JSON.stringify(groupedItems, null, 2)}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <CopyButton text={JSON.stringify(groupedItems, null, 2)} />
            </div>
          </div>
        </div>
        <div className="col">
          <div className="section">
            <label>Case conversions</label>
            <div className="grid">
              {["camelCase", "snakeCase", "kebabCase"].map((label: string) => {
                const value =
                  label === "camelCase"
                    ? camelCase(rawInput)
                    : label === "snakeCase"
                    ? snakeCase(rawInput)
                    : kebabCase(rawInput);
                return (
                  <div key={label} className="stat-card">
                    <div className="label">{label}</div>
                    <div className="output-block" style={{ maxHeight: "none", marginTop: 0 }}>
                      {value}
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
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
