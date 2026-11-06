// ============================================================================
// DataForge Toolkit — Local UI: CopyButton
// Inlined from @mwakidenis/logx-react for self-contained builds
// ============================================================================

import { useCallback, useState } from "react";
import type { CSSProperties } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  onCopy?: (text: string) => void;
}

export function CopyButton({ text, label = "Copy", copiedLabel = "Copied!", onCopy }: CopyButtonProps): JSX.Element {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    onCopy?.(text);
  }, [text, onCopy]);

  const baseStyle: CSSProperties = {
    padding: "4px 10px",
    fontSize: "0.75rem",
    fontWeight: 600,
    borderRadius: "0.25rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "1px solid transparent",
    display: "inline-flex",
    alignItems: "center",
    gap: 0.5,
  };

  const style: CSSProperties = copied
    ? { ...baseStyle, background: "#198754", color: "#fff", borderColor: "#198754" }
    : { ...baseStyle, background: "#f8f9fa", color: "#6c757d", borderColor: "#dee2e6" };

  return (
    <button
      onClick={handleCopy}
      title={copied ? copiedLabel : label}
      style={style}
    >
      {copied ? "✓ " + copiedLabel : label}
    </button>
  );
}
