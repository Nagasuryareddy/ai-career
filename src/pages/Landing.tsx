import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Brain, Briefcase, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Resume Analysis",
    description: "Upload your resume and get instant AI-powered analysis with actionable insights.",
  },
  {
    icon: Brain,
    title: "AI Insights",
    description: "Discover your strengths, weaknesses, and personalized improvement recommendations.",
  },
  {
    icon: Briefcase,
    title: "Job Matching",
    description: "Get tailored job recommendations based on your skills and career goals.",
  },
];

const stats = [
  { value: "10K+", label: "Resumes Analyzed" },
  { value: "95%", label: "Match Accuracy" },
  { value: "500+", label: "Companies" },
  { value: "4.9★", label: "User Rating" },
];

const Landing = () => {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 gradient-hero opacity-80" />
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-[120px]" />

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary animate-fade-in-up">
              <Sparkles className="h-4 w-4" />
              AI-Powered Career Intelligence
            </div>
            <h1 className="mb-6 font-display text-5xl font-bold leading-tight tracking-tight text-foreground opacity-0 animate-fade-in-up animate-delay-100 md:text-6xl lg:text-7xl">
              Your Resume,{" "}
              <span className="text-gradient">Reimagined</span>
            </h1>
            <p className="mb-10 text-lg text-muted-foreground opacity-0 animate-fade-in-up animate-delay-200 md:text-xl">
              Upload your resume and unlock AI-driven insights, personalized recommendations,
              and curated job matches — all in one platform.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 opacity-0 animate-fade-in-up animate-delay-300 sm:flex-row">
              <Button variant="hero" size="lg" asChild>
                <Link to="/register">
                  Get Started Free
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-4 opacity-0 animate-fade-in-up animate-delay-400 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
                <div className="font-display text-2xl font-bold text-gradient">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Three simple steps to transform your job search experience.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="glass-card group rounded-2xl p-8 transition-all duration-300 hover:glow"
              >
                <div className="mb-5 inline-flex rounded-xl gradient-primary p-3">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-3 font-display text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                <div className="mt-4 text-sm font-medium text-primary">
                  Step {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <div className="glass-card glow mx-auto max-w-3xl rounded-3xl p-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 text-primary">
              <Zap className="h-5 w-5" />
              <span className="text-sm font-medium">Ready to level up?</span>
            </div>
            <h2 className="mb-4 font-display text-3xl font-bold text-foreground">
              Start Analyzing Your Resume Today
            </h2>
            <p className="mb-8 text-muted-foreground">
              Join thousands of professionals who have transformed their career trajectory with AI insights.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/register">
                Create Free Account
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="gradient-primary rounded-lg p-1">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-sm font-semibold text-foreground">ResumeAI</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 ResumeAI. Intelligent Career Recommendations.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Landing;
