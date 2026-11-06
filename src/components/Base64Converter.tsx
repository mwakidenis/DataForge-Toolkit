import { useCallback, useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { CopyButton } from "../ui/CopyButton";
import {
  base64Encode,
  base64Decode,
  isValidBase64,
} from "../utils/base64";

export function Base64Converter(): JSX.Element {
  const [input, setInput] = useLocalStorage<string>("dataforge:base64-input", "Hello, DataForge Toolkit!");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [urlSafe, setUrlSafe] = useState<boolean>(false);

  const encodeResult = useMemo(() => {
    if (mode !== "encode") return null;
    return base64Encode(input, urlSafe);
  }, [input, mode, urlSafe]);

  const decodeResult = useMemo(() => {
    if (mode !== "decode") return null;
    return base64Decode(input, urlSafe);
  }, [input, mode, urlSafe]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, [setInput]);

  const handleModeChange = useCallback((next: "encode" | "decode") => {
    setMode(next);
  }, [setMode]);

  const handleUrlSafeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlSafe(e.target.checked);
  }, [setUrlSafe]);

  const handleCopyResult = useCallback(() => {
    if (mode === "encode" && encodeResult) {
      navigator.clipboard.writeText(encodeResult.encoded);
    } else if (mode === "decode" && decodeResult) {
      navigator.clipboard.writeText(decodeResult.decoded);
    }
  }, [mode, encodeResult, decodeResult]);

  return (
    <section className="section-card">
      <div className="card-header">
        <div className="card-title">Base64 Encoder / Decoder</div>
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
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 0.5, marginLeft: 1, fontSize: 0.75, color: "#6c757d", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={urlSafe}
                  onChange={handleUrlSafeChange}
                  style={{ cursor: "pointer" }}
                />
                URL-safe variant
              </label>
            </div>
          </div>
        </div>

        <div className="field-row">
          <div className="field-col" style={{ flex: 1 }}>
            <div className="field-label">
              {mode === "encode" ? "Text to encode" : "Base64 to decode"}
            </div>
            <textarea
              className="input-field"
              value={input}
              onChange={handleInputChange}
              rows={4}
              placeholder={mode === "encode" ? "Hello, World!" : "SGVsbG8sIERhdGFGb2JnZSBUb29sazE="}
            />
            {mode === "decode" && !isValidBase64(input, urlSafe) && (
              <div className="tip" style={{ color: "#dc3545", marginTop: 0.375 }}>
                Invalid Base64 input
              </div>
            )}
          </div>
        </div>

        {mode === "encode" && encodeResult && (
          <div className="section-card" style={{ marginTop: 1.25, border: "none", boxShadow: "none" }}>
            <div className="card-header">
              <div className="card-title">Encoded Base64</div>
              <span className="badge badge-info" style={{ marginLeft: 0.5 }}>
                {encodeResult.byteLength} bytes
              </span>
            </div>
            <div className="card-body">
              <div className="output-wrap">
                <div className="output-block">{encodeResult.encoded}</div>
                <div className="output-actions">
                  <CopyButton text={encodeResult.encoded} />
                  <button className="btn btn-outline btn-sm" onClick={handleCopyResult}>Copy</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === "decode" && decodeResult && (
          <div className="section-card" style={{ marginTop: 1.25, border: "none", boxShadow: "none" }}>
            <div className="card-header">
              <div className="card-title">Decoded Text</div>
              <span
                className={`badge ${decodeResult.valid ? "badge-success" : "badge-danger"}`}
                style={{ marginLeft: 0.5 }}
              >
                {decodeResult.valid ? "Valid" : "Invalid"}
              </span>
            </div>
            <div className="card-body">
              <div className="output-wrap">
                <div className="output-block">{decodeResult.decoded}</div>
                <div className="output-actions">
                  <CopyButton text={decodeResult.decoded} />
                  <button className="btn btn-outline btn-sm" onClick={handleCopyResult}>Copy</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Base64Converter;
