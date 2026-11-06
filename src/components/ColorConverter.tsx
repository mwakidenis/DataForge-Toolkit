import { useCallback, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { CopyButton } from "../ui/CopyButton";
import { formatColorResult } from "../utils/color";

export function ColorConverter(): JSX.Element {
  const [input, setInput] = useLocalStorage<string>("dataforge:color-input", "#ff5733");

  const result = useMemo(() => {
    if (!input.trim()) return null;
    return formatColorResult(input);
  }, [input]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, [setInput]);

  const colorSwatchStyle: React.CSSProperties = result
    ? { width: 60, height: 60, borderRadius: 8, background: result.hex, border: "1px solid #dee2e6" }
    : { width: 60, height: 60, borderRadius: 8, background: "#f8f9fa", border: "1px solid #dee2e6" };

  return (
    <section className="section-card">
      <div className="card-header">
        <div className="card-title">Color Converter</div>
        <div className="card-tools">
          <button className="btn btn-outline btn-sm" onClick={() => setInput("")}>Clear</button>
        </div>
      </div>
      <div className="card-body">
        <div className="field-row">
          <div className="field-col" style={{ flex: 2 }}>
            <div className="field-label">Color value</div>
            <textarea className="input-field" value={input} onChange={handleInputChange} rows={3} placeholder="#ff5733" />
            {!input.trim() === false && result && !result.valid && (
              <div className="tip" style={{ color: "#dc3545", marginTop: 0.375 }}>Invalid color format</div>
            )}
          </div>
          <div className="field-col" style={{ flex: 1 }}>
            <div className="field-label">Preview</div>
            <div style={colorSwatchStyle}></div>
          </div>
        </div>

        {result && result.valid && (
          <div className="section-card" style={{ marginTop: 1.25, border: "none", boxShadow: "none" }}>
            <div className="card-header">
              <div className="card-title">Converted values</div>
            </div>
            <div className="card-body">
              <div className="four-col">
                <div className="field-col">
                  <div className="output-wrap">
                    <div className="output-label">HEX</div>
                    <div className="output-block">{result.hex}</div>
                    <div className="output-actions" style={{ marginTop: 0.5 }}>
                      <CopyButton text={result.hex} />
                    </div>
                  </div>
                </div>
                <div className="field-col">
                  <div className="output-wrap">
                    <div className="output-label">RGB</div>
                    <div className="output-block">{result.rgb}</div>
                    <div className="output-actions" style={{ marginTop: 0.5 }}>
                      <CopyButton text={result.rgb} />
                    </div>
                  </div>
                </div>
                <div className="field-col">
                  <div className="output-wrap">
                    <div className="output-label">HSL</div>
                    <div className="output-block">{result.hsl}</div>
                    <div className="output-actions" style={{ marginTop: 0.5 }}>
                      <CopyButton text={result.hsl} />
                    </div>
                  </div>
                </div>
                <div className="field-col">
                  <div className="small-box text-bg-info">
                    <div className="inner">
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255,255,255,0.8)", marginBottom: 0.375 }}>Preview</div>
                      <div style={colorSwatchStyle}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!result || !result.valid ? (
          <div className="empty-state" style={{ marginTop: 1 }}>
            <h3>Enter a color value</h3>
            <p>Supported: #ff5733, rgb(255, 87, 51), hsl(11, 100%, 60%)</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default ColorConverter;
