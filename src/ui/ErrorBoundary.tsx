// ============================================================================
// DataForge Toolkit — Local UI: ErrorBoundary
// Inlined from @mwakidenis/logx-react for self-contained builds
// ============================================================================

import { Component, ReactNode } from "react";
import type { CSSProperties } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ((error: Error, reset: () => void) => ReactNode) | ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }): void {
    console.error("[DataForge Toolkit] ErrorBoundary caught an error:", error, errorInfo);
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (typeof fallback === "function") {
        return (fallback as (error: Error, reset: () => void) => ReactNode)(error as Error, this.reset);
      }
      if (fallback) {
        return fallback;
      }
      return (
        <div style={errorBoundaryFallbackStyle}>
          <h3>Something went wrong</h3>
          <p>{error ? error.message : "An unknown error occurred"}</p>
          <button onClick={this.reset}>Try again</button>
        </div>
      );
    }

    return children;
  }
}

const errorBoundaryFallbackStyle: CSSProperties = {
  padding: "24px",
  border: "1px solid #ef4444",
  backgroundColor: "#fef2f2",
  color: "#991b1b",
  borderRadius: "8px",
};
