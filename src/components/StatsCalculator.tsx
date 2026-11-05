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
      return {
        sum: 0,
        mean: 0,
        median: 0,
        mode: [] as number[],
        variance: 0,
        stdDev: 0,
        min: 0,
        max: 0,
        count: 0,
      };
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
      return {
        sum: 0,
        mean: 0,
        median: 0,
        mode: [] as number[],
        variance: 0,
        stdDev: 0,
        min: 0,
        max: 0,
        count: numbers.length,
      };
    }
  }, [numbers]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawInput(e.target.value);
  }, []);

  return (
    <section className="card">
      <h3>3. Statistical Quick-Calculator</h3>
      <p className="tip">Enter comma- or space-separated numbers. Statistics update instantly.</p>

      <div className="section">
        <label>Numeric sequence</label>
        <textarea value={rawInput} onChange={handleInputChange} />
        <div className="tip">Parsed {numbers.length} number{s(numbers.length)}.</div>
      </div>

      <div className="grid">
        <StatCard label="Sum" value={stats.sum.toFixed(2)} />
        <StatCard label="Mean" value={stats.mean.toFixed(2)} />
        <StatCard label="Median" value={stats.median.toFixed(2)} />
        <StatCard label="Mode" value={stats.mode.join(", ") || "—"} color="accent" />
        <StatCard label="Variance" value={stats.variance.toFixed(4)} />
        <StatCard label="Std. Deviation" value={stats.stdDev.toFixed(4)} />
        <StatCard label="Min" value={stats.min.toFixed(2)} />
        <StatCard label="Max" value={stats.max.toFixed(2)} />
      </div>

      <div className="section">
        <label>Raw numbers (parsed)</label>
        <div className="output-block">{JSON.stringify(numbers, null, 2)}</div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <CopyButton text={JSON.stringify(numbers, null, 2)} />
        </div>
      </div>
    </section>
  );
}

function s(n: number): string {
  return n === 1 ? "" : "s";
}

interface StatCardProps {
  label: string;
  value: string;
  color?: "accent";
}

function StatCard({ label, value, color }: StatCardProps): JSX.Element {
  return (
    <div className="stat-card">
      <div className="label">{label}</div>
      <div className={`value ${color === "accent" ? "mode" : ""}`}>{value}</div>
    </div>
  );
}

export default StatsCalculator;
