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
import { Suspense, lazy } from "react";

// ── Lazy-loaded page chunks ────────────────────────────────────────────────────
// Each page is loaded only when the user navigates to it, keeping the initial
// bundle small and the landing page fast.

const Index        = lazy(() => import("./pages/Index"));
const Login        = lazy(() => import("./pages/Login"));
const Signup       = lazy(() => import("./pages/Signup"));
const Onboarding   = lazy(() => import("./pages/Onboarding"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword  = lazy(() => import("./pages/ResetPassword"));
const Profile      = lazy(() => import("./pages/Profile"));
const Chat         = lazy(() => import("@/pages/chat/Chat"));
const Bhajans      = lazy(() => import("./pages/Bhajans"));
const Mandirs      = lazy(() => import("./pages/Mandirs"));
const Scriptures   = lazy(() => import("@/pages/scriptures/Scriptures"));
const Identify     = lazy(() => import("./pages/Identify"));
const PujaTracker  = lazy(() => import("./pages/PujaTracker"));
const NotFound     = lazy(() => import("./pages/NotFound"));

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
