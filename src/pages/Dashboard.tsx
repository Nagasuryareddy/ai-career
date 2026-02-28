import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText, Brain, Briefcase, User, ChevronLeft, ChevronRight,
  Award, GraduationCap, TrendingUp, AlertTriangle, CheckCircle2,
  ExternalLink, Lightbulb, BarChart3, Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  resumeSummary as defaultSummary,
  resumeInsights as defaultInsights,
  skillDistribution as defaultSkillDist,
  skillMatchData as defaultSkillMatch,
  jobRecommendations as defaultJobs,
} from "@/lib/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";

const CHART_COLORS = ["hsl(252,85%,65%)", "hsl(210,80%,55%)", "hsl(152,60%,50%)", "hsl(38,90%,55%)", "hsl(0,72%,55%)"];

const tabs = [
  { id: "summary", label: "Summary", icon: FileText },
  { id: "insights", label: "AI Insights", icon: Brain },
  { id: "jobs", label: "Job Matches", icon: Briefcase },
] as const;

type Tab = (typeof tabs)[number]["id"];

interface AnalysisData {
  summary: typeof defaultSummary;
  insights: typeof defaultInsights;
  skillDistribution: typeof defaultSkillDist;
  skillMatchData: typeof defaultSkillMatch;
  jobRecommendations: typeof defaultJobs;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("resumeAnalysis");
    if (stored) {
      try {
        setAnalysis(JSON.parse(stored));
      } catch {
        setAnalysis(null);
      }
    }
  }, []);

  const data = analysis
    ? {
        summary: analysis.summary,
        insights: analysis.insights,
        skillDistribution: analysis.skillDistribution,
        skillMatchData: analysis.skillMatchData,
        jobRecommendations: analysis.jobRecommendations,
      }
    : {
        summary: defaultSummary,
        insights: defaultInsights,
        skillDistribution: defaultSkillDist,
        skillMatchData: defaultSkillMatch,
        jobRecommendations: defaultJobs,
      };

  return (
    <div className="flex min-h-screen pt-16">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ${
          sidebarOpen ? "w-60" : "w-16"
        }`}
      >
        <nav className="flex-1 space-y-1 p-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <tab.icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>
        <div className="space-y-1 border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 text-sidebar-foreground"
            onClick={() => navigate("/upload")}
          >
            <Upload className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>New Analysis</span>}
          </Button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex w-full items-center justify-center rounded-lg py-2 text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-60" : "ml-16"}`}>
        <div className="container mx-auto max-w-5xl p-6 lg:p-10">
          {!analysis && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>Showing sample data. <Link to="/upload" className="underline font-medium">Upload your resume</Link> for personalized AI analysis.</span>
            </div>
          )}
          {activeTab === "summary" && <SummaryTab data={data} />}
          {activeTab === "insights" && <InsightsTab data={data} />}
          {activeTab === "jobs" && <JobsTab data={data} />}
        </div>
      </main>
    </div>
  );
};

