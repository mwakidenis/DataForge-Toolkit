import { useCallback, useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { CopyButton } from "../ui/CopyButton";
import { decodeJwt, isValidJwtFormat } from "../utils/jwt";

export function JwtDecoder(): JSX.Element {
  const [token, setToken] = useLocalStorage<string>("dataforge:jwt-token", "");
  const [pretty, setPretty] = useState<boolean>(true);

  const result = useMemo(() => {
    if (!token.trim()) return null;
    if (!isValidJwtFormat(token)) {
      return { valid: false, error: "Invalid JWT format" } as const;
    }
    return decodeJwt(token);
  }, [token]);

  const handleTokenChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setToken(e.target.value);
  }, [setToken]);

  const renderJson = (obj: Record<string, unknown>): JSX.Element => {
    const json = pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
    return <div className="output-block">{json}</div>;
  };

  return (
    <section className="section-card">
      <div className="card-header">
        <div className="card-title">JWT Decoder</div>
        <div className="card-tools">
          <label style={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: 0.75, color: "#6c757d", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={pretty}
              onChange={() => setPretty(!pretty)}
              style={{ cursor: "pointer" }}
            />
            Pretty print
          </label>
          <button className="btn btn-outline btn-sm" onClick={() => setToken("")}>Clear</button>
        </div>
      </div>
      <div className="card-body">
        <div className="field-row">
          <div className="field-col" style={{ flex: 1 }}>
            <div className="field-label">JWT token</div>
            <textarea className="input-field" value={token} onChange={handleTokenChange} rows={4} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." />
            {!token.trim() && <div className="tip" style={{ color: "#6c757d", marginTop: 0.375 }}>Paste a JWT token to decode</div>}
            {!token.trim() === false && result && !result.valid && (
              <div className="tip" style={{ color: "#dc3545", marginTop: 0.375 }}>{result.error}</div>
            )}
          </div>
        </div>

        {result && result.valid && !("error" in result) && (
          <div className="four-col">
            <div className="field-col">
              <div className="output-wrap">
                <div className="output-label">Header</div>
                {renderJson(result.header as Record<string, unknown>)}
                <div className="output-actions" style={{ marginTop: 0.5 }}>
                  <CopyButton text={result.headerRaw} />
                </div>
              </div>
            </div>
            <div className="field-col">
              <div className="output-wrap">
                <div className="output-label">Payload</div>
                {renderJson(result.payload as Record<string, unknown>)}
                <div className="output-actions" style={{ marginTop: 0.5 }}>
                  <CopyButton text={result.payloadRaw} />
                </div>
              </div>
            </div>
            <div className="field-col">
              <div className="output-wrap">
                <div className="output-label">Signature</div>
                <div className="output-block">{result.signature}</div>
                <div className="output-actions" style={{ marginTop: 0.5 }}>
                  <CopyButton text={result.signature} />
                </div>
              </div>
            </div>
            <div className="field-col">
              <div className="small-box text-bg-success">
                <div className="inner">
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255,255,255,0.8)", marginBottom: 0.375 }}>Status</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>Valid</div>
                </div>
                <div className="small-box-icon"><i className="bi bi-check-circle"></i></div>
              </div>
              <div style={{ marginTop: 1 }}>
                <div className="output-label">Algorithm</div>
                <div className="output-block">{String(result.header.alg || "—")}</div>
              </div>
              <div style={{ marginTop: 1 }}>
                <div className="output-label">Type</div>
                <div className="output-block">{String(result.header.typ || "—")}</div>
              </div>
            </div>
          </div>
        )}

        {result && !result.valid && "error" in result && (
          <div className="section-card" style={{ marginTop: 1.25, border: "none", boxShadow: "none" }}>
            <div className="card-header">
              <div className="card-title">Error</div>
            </div>
            <div className="card-body">
              <div className="empty-state">
                <h3>Invalid JWT</h3>
                <p>{result.error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default JwtDecoder;
