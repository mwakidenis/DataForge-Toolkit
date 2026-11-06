import { useCallback, useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { timestampFromReadable, timestampToReadable, currentTimestamp, type TimestampUnit, type TimestampResult } from "../utils/timestamp";

export function TimestampConverter(): JSX.Element {
  const [input, setInput] = useLocalStorage<string>("dataforge:timestamp-input", "");
  const [direction, setDirection] = useState<"to-unix" | "to-readable">("to-readable");
  const [unit, setUnit] = useState<TimestampUnit>("seconds");

  const now = currentTimestamp();

  const result: TimestampResult | null = useMemo(() => {
    if (!input.trim()) return null;
    if (direction === "to-unix") {
      return timestampFromReadable(input);
    }
    const num = parseFloat(input);
    if (isNaN(num)) return null;
    return timestampToReadable(num, unit);
  }, [input, direction, unit]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, [setInput]);

  const handleDirectionChange = useCallback((next: "to-unix" | "to-readable") => {
    setDirection(next);
  }, [setDirection]);

  const handleUnitChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setUnit(e.target.value as TimestampUnit);
  }, [setUnit]);

  const handleCopyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(direction === "to-unix" ? result.unix.toString() : result.iso);
    }
  }, [result, direction]);

  const handleUseNow = useCallback(() => {
    setInput(now.iso);
  }, [now]);

  return (
    <section className="section-card">
      <div className="card-header">
        <div className="card-title">Timestamp Converter</div>
        <div className="card-tools">
          <label style={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: 0.75, color: "#6c757d", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={true}
              onChange={handleUseNow}
              style={{ cursor: "pointer" }}
            />
            Use now
          </label>
          <button className="btn btn-outline btn-sm" onClick={() => setInput("")}>Clear</button>
        </div>
      </div>
      <div className="card-body">
        <div className="toolbar">
          <div className="field-row">
            <div className="field-col" style={{ flex: 1 }}>
              <div className="field-label">Direction</div>
              <div style={{ display: "flex", gap: 0.5 }}>
                <button
                  className={`btn btn-sm ${direction === "to-unix" ? "btn-primary" : "btn-outline"}`}
                  onClick={() => handleDirectionChange("to-unix")}
                >
                  To Unix
                </button>
                <button
                  className={`btn btn-sm ${direction === "to-readable" ? "btn-primary" : "btn-outline"}`}
                  onClick={() => handleDirectionChange("to-readable")}
                >
                  To Readable
                </button>
              </div>
            </div>
            {direction === "to-readable" && (
              <div className="field-col" style={{ flex: 0, flexBasis: "140px" }}>
                <div className="field-label">Unit</div>
                <select className="input-field" value={unit} onChange={handleUnitChange}>
                  <option value="seconds">Seconds</option>
                  <option value="milliseconds">Milliseconds</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="field-row">
          <div className="field-col" style={{ flex: 1 }}>
            <div className="field-label">
              {direction === "to-unix" ? "Date/Time" : "Unix timestamp"}
            </div>
            <textarea
              className="input-field"
              value={input}
              onChange={handleInputChange}
              rows={3}
              placeholder={direction === "to-unix" ? "2026-11-06T10:00:00Z" : "1730893200"}
            />
          </div>
        </div>

        {result && result.valid && (
          <div className="section-card" style={{ marginTop: 1.25, border: "none", boxShadow: "none" }}>
            <div className="card-header">
              <div className="card-title">Result</div>
            </div>
            <div className="card-body">
              <div className="stats-grid">
                <div className="small-box text-bg-primary">
                  <div className="inner">
                    <h3>{direction === "to-unix" ? result.unix : result.readable}</h3>
                    <p>{direction === "to-unix" ? "Unix timestamp" : "Readable date"}</p>
                  </div>
                  <div className="small-box-icon"><i className="bi bi-clock"></i></div>
                </div>
                <div className="small-box text-bg-success">
                  <div className="inner">
                    <h3>{result.iso}</h3>
                    <p>ISO 8601</p>
                  </div>
                  <div className="small-box-icon"><i className="bi bi-calendar"></i></div>
                </div>
              </div>

              <div className="output-wrap" style={{ marginTop: 1 }}>
                <div className="output-label">ISO 8601</div>
                <div className="output-block">{result.iso}</div>
                <div className="output-actions" style={{ marginTop: 0.5 }}>
                  <button className="btn btn-outline btn-sm" onClick={handleCopyResult}>Copy</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!result || !result.valid ? (
          <div className="empty-state" style={{ marginTop: 1 }}>
            <h3>Enter a timestamp or date</h3>
            <p>Supported: 2026-11-06T10:00:00Z, 1730893200</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default TimestampConverter;