/* ---- SUMMARY TAB ---- */
const SummaryTab = ({ data }: { data: any }) => (
  <div className="space-y-6 animate-fade-in-up">
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="gradient-primary p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/20 backdrop-blur-sm">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-primary-foreground">{data.summary.name}</h1>
            <p className="text-primary-foreground/80">{data.summary.title}</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="leading-relaxed text-muted-foreground">{data.summary.summary}</p>
      </div>
    </div>

    <div className="glass-card-solid rounded-2xl p-6">
      <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
        <BarChart3 className="h-5 w-5 text-primary" /> Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {data.summary.skills?.map((skill: string) => (
          <span key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {skill}
          </span>
        ))}
      </div>
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      <div className="glass-card-solid rounded-2xl p-6">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <GraduationCap className="h-5 w-5 text-primary" /> Education & Certifications
        </h2>
        {data.summary.education?.map((ed: any) => (
          <div key={ed.degree} className="mb-3">
            <p className="font-medium text-foreground">{ed.degree}</p>
            <p className="text-sm text-muted-foreground">{ed.school}</p>
          </div>
        ))}
        <div className="mt-4 flex flex-wrap gap-2">
          {data.summary.certifications?.map((c: string) => (
            <span key={c} className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">{c}</span>
          ))}
        </div>
      </div>

      <div className="glass-card-solid rounded-2xl p-6">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <Briefcase className="h-5 w-5 text-primary" /> Experience
        </h2>
        {data.summary.experience?.map((exp: any) => (
          <div key={exp.role} className="mb-3">
            <p className="font-medium text-foreground">{exp.role}</p>
            <p className="text-sm text-muted-foreground">{exp.company} · {exp.years}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="glass-card-solid rounded-2xl p-6">
      <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
        <Award className="h-5 w-5 text-primary" /> Key Achievements
      </h2>
      <ul className="space-y-2">
        {data.summary.achievements?.map((a: string, i: number) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            {a}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

/* ---- INSIGHTS TAB ---- */
const InsightsTab = ({ data }: { data: any }) => (
  <div className="space-y-6 animate-fade-in-up">
    <div className="glass-card-solid rounded-2xl p-6">
      <h2 className="mb-2 font-display text-lg font-semibold text-foreground">Resume Score</h2>
      <div className="flex items-center gap-4">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(228,18%,20%)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="40" fill="none"
              stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${data.insights.score * 2.51} 251`}
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(252,85%,65%)" />
                <stop offset="100%" stopColor="hsl(210,80%,55%)" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute font-display text-2xl font-bold text-foreground">{data.insights.score}</span>
        </div>
        <div>
          <p className="font-medium text-foreground">
            {data.insights.score >= 85 ? "Excellent" : data.insights.score >= 70 ? "Good Score" : "Needs Improvement"}
          </p>
          <p className="text-sm text-muted-foreground">
            {data.insights.score >= 85
              ? "Your resume is outstanding!"
              : `Your resume is ${data.insights.score >= 70 ? "above average" : "below average"}. See suggestions to improve.`}
          </p>
        </div>
      </div>
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      <div className="glass-card-solid rounded-2xl p-6">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <CheckCircle2 className="h-5 w-5 text-success" /> Strengths
        </h2>
        <ul className="space-y-2">
          {data.insights.strengths?.map((s: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" /> {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-card-solid rounded-2xl p-6">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <AlertTriangle className="h-5 w-5 text-warning" /> Areas to Improve
        </h2>
        <ul className="space-y-2">
          {data.insights.weaknesses?.map((w: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" /> {w}
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="glass-card-solid rounded-2xl p-6">
      <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Missing Skills</h2>
      <div className="flex flex-wrap gap-2">
        {data.insights.missingSkills?.map((s: string) => (
          <span key={s} className="rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-sm text-warning">{s}</span>
        ))}
      </div>
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      <div className="glass-card-solid rounded-2xl p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Skill Distribution</h2>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data.skillDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
              {data.skillDistribution?.map((_: any, i: number) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "hsl(228,22%,14%)", border: "1px solid hsl(228,18%,24%)", borderRadius: "8px", color: "hsl(220,20%,92%)" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          {data.skillDistribution?.map((s: any, i: number) => (
            <div key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: CHART_COLORS[i] }} />
              {s.name}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card-solid rounded-2xl p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Skill Match %</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.skillMatchData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(228,18%,20%)" />
            <XAxis type="number" domain={[0, 100]} stroke="hsl(220,12%,55%)" fontSize={12} />
            <YAxis type="category" dataKey="skill" stroke="hsl(220,12%,55%)" fontSize={12} width={60} />
            <Tooltip contentStyle={{ background: "hsl(228,22%,14%)", border: "1px solid hsl(228,18%,24%)", borderRadius: "8px", color: "hsl(220,20%,92%)" }} />
            <Bar dataKey="match" radius={[0, 4, 4, 0]} fill="url(#barGrad)" />
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(252,85%,65%)" />
                <stop offset="100%" stopColor="hsl(210,80%,55%)" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="glass-card-solid rounded-2xl p-6">
      <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
        <Lightbulb className="h-5 w-5 text-primary" /> AI Recommendations
      </h2>
      <ul className="space-y-3">
        {data.insights.recommendations?.map((r: string, i: number) => (
          <li key={i} className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3 text-sm text-foreground">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
              {i + 1}
            </span>
            {r}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

/* ---- JOBS TAB ---- */
const JobsTab = ({ data }: { data: any }) => (
  <div className="space-y-6 animate-fade-in-up">
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground">Recommended Jobs</h2>
      <p className="mt-1 text-sm text-muted-foreground">Matched based on your resume analysis</p>
    </div>

    <div className="space-y-4">
      {data.jobRecommendations?.map((job: any) => (
        <div key={job.id} className="glass-card-solid group rounded-2xl p-6 transition-all hover:glow">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h3 className="font-display text-lg font-semibold text-foreground">{job.title}</h3>
              <p className="text-sm text-primary">{job.company}</p>
              <p className="mt-1 text-sm text-muted-foreground">{job.location}</p>
              <p className="mt-2 text-sm text-muted-foreground">{job.description}</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-gradient">{job.match}%</div>
                <div className="text-xs text-muted-foreground">Match</div>
              </div>
              <Progress value={job.match} className="h-1.5 w-20" />
              <Button variant="hero-outline" size="sm">
                View Job <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Dashboard;
