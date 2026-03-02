import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "@/components/BottomNav";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Suspense, lazy, ComponentType } from "react";

// ── Retry wrapper for lazy imports ─────────────────────────────────────────────
// After a new deploy Vite's hashed chunk filenames change. If a user's browser
// has the old index.html cached, it will 404 on the old chunk URL. This wrapper
// catches that and reloads the page once so the browser fetches the new HTML.

function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
) {
  return lazy(() =>
    factory().catch((err) => {
      const key = "chunk_reload";
      // Reload only once to avoid infinite loops
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        window.location.reload();
        // Return a never-resolving promise so React doesn't render stale state
        return new Promise<{ default: T }>(() => {});
      }
      sessionStorage.removeItem(key);
      throw err;
    }),
  );
}

// ── Lazy-loaded page chunks ────────────────────────────────────────────────────
// Each page is loaded only when the user navigates to it, keeping the initial
// bundle small and the landing page fast.

const Index        = lazyWithRetry(() => import("./pages/Index"));
const Login        = lazyWithRetry(() => import("./pages/Login"));
const Signup       = lazyWithRetry(() => import("./pages/Signup"));
const Onboarding   = lazyWithRetry(() => import("./pages/Onboarding"));
const ForgotPassword = lazyWithRetry(() => import("./pages/ForgotPassword"));
const ResetPassword  = lazyWithRetry(() => import("./pages/ResetPassword"));
const Profile      = lazyWithRetry(() => import("./pages/Profile"));
const Chat         = lazyWithRetry(() => import("@/pages/chat/Chat"));
const Bhajans      = lazyWithRetry(() => import("./pages/Bhajans"));
const Mandirs      = lazyWithRetry(() => import("./pages/Mandirs"));
const Scriptures   = lazyWithRetry(() => import("@/pages/scriptures/Scriptures"));
const Identify     = lazyWithRetry(() => import("./pages/Identify"));
const PujaTracker  = lazyWithRetry(() => import("./pages/PujaTracker"));
const Sadhana      = lazyWithRetry(() => import("./pages/Sadhana"));
const Kundli       = lazyWithRetry(() => import("./pages/Kundli"));
const NotFound     = lazyWithRetry(() => import("./pages/NotFound"));

// ── Shared loading fallback ────────────────────────────────────────────────────

function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
      {/* Pulsing OM symbol */}
      <div className="text-4xl font-serif font-bold text-saffron animate-pulse select-none">
        ॐ
      </div>
      <div className="flex gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-saffron/60 animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-saffron/60 animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-saffron/60 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

// ── Query client ───────────────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

// ── Protected route guard ──────────────────────────────────────────────────────

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!user)   return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// ── App ────────────────────────────────────────────────────────────────────────

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LanguageProvider>
            <AuthProvider>
              {/* Wrap all lazy routes in a single Suspense */}
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/"                element={<Index />} />
                  <Route path="/home"            element={<Index />} />
                  <Route path="/login"           element={<Login />} />
                  <Route path="/signup"          element={<Signup />} />
                  <Route path="/onboarding"      element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password"  element={<ResetPassword />} />
                  <Route path="/profile"         element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/chat"            element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                  <Route path="/bhajans"         element={<Bhajans />} />
                  <Route path="/scriptures"      element={<Scriptures />} />
                  <Route path="/mandirs"         element={<Mandirs />} />
                  <Route path="/identify"        element={<Identify />} />
                  <Route path="/puja-tracker"    element={<PujaTracker />} />
                  <Route path="/sadhana"         element={<Sadhana />} />
                  <Route path="/kundli"          element={<ProtectedRoute><Kundli /></ProtectedRoute>} />
                  <Route path="*"                element={<NotFound />} />
                </Routes>
              </Suspense>
              {/* BottomNav inside AuthProvider so it can access auth state */}
              <BottomNav />
            </AuthProvider>
          </LanguageProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
