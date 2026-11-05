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

  const statBoxes = [
    { label: "Sum", value: stats.sum.toFixed(2), icon: "#", variant: "primary", unit: "" },
    { label: "Mean", value: stats.mean.toFixed(2), icon: "μ", variant: "primary", unit: "" },
    { label: "Median", value: stats.median.toFixed(2), icon: "÷", variant: "primary", unit: "" },
    { label: "Mode", value: stats.mode.join(", ") || "—", icon: "●", variant: "success", unit: "" },
    { label: "Variance", value: stats.variance.toFixed(4), icon: "σ²", variant: "primary", unit: "" },
    { label: "Std. Dev.", value: stats.stdDev.toFixed(4), icon: "σ", variant: "primary", unit: "" },
    { label: "Min", value: stats.min.toFixed(2), icon: "▼", variant: "danger", unit: "" },
    { label: "Max", value: stats.max.toFixed(2), icon: "▲", variant: "success", unit: "" },
  ];

  return (
    <section className="section-card">
      <div className="card-header">
        <div className="card-title">Statistical Quick-Calculator</div>
        <div className="card-tools">
          <button className="btn btn-outline btn-sm" onClick={() => setRawInput("")}>Clear input</button>
        </div>
      </div>
      <div className="card-body">
        <div className="field-row">
          <div className="field-col" style={{ flex: 1 }}>
            <div className="field-label">Numeric sequence</div>
            <textarea className="input-field" value={rawInput} onChange={handleInputChange} rows={3} placeholder="e.g. 12, 45, 22, 89, 34" />
            <div className="tip">Parsed {numbers.length} number{s(numbers.length)}.</div>
          </div>
        </div>

        <div className="four-col">
          {statBoxes.map((box) => (
            <div key={box.label} className={`small-box small-box-${box.variant}`}>
              <div className="inner">
                <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6c757d", marginBottom: 0.375 }}>{box.label}</div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#212529", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{box.value}</div>
              </div>
              <div className="small-box-icon">{box.icon}</div>
              <div className="small-box-footer">
                <a href="#" onClick={(e) => e.preventDefault()}>Details</a>
              </div>
            </div>
          ))}
        </div>

        <div className="four-col">
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">Raw numbers (parsed)</div>
              <div className="output-block">{JSON.stringify(numbers, null, 2)}</div>
              <div className="output-actions">
                <CopyButton text={JSON.stringify(numbers, null, 2)} />
              </div>
            </div>
          </div>
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">Mode values</div>
              <div className="output-block">{stats.mode.length > 0 ? JSON.stringify(stats.mode, null, 2) : "No mode (all values unique)"}</div>
              <div className="output-actions">
                <CopyButton text={JSON.stringify(stats.mode, null, 2)} />
              </div>
            </div>
          </div>
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">Sorted sequence</div>
              <div className="output-block">{JSON.stringify([...numbers].sort((a, b) => a - b), null, 2)}</div>
              <div className="output-actions">
                <CopyButton text={JSON.stringify([...numbers].sort((a, b) => a - b), null, 2)} />
              </div>
            </div>
          </div>
          <div className="field-col">
            <div className="output-wrap">
              <div className="output-label">Distribution table</div>
              <table className="table" style={{ width: "100%" }}>
                <thead>
                  <tr><th>Value</th><th>Frequency</th><th>%</th></tr>
                </thead>
                <tbody>
                  {(() => {
                    const freq = new Map<number, number>();
                    for (const n of numbers) freq.set(n, (freq.get(n) || 0) + 1);
                    return Array.from(freq.entries()).map(([val, count]) => (
                      <tr key={val}>
                        <td>{val}</td>
                        <td>{count}</td>
                        <td>{((count / numbers.length) * 100).toFixed(1)}%</td>
                      </tr>
                    ));
                  })()}
                  {numbers.length === 0 && <tr><td colSpan={3} style={{ textAlign: "center", color: "#adb5bd" }}>No data</td></tr>}
                </tbody>
              </table>
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
