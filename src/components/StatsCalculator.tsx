import { useCallback, useMemo, useState } from "react";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { CopyButton } from "../ui/CopyButton";
import { transformStats, generateSummaryReport } from "../services/statsService";

export function StatsCalculator(): JSX.Element {
  const [rawInput, setRawInput] = useState<string>("12, 45, 22, 89, 34, 12, 78, 56, 34, 90");
  const [delimiter, setDelimiter] = useState<"," | "\n" | ";" | " " | "\t">(",");
  const debouncedInput = useDebouncedValue(rawInput, 300);

  const result = useMemo(() => {
    return transformStats(debouncedInput, { delimiter });
  }, [debouncedInput, delimiter]);

  const { numbers, parsedCount, stats, sorted } = result;

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawInput(e.target.value);
  }, [setRawInput]);

  const handleDelimiterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setDelimiter(e.target.value as "," | "\n" | ";" | " " | "\t");
  }, [setDelimiter]);

  const handleClearInput = useCallback(() => { setRawInput(""); }, [setRawInput]);

  const handleDownloadReport = useCallback(() => {
    const report = generateSummaryReport(stats, rawInput);
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dataforge-stats-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [stats, rawInput]);

  const statBoxes: Array<{ label: string; value: string; icon: string; variant: string }> = [
    { label: "Sum", value: stats.sum.toFixed(2), icon: "bi-hash", variant: "primary" },
    { label: "Mean", value: stats.mean.toFixed(2), icon: "bi-slash-square", variant: "primary" },
    { label: "Median", value: stats.median.toFixed(2), icon: "bi-divide", variant: "primary" },
    { label: "Mode", value: stats.mode.join(", ") || "—", icon: "bi-dash-circle", variant: "success" },
    { label: "Variance", value: stats.variance.toFixed(4), icon: "bi-calculator-fill", variant: "primary" },
    { label: "Std. Dev.", value: stats.stdDev.toFixed(4), icon: "bi-pie-chart-fill", variant: "primary" },
    { label: "Min", value: stats.min.toFixed(2), icon: "bi-arrow-down", variant: "danger" },
    { label: "Max", value: stats.max.toFixed(2), icon: "bi-arrow-up", variant: "success" },
  ];

  const extendedStats: Array<{ label: string; value: string }> = [
    { label: "Count", value: stats.count.toString() },
    { label: "Range", value: stats.range.toFixed(4) },
    { label: "IQR", value: stats.iqr.toFixed(6) },
    { label: "P25", value: stats.p25.toFixed(4) },
    { label: "P50", value: stats.p50.toFixed(4) },
    { label: "P75", value: stats.p75.toFixed(4) },
    { label: "P90", value: stats.p90.toFixed(4) },
    { label: "P95", value: stats.p95.toFixed(4) },
  ];

  return (
    <section className="section-card">
      <div className="card-header">
        <div className="card-title">Statistical Quick-Calculator</div>
        <div className="card-tools">
          <button className="btn btn-outline btn-sm" onClick={handleClearInput}>Clear input</button>
          <button className="btn btn-primary btn-sm" onClick={handleDownloadReport}>Download report</button>
        </div>
      </div>
      <div className="card-body">
        <div className="field-row">
          <div className="field-col" style={{ flex: 1.5 }}>
            <div className="field-label">Numeric sequence</div>
            <textarea className="input-field" value={rawInput} onChange={handleInputChange} rows={3} placeholder="e.g. 12, 45, 22, 89, 34" />
            <div className="tip">Parsed {parsedCount} number{parsedCount === 1 ? "" : "s"}.</div>
          </div>
          <div className="field-col" style={{ flex: 1 }}>
            <div className="field-label">Delimiter</div>
            <select className="input-field" value={delimiter} onChange={handleDelimiterChange}>
              <option value=",">Comma (,)</option>
              <option value="\n">Newline</option>
              <option value=";">Semicolon (;)</option>
              <option value=" ">Space</option>
              <option value="\t">Tab</option>
            </select>
          </div>
        </div>

        <div className="four-col">
          {statBoxes.map((box) => (
            <div key={box.label} className={`small-box text-bg-${box.variant}`}>
              <div className="inner">
                <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255,255,255,0.8)", marginBottom: 0.375 }}>{box.label}</div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{box.value}</div>
              </div>
              <div className="small-box-icon"><i className={`bi ${box.icon}`}></i></div>
              <div className="small-box-footer">
                <a href="#" onClick={(e) => e.preventDefault()}>Details</a>
              </div>
            </div>
          ))}
        </div>

        <div className="four-col">
          {extendedStats.map((box) => (
            <div key={box.label} className="small-box text-bg-secondary" style={{ background: "#6c757d" }}>
              <div className="inner">
                <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255,255,255,0.8)", marginBottom: 0.375 }}>{box.label}</div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{box.value}</div>
              </div>
              <div className="small-box-icon"><i className="bi bi-sliders"></i></div>
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
              <div className="output-block">{JSON.stringify(sorted, null, 2)}</div>
              <div className="output-actions">
                <CopyButton text={JSON.stringify(sorted, null, 2)} />
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
                  {stats.frequency.map((entry) => (
                    <tr key={String(entry.value)}>
                      <td>{entry.value}</td>
                      <td>{entry.count}</td>
                      <td>{entry.percentage.toFixed(1)}%</td>
                    </tr>
                  ))}
                  {stats.frequency.length === 0 && <tr><td colSpan={3} style={{ textAlign: "center", color: "#adb5bd" }}>No data</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsCalculator;
