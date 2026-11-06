import { useCallback, useMemo, useState } from "react";
import { useLocalStorage } from "@mwakidenis/logx-react/hooks/useLocalStorage";
import { CopyButton } from "@mwakidenis/logx-react/components/CopyButton";
import {
  urlEncode,
  urlDecode,
  buildQueryString,
  parseQueryString,
  type QueryParams,
} from "../services/urlService";

export function UrlEncoder(): JSX.Element {
  const [input, setInput] = useLocalStorage<string>("dataforge:url-input", "https://example.com/page?name=John Doe&city=New York");
  const [mode, setMode] = useState<"encode" | "decode" | "query">("encode");
  const [encodeMethod, setEncodeMethod] = useState<"encodeURIComponent" | "encodeURI">("encodeURIComponent");

  const encodeResult = useMemo(() => {
    if (mode !== "encode") return null;
    return urlEncode(input, encodeMethod);
  }, [input, mode, encodeMethod]);

  const decodeResult = useMemo(() => {
    if (mode !== "decode") return null;
    return urlDecode(input);
  }, [input, mode]);

  const queryParams = useMemo(() => {
    if (mode !== "query") return null;
    return parseQueryString(input);
  }, [input, mode]);

  const queryString = useMemo(() => {
    if (mode !== "query") return null;
    try {
      const parsed = JSON.parse(input);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return buildQueryString(parsed as QueryParams);
      }
      return "";
    } catch {
      return "";
    }
  }, [input, mode]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, [setInput]);

  const handleModeChange = useCallback((next: "encode" | "decode" | "query") => {
    setMode(next);
  }, [setMode]);

  const handleMethodChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setEncodeMethod(e.target.value as "encodeURIComponent" | "encodeURI");
  }, [setEncodeMethod]);

  const buttons = useMemo(() => {
    if (mode === "encode" && encodeResult) {
      return (
        <>
          <CopyButton text={encodeResult.encoded} />
          <button className="btn btn-outline btn-sm" onClick={() => navigator.clipboard.writeText(encodeResult.encoded)}>
            Copy
          </button>
        </>
      );
    }
    if (mode === "decode" && decodeResult) {
      return (
        <>
          <CopyButton text={decodeResult.decoded} />
          <button className="btn btn-outline btn-sm" onClick={() => navigator.clipboard.writeText(decodeResult.decoded)}>
            Copy
          </button>
        </>
      );
    }
    if (mode === "query" && queryString) {
      return (
        <>
          <CopyButton text={queryString} />
          <button className="btn btn-outline btn-sm" onClick={() => navigator.clipboard.writeText(queryString)}>
            Copy
          </button>
        </>
      );
    }
    return null;
  }, [mode, encodeResult, decodeResult, queryString]);

  return (
    <section className="section-card">
      <div className="card-header">
        <div className="card-title">URL Encoder / Decoder</div>
        <div className="card-tools">
          <button className="btn btn-outline btn-sm" onClick={() => setInput("")}>Clear</button>
        </div>
      </div>
      <div className="card-body">
        <div className="toolbar">
          <div className="field-row">
            <div className="field-col" style={{ flex: 1 }}>
              <div className="field-label">Mode</div>
              <div style={{ display: "flex", gap: 0.5 }}>
                <button
                  className={`btn btn-sm ${mode === "encode" ? "btn-primary" : "btn-outline"}`}
                  onClick={() => handleModeChange("encode")}
                >
                  Encode
                </button>
                <button
                  className={`btn btn-sm ${mode === "decode" ? "btn-primary" : "btn-outline"}`}
                  onClick={() => handleModeChange("decode")}
                >
                  Decode
                </button>
                <button
                  className={`btn btn-sm ${mode === "query" ? "btn-primary" : "btn-outline"}`}
                  onClick={() => handleModeChange("query")}
                >
                  Query Params
                </button>
              </div>
            </div>
          </div>
          {mode === "encode" && (
            <div className="field-row" style={{ marginTop: 0.75 }}>
              <div className="field-col" style={{ flex: 1 }}>
                <div className="field-label">Encoding method</div>
                <select className="input-field" value={encodeMethod} onChange={handleMethodChange}>
                  <option value="encodeURIComponent">encodeURIComponent (full)</option>
                  <option value="encodeURI">encodeURI (preserve URI chars)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="field-row">
          <div className="field-col" style={{ flex: 1 }}>
            <div className="field-label">
              {mode === "encode" ? "URL to encode" : mode === "decode" ? "URL to decode" : "Query params (JSON)"}
            </div>
            <textarea
              className="input-field"
              value={input}
              onChange={handleInputChange}
              rows={4}
              placeholder={mode === "encode"
                ? "https://example.com/search?q=hello world"
                : mode === "decode"
                ? "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world"
                : '{"name":"John Doe","city":"New York"}'} />
          </div>
        </div>

        {mode === "encode" && encodeResult && (
          <div className="section-card" style={{ marginTop: 1.25, border: "none", boxShadow: "none" }}>
            <div className="card-header">
              <div className="card-title">Encoded URL</div>
            </div>
            <div className="card-body">
              <div className="output-wrap">
                <div className="output-block">{encodeResult.encoded}</div>
                <div className="output-actions">
                  {buttons}
                </div>
              </div>
              <div className="tip">Method: {encodeResult.method}</div>
            </div>
          </div>
        )}

        {mode === "decode" && decodeResult && (
          <div className="section-card" style={{ marginTop: 1.25, border: "none", boxShadow: "none" }}>
            <div className="card-header">
              <div className="card-title">Decoded URL</div>
              <span
                className={`badge ${decodeResult.valid ? "badge-success" : "badge-danger"}`}
                style={{ marginLeft: 0.5 }}
              >
                {decodeResult.valid ? "Valid" : "Invalid encoding"}
              </span>
            </div>
            <div className="card-body">
              <div className="output-wrap">
                <div className="output-block">{decodeResult.decoded}</div>
                <div className="output-actions">
                  {buttons}
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === "query" && queryString && (
          <div className="section-card" style={{ marginTop: 1.25, border: "none", boxShadow: "none" }}>
            <div className="card-header">
              <div className="card-title">Query String</div>
            </div>
            <div className="card-body">
              <div className="output-wrap">
                <div className="output-block">{queryString}</div>
                <div className="output-actions">
                  {buttons}
                </div>
              </div>
              <div className="output-wrap" style={{ marginTop: 1 }}>
                <div className="output-label">Parsed parameters</div>
                <table className="table" style={{ width: "100%", marginBottom: 0 }}>
                  <thead>
                    <tr><th>Key</th><th>Value</th></tr>
                  </thead>
                  <tbody>
                    {Object.entries(queryParams ?? {}).map(([key, value]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                    {Object.keys(queryParams ?? {}).length === 0 && (
                      <tr><td colSpan={2} style={{ textAlign: "center", color: "#adb5bd" }}>No parameters</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default UrlEncoder;
