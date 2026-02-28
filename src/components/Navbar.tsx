import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="gradient-primary rounded-lg p-1.5">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">ResumeAI</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {!isDashboard && (
            <>
              <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Home
              </Link>
              <Link to="/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Login
              </Link>
              <Button variant="hero" size="sm" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
          {isDashboard && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">Logout</Link>
            </Button>
          )}
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="glass-card-solid border-t border-border p-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link to="/" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/login" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>Login</Link>
            <Button variant="hero" size="sm" asChild>
              <Link to="/register" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
