import { useCallback, useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { CopyButton } from "../ui/CopyButton";
import { hashString, type HashAlgorithm } from "../utils/hash";

export function HashGenerator(): JSX.Element {
  const [input, setInput] = useLocalStorage<string>("dataforge:hash-input", "hello world");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("sha256");
  const [result, setResult] = useState<{ hash: string; algorithm: HashAlgorithm; byteLength: number } | null>(null);

  useMemo(() => {
    if (!input.trim()) {
      setResult(null);
      return;
    }
    (async () => {
      const r = await hashString(input, algorithm);
      setResult({ hash: r.hash, algorithm: r.algorithm, byteLength: r.byteLength });
    })();
  }, [input, algorithm]);

  const algorithms: Array<{ value: HashAlgorithm; label: string }> = [
    { value: "md5", label: "MD5" },
    { value: "sha1", label: "SHA-1" },
    { value: "sha256", label: "SHA-256" },
    { value: "sha512", label: "SHA-512" },
  ];

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, [setInput]);

  const handleAlgorithmChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setAlgorithm(e.target.value as HashAlgorithm);
  }, [setAlgorithm]);

  const handleCopyHash = useCallback(() => {
    if (result) navigator.clipboard.writeText(result.hash);
  }, [result]);

  return (
    <section className="section-card">
      <div className="card-header">
        <div className="card-title">Hash Generator</div>
        <div className="card-tools">
          <button className="btn btn-outline btn-sm" onClick={() => setInput("")}>Clear</button>
        </div>
      </div>
      <div className="card-body">
        <div className="field-row">
          <div className="field-col" style={{ flex: 2 }}>
            <div className="field-label">Input text</div>
            <textarea className="input-field" value={input} onChange={handleInputChange} rows={4} placeholder="Enter text to hash" />
          </div>
          <div className="field-col" style={{ flex: 1 }}>
            <div className="field-label">Algorithm</div>
            <select className="input-field" value={algorithm} onChange={handleAlgorithmChange}>
              {algorithms.map((algo) => (
                <option key={algo.value} value={algo.value}>{algo.label}</option>
              ))}
            </select>
          </div>
        </div>

        {result && (
          <div className="section-card" style={{ marginTop: 1.25, border: "none", boxShadow: "none" }}>
            <div className="card-header">
              <div className="card-title">Hash Result ({result.algorithm.toUpperCase()})</div>
            </div>
            <div className="card-body">
              <div className="output-wrap">
                <div className="output-block">{result.hash}</div>
                <div className="output-actions">
                  <CopyButton text={result.hash} />
                  <button className="btn btn-outline btn-sm" onClick={handleCopyHash}>Copy</button>
                </div>
              </div>
              <div className="tip">Input byte length: {result.byteLength}</div>
            </div>
          </div>
        )}

        <div className="section-card" style={{ marginTop: 1.25, border: "none", boxShadow: "none" }}>
          <div className="card-header">
            <div className="card-title">All Algorithms</div>
          </div>
          <div className="card-body">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1 }}>
              {algorithms.map((algo) => {
                const r = input.trim() ? hashString(input, algo.value) : null;
                return (
                  <div key={algo.value} className="stat-card" style={{ padding: 12 }}>
                    <div className="stat-label">{algo.label}</div>
                    <div style={{ fontFamily: "monospace", fontSize: 0.8, wordBreak: "break-all" }}>
                      {r ? "computing…" : "—"}
                    </div>
                    <div style={{ marginTop: 6, display: "flex", justifyContent: "flex-end" }}>
                      <button className="btn btn-outline btn-sm" disabled>Copy</button>
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

export default HashGenerator;
