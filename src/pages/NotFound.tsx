import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <SeoHead title="Page Not Found" />
      <div className="text-center space-y-6 max-w-md">
        {/* Big OM with gradient */}
        <div className="text-8xl font-serif font-bold text-gradient-sacred select-none">
          ॐ
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Page Not Found
          </h1>
          <p className="text-muted-foreground font-sans">
            The path you seek does not exist. Let us guide you back.
          </p>
        </div>
        <Link to="/">
          <Button variant="hero" size="lg" className="gap-2">
            <Home className="w-4 h-4" /> Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
