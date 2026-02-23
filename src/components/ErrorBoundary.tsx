import { Component, ReactNode, ErrorInfo } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

// ── Props & State ──────────────────────────────────────────────────────────────

interface Props {
  children: ReactNode;
  /** Optional custom fallback UI — receives the error and a reset callback */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error:    Error | null;
}

// ── Component ──────────────────────────────────────────────────────────────────

/**
 * ErrorBoundary catches any unhandled React render errors in its subtree
 * and shows a graceful fallback instead of a blank white screen.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeComponentThatMightCrash />
 *   </ErrorBoundary>
 *
 * With a custom fallback:
 *   <ErrorBoundary fallback={(err, reset) => <div>...</div>}>
 *     ...
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to console in development; swap for a real error service in production
    console.error("[ErrorBoundary] Caught error:", error);
    console.error("[ErrorBoundary] Component stack:", info.componentStack);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (!hasError || !error) return children;

    // Custom fallback provided by the parent
    if (fallback) return fallback(error, this.reset);

    // Default sacred-theme fallback
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 text-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>

        {/* Heading */}
        <h1 className="font-serif font-bold text-2xl text-foreground mb-2">
          Something went wrong
        </h1>
        <p className="text-muted-foreground font-sans text-sm max-w-sm mb-2">
          An unexpected error occurred. You can try refreshing the page or return home.
        </p>

        {/* Error detail (collapsed, for debugging) */}
        <details className="mb-6 max-w-sm w-full text-left">
          <summary className="text-xs text-muted-foreground/60 font-sans cursor-pointer hover:text-muted-foreground transition-colors">
            Technical details
          </summary>
          <pre className="mt-2 text-xs text-destructive/80 bg-destructive/5 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all font-mono">
            {error.message}
          </pre>
        </details>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={this.reset}
            className="gap-2 font-sans"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </Button>
          <Button
            variant="hero"
            onClick={() => { window.location.href = "/"; }}
            className="gap-2 font-sans"
          >
            <Home className="w-4 h-4" />
            Go home
          </Button>
        </div>

        {/* Brand footer */}
        <p className="mt-10 font-serif text-sm text-muted-foreground/40">
          ॐVani · Your Spiritual Companion
        </p>
      </div>
    );
  }
}

export default ErrorBoundary;
