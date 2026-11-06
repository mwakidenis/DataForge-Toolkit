import { useCallback, useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { CopyButton } from "../ui/CopyButton";
import {
  parseCsv,
  stringifyCsv,
  detectDelimiter,
} from "../services/csvService";

export function CsvConverter(): JSX.Element {
  const [csvInput, setCsvInput] = useLocalStorage<string>("dataforge:csv-input", "name,age,city\nAlice,30,New York\nBob,25,London\nCharlie,35,Tokyo");
  const [jsonInput, setJsonInput] = useLocalStorage<string>("dataforge:json-output", "");
  const [direction, setDirection] = useState<"csv-to-json" | "json-to-csv">("csv-to-json");
  const [delimiter, setDelimiter] = useState<"," | ";" | "\t" | "|">(",");
  const [hasHeader, setHasHeader] = useState<boolean>(true);
  const [autoDetect, setAutoDetect] = useState<boolean>(true);

  const detectedDelimiter = useMemo(() => {
    if (autoDetect && csvInput.trim()) {
      return detectDelimiter(csvInput);
    }
    return delimiter;
  }, [csvInput, autoDetect, delimiter]);

  const parseResult = useMemo(() => {
    if (!csvInput.trim()) return null;
    try {
      return parseCsv(csvInput, { delimiter: detectedDelimiter, hasHeader, trimValues: true });
    } catch {
      return null;
    }
  }, [csvInput, detectedDelimiter, hasHeader]);

  const stringifyResult = useMemo(() => {
    if (!jsonInput.trim()) return null;
    try {
      return stringifyCsv(jsonInput, { delimiter, hasHeader, trimValues: true });
    } catch {
      return null;
    }
  }, [jsonInput, delimiter, hasHeader]);

  const handleCsvChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCsvInput(e.target.value);
  }, [setCsvInput]);

  const handleJsonChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
  }, [setJsonInput]);

  const handleDelimiterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setDelimiter(e.target.value as "," | ";" | "\t" | "|");
  }, [setDelimiter]);

  const handleAutoDetectChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoDetect(e.target.checked);
  }, [setAutoDetect]);

  const handleHasHeaderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setHasHeader(e.target.checked);
  }, [setHasHeader]);

  const handleDirectionChange = useCallback((val: "csv-to-json" | "json-to-csv") => {
    setDirection(val);
  }, [setDirection]);

  const handleCopyCsv = useCallback(() => {
    if (stringifyResult) navigator.clipboard.writeText(stringifyResult.csv);
  }, [stringifyResult]);

  const handleCopyJson = useCallback(() => {
    if (parseResult) navigator.clipboard.writeText(JSON.stringify(parseResult.rows, null, 2));
  }, [parseResult]);

  const handleDownloadCsv = useCallback(() => {
    if (!stringifyResult) return;
    const blob = new Blob([stringifyResult.csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dataforge-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [stringifyResult]);

  const handleDownloadJson = useCallback(() => {
    if (!parseResult) return;
    const blob = new Blob([JSON.stringify(parseResult.rows, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dataforge-export.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [parseResult]);

  return (
    <section className="section-card">
      <div className="card-header">
        <div className="card-title">CSV Converter</div>
        <div className="card-tools">
          <label style={{ fontSize: "0.75rem", fontWeight: 600, marginRight: 0.5, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6c757d" }}>Direction:</label>
          <div style={{ display: "flex", gap: 0.25 }}>
            <button
              className={`btn btn-sm ${direction === "csv-to-json" ? "btn-primary" : "btn-outline"}`}
              onClick={() => handleDirectionChange("csv-to-json")}
            >
              CSV → JSON
            </button>
            <button
              className={`btn btn-sm ${direction === "json-to-csv" ? "btn-primary" : "btn-outline"}`}
              onClick={() => handleDirectionChange("json-to-csv")}
            >
              JSON → CSV
            </button>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="field-row">
          <div className="field-col" style={{ flex: 1 }}>
            <div className="field-label">
              {direction === "csv-to-json" ? "CSV Input" : "JSON Input"}
            </div>
            <textarea
              className="input-field"
              value={direction === "csv-to-json" ? csvInput : jsonInput}
              onChange={direction === "csv-to-json" ? handleCsvChange : handleJsonChange}
              rows={8}
              placeholder={direction === "csv-to-json" ? "name,age,city\nAlice,30,New York" : '[{"name":"Alice","age":30}]'}
            />
          </div>
          <div className="field-col" style={{ flex: 1 }}>
            <div className="field-label">
              {direction === "csv-to-json" ? "JSON Output" : "CSV Output"}
            </div>
            <textarea
              className="input-field"
              value={direction === "csv-to-json"
                ? (parseResult ? JSON.stringify(parseResult.rows, null, 2) : "")
                : (stringifyResult ? stringifyResult.csv : "")}
              readOnly
              rows={8}
            />
            <div className="output-actions" style={{ marginTop: 0.5 }}>
              {direction === "csv-to-json" ? (
                <CopyButton text={parseResult ? JSON.stringify(parseResult.rows, null, 2) : ""} />
              ) : (
                <CopyButton text={stringifyResult?.csv ?? ""} />
              )}
            </div>
          </div>
        </div>

        <div className="toolbar" style={{ marginTop: 1 }}>
          <div className="field-row">
            <div className="field-col" style={{ flex: 1 }}>
              <div className="field-label">Delimiter</div>
              <select className="input-field" value={delimiter} onChange={handleDelimiterChange} disabled={autoDetect}>
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="\t">Tab</option>
                <option value="|">Pipe (|)</option>
              </select>
              <label style={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: 0.75, color: "#6c757d", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={autoDetect}
                  onChange={handleAutoDetectChange}
                  style={{ cursor: "pointer" }}
                />
                Auto-detect delimiter ({detectedDelimiter === "," ? "comma" : detectedDelimiter === ";" ? "semicolon" : detectedDelimiter === "\t" ? "tab" : "pipe"})
              </label>
            </div>
            <div className="field-col" style={{ flex: 0, flexBasis: "120px" }}>
              <div className="field-label">Header row</div>
              <label style={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: 0.75, color: "#6c757d", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={hasHeader}
                  onChange={handleHasHeaderChange}
                  style={{ cursor: "pointer" }}
                />
                First row is header
              </label>
            </div>
          </div>
        </div>

        {parseResult && (
          <div className="section-card" style={{ marginTop: 1.25, border: "none", boxShadow: "none" }}>
            <div className="card-header">
              <div className="card-title">Parsed CSV Data ({parseResult.rowCount} rows)</div>
            </div>
            <div className="card-body">
              <div style={{ overflowX: "auto" }}>
                <table className="table" style={{ width: "100%", marginBottom: 0 }}>
                  <thead>
                    <tr>
                      {parseResult.headers.map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parseResult.rows.slice(0, 50).map((row, i) => (
                      <tr key={i}>
                        {parseResult.headers.map((h) => (
                          <td key={h}>{row[h] ?? ""}</td>
                        ))}
                      </tr>
                    ))}
                    {parseResult.rowCount > 50 && (
                      <tr>
                        <td colSpan={parseResult.headers.length} style={{ textAlign: "center", color: "#6c757d" }}>
                          Showing first 50 of {parseResult.rowCount} rows
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="toolbar" style={{ marginTop: 0.75, justifyContent: "flex-end" }}>
                <button className="btn btn-primary btn-sm" onClick={handleDownloadJson}>
                  Download JSON
                </button>
                <button className="btn btn-outline btn-sm" onClick={handleCopyJson}>
                  Copy JSON
                </button>
              </div>
            </div>
          </div>
        )}

        {stringifyResult && (
          <div className="section-card" style={{ marginTop: 1.25, border: "none", boxShadow: "none" }}>
            <div className="card-header">
              <div className="card-title">Generated CSV ({stringifyResult.rowCount} rows)</div>
            </div>
            <div className="card-body">
              <div className="output-wrap">
                <div className="output-block">{stringifyResult.csv}</div>
                <div className="output-actions">
                  <CopyButton text={stringifyResult.csv} />
                </div>
              </div>
              <div className="toolbar" style={{ marginTop: 0.75, justifyContent: "flex-end" }}>
                <button className="btn btn-primary btn-sm" onClick={handleDownloadCsv}>
                  Download CSV
                </button>
                <button className="btn btn-outline btn-sm" onClick={handleCopyCsv}>
                  Copy CSV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default CsvConverter;
