import { useCallback, useMemo, useState } from "react";
import {
  sum,
  mean,
  median,
  mode,
  variance,
  standardDeviation,
  min,
  max,
} from "@mwakidenis/logx/math";
import { useDebouncedValue } from "@mwakidenis/logx-react/hooks/useDebouncedValue";
import { CopyButton } from "@mwakidenis/logx-react/components/CopyButton";

export function StatsCalculator(): JSX.Element {
  const [rawInput, setRawInput] = useState<string>("12, 45, 22, 89, 34, 12, 78, 56, 34, 90");
  const debouncedInput = useDebouncedValue(rawInput, 300);

  const numbers = useMemo(() => {
    if (!debouncedInput.trim()) return [];
    return debouncedInput
      .split(/[,\s]+/)
      .map((s: string) => s.trim())
      .filter(Boolean)
      .map((s: string) => Number(s))
      .filter((n: number) => !Number.isNaN(n));
  }, [debouncedInput]);

  const stats = useMemo(() => {
    if (numbers.length === 0) {
      return { sum: 0, mean: 0, median: 0, mode: [] as number[], variance: 0, stdDev: 0, min: 0, max: 0, count: 0 };
    }
    try {
      return {
        sum: sum(numbers),
        mean: mean(numbers),
        median: median(numbers),
        mode: mode(numbers),
        variance: variance(numbers),
        stdDev: standardDeviation(numbers),
        min: min(numbers),
        max: max(numbers),
        count: numbers.length,
      };
    } catch {
      return { sum: 0, mean: 0, median: 0, mode: [] as number[], variance: 0, stdDev: 0, min: 0, max: 0, count: numbers.length };
    }
  }, [numbers]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawInput(e.target.value);
  }, []);

  const statRows = [
    { label: "Sum", value: stats.sum.toFixed(2), icon: "#", color: "primary" },
    { label: "Mean", value: stats.mean.toFixed(2), icon: "μ", color: "primary" },
    { label: "Median", value: stats.median.toFixed(2), icon: "÷", color: "primary" },
    { label: "Mode", value: stats.mode.join(", ") || "—", icon: "●", color: "success" },
    { label: "Variance", value: stats.variance.toFixed(4), icon: "σ²", color: "primary" },
    { label: "Std. Deviation", value: stats.stdDev.toFixed(4), icon: "σ", color: "primary" },
    { label: "Min", value: stats.min.toFixed(2), icon: "▼", color: "danger" },
    { label: "Max", value: stats.max.toFixed(2), icon: "▲", color: "success" },
  ];

  return (
    <section className="section-card">
      <div className="section-header">
        <div className="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="12" x2="2" y2="12"></line><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2z"></path><polyline points="22 7 17 12 22 17"></polyline><polyline points="2 17 7 12 2 7"></polyline></svg>
          Statistical Calculator
        </div>
        <div className="section-actions">
          <button className="btn btn-outline btn-sm" onClick={() => setRawInput("")}>Clear</button>
        </div>
      </div>
      <div className="section-body">
        <div className="field-row">
          <div className="field-col" style={{ flex: 1 }}>
            <div className="field-label">Numeric sequence</div>
            <textarea className="input-field" value={rawInput} onChange={handleInputChange} rows={4} placeholder="e.g. 12, 45, 22, 89, 34" />
            <div className="tip">Parsed {numbers.length} number{s(numbers.length)}.</div>
          </div>
        </div>

        <div className="stats-grid">
          {statRows.map((row) => (
            <div key={row.label} className="stat-card">
              <div className="stat-header">
                <div className="stat-label">{row.label}</div>
                <div className="stat-icon">{row.icon}</div>
              </div>
              <div className={`stat-value ${row.color === "success" ? "text-success" : row.color === "danger" ? "text-danger" : ""}`}>{row.value}</div>
            </div>
          ))}
        </div>

        <div className="two-col">
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="4" x2="23" y2="4"></line><line x1="1" y1="20" x2="23" y2="20"></line><rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect><line x1="16" y1="13" x2="16" y2="21"></line><line x1="10" y1="13" x2="6" y2="21"></line></svg>
                Raw numbers (parsed)
              </div>
              <div className="output-block">{JSON.stringify(numbers, null, 2)}</div>
              <div className="output-actions">
                <CopyButton text={JSON.stringify(numbers, null, 2)} />
              </div>
            </div>
          </div>
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
                Mode values
              </div>
              <div className="output-block">
                {stats.mode.length > 0 ? JSON.stringify(stats.mode, null, 2) : "No mode (all values unique)"}
              </div>
              <div className="output-actions">
                <CopyButton text={JSON.stringify(stats.mode, null, 2)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function s(n: number): string {
  return n === 1 ? "" : "s";
}

export default StatsCalculator;
