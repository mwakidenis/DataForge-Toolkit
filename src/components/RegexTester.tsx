import { useCallback, useMemo, useState } from "react";
import { useLocalStorage } from "@mwakidenis/logx-react/hooks/useLocalStorage";
import { CopyButton } from "@mwakidenis/logx-react/components/CopyButton";
import {
  testRegex,
  findAllMatches,
  replaceRegex,
  validateRegex,
  type RegexMatchResult,
} from "../services/regexService";

export function RegexTester(): JSX.Element {
  const [input, setInput] = useLocalStorage<string>("dataforge:regex-input", "The quick brown fox jumps over the lazy dog");
  const [pattern, setPattern] = useLocalStorage<string>("dataforge:regex-pattern", "\\b\\w{4}\\b");
  const [flags, setFlags] = useState<string>("g");
  const [replacement, setReplacement] = useState<string>("****");

  const validation = useMemo(() => validateRegex(pattern, flags), [pattern, flags]);

  const matchResult = useMemo(() => {
    if (!validation.valid) return null;
    try {
      return testRegex(input, pattern, flags);
    } catch {
      return null;
    }
  }, [input, pattern, flags, validation.valid]);

  const allMatches = useMemo(() => {
    if (!validation.valid || !flags.includes("g")) return null;
    try {
      return findAllMatches(input, pattern, flags);
    } catch {
      return null;
    }
  }, [input, pattern, flags, validation.valid]);

  const replaceResult = useMemo(() => {
    if (!validation.valid) return null;
    try {
      return replaceRegex(input, pattern, replacement, flags);
    } catch {
      return null;
    }
  }, [input, pattern, replacement, flags, validation.valid]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, [setInput]);

  const handlePatternChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPattern(e.target.value);
  }, [setPattern]);

  const handleReplacementChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setReplacement(e.target.value);
  }, [setReplacement]);

  const highlightMatches = (text: string, result: RegexMatchResult | null): JSX.Element => {
    if (!result || !result.hasMatch) return <span>{text}</span>;
    const { matches, index } = result;
    if (!matches || index === -1) return <span>{text}</span>;

    const fullMatch = matches[0];
    const before = text.slice(0, index);
    const matched = text.slice(index, index + fullMatch.length);
    const after = text.slice(index + fullMatch.length);

    return (
      <span>
        {before}
        <mark style={{ background: "#fff3cd", color: "#856404", padding: "0 2px", borderRadius: 2 }}>{matched}</mark>
        {after}
      </span>
    );
  };

  const flagOptions = [
    { label: "g (global)", value: "g" },
    { label: "i (ignore case)", value: "i" },
    { label: "m (multiline)", value: "m" },
    { label: "s (dotAll)", value: "s" },
  ];

  return (
    <section className="section-card">
      <div className="card-header">
        <div className="card-title">Regex Tester</div>
        <div className="card-tools">
          {!validation.valid && (
            <span className="status-indicator" style={{ background: "#f8d7da", color: "#721c24" }}>
              <span className="status-dot invalid"></span>
              Invalid pattern
            </span>
          )}
        </div>
      </div>
      <div className="card-body">
        <div className="field-row">
          <div className="field-col" style={{ flex: 1 }}>
            <div className="field-label">Test string</div>
            <textarea className="input-field" value={input} onChange={handleInputChange} rows={5} />
          </div>
          <div className="field-col" style={{ flex: 1 }}>
            <div className="field-label">Pattern</div>
            <input className="input-field" type="text" value={pattern} onChange={handlePatternChange} placeholder="e.g. \\b\\w{4}\\b" />
            <div className="field-label" style={{ marginTop: 0.75 }}>Replacement</div>
            <input className="input-field" type="text" value={replacement} onChange={handleReplacementChange} placeholder="e.g. ****" />
          </div>
        </div>

        <div className="toolbar" style={{ marginTop: 0.75 }}>
          <div className="field-row">
            <div className="field-col" style={{ flex: 1 }}>
              <div className="field-label">Flags</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {flagOptions.map((opt) => {
                  const active = flags.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      className={`btn btn-sm ${active ? "btn-primary" : "btn-outline"}`}
                      onClick={() => {
                        const newFlags = active
                          ? flags.replace(opt.value, "")
                          : flags + opt.value;
                        setFlags(newFlags);
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              <div className="tip">Toggle regex flags: g, i, m, s</div>
            </div>
            <div className="field-col" style={{ flex: 0, flexBasis: "140px" }}>
              <div className="field-label">Validation</div>
              <div className="status-indicator" style={{ background: validation.valid ? "#d4edda" : "#f8d7da" }}>
                <span className={`status-dot ${validation.valid ? "valid" : "invalid"}`}></span>
                {validation.valid ? "Valid pattern" : validation.error}
              </div>
            </div>
          </div>
        </div>

        {matchResult && (
          <div className="section-card" style={{ marginTop: 1.25, border: "none", boxShadow: "none" }}>
            <div className="card-header">
              <div className="card-title">Match Results</div>
            </div>
            <div className="card-body">
              <div className="stats-grid">
                <div className="small-box text-bg-primary">
                  <div className="inner">
                    <h3>{matchResult.matchCount}</h3>
                    <p>Total matches</p>
                  </div>
                  <div className="small-box-icon"><i className="bi bi-search"></i></div>
                </div>
                <div className="small-box text-bg-success">
                  <div className="inner">
                    <h3>{matchResult.hasMatch ? "Yes" : "No"}</h3>
                    <p>Has match</p>
                  </div>
                  <div className="small-box-icon"><i className="bi bi-check-circle"></i></div>
                </div>
                <div className="small-box text-bg-info">
                  <div className="inner">
                    <h3>{matchResult.index}</h3>
                    <p>First index</p>
                  </div>
                  <div className="small-box-icon"><i className="bi bi-arrow-90deg-right"></i></div>
                </div>
              </div>

              <div className="output-wrap" style={{ marginTop: 1 }}>
                <div className="output-label">Highlighted match</div>
                <div className="output-block" style={{ maxHeight: 100 }}>
                  {highlightMatches(input, matchResult)}
                </div>
              </div>

              {allMatches && allMatches.matches.length > 1 && (
                <div className="output-wrap" style={{ marginTop: 1 }}>
                  <div className="output-label">All matches</div>
                  <div className="output-block">{JSON.stringify(allMatches.matches.map((m) => m[0]), null, 2)}</div>
                  <div className="output-actions">
                    <CopyButton text={JSON.stringify(allMatches.matches.map((m) => m[0]), null, 2)} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {replaceResult && (
          <div className="section-card" style={{ marginTop: 1.25, border: "none", boxShadow: "none" }}>
            <div className="card-header">
              <div className="card-title">Replacement Result ({replaceResult.replacements} replacements)</div>
            </div>
            <div className="card-body">
              <div className="output-wrap">
                <div className="output-block">{replaceResult.result}</div>
                <div className="output-actions">
                  <CopyButton text={replaceResult.result} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default RegexTester;
