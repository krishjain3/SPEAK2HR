import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mic, FileText, BarChart2, Calendar, Users, Shield,
  TrendingUp, Zap, Star, ChevronDown, ArrowRight,
  Award, Globe, Twitter, Linkedin, Github,
  CheckCircle, XCircle, Sparkles, Activity,
  Target, LayoutDashboard, Menu, X, Play,
  Brain, Lock, Code2, ClipboardList, UserCheck,
  Layers, Cpu, MonitorSmartphone, BadgeCheck, GitBranch, Boxes
} from "lucide-react";
import "./landing-page.css";

/* ─── Hooks ─── */


/* ─── Neural Network SVG ─── */

function NeuralNetwork() {
  const nodes = [
    { x: 50, y: 100 }, { x: 50, y: 200 }, { x: 50, y: 300 },
    { x: 170, y: 60 }, { x: 170, y: 150 }, { x: 170, y: 240 }, { x: 170, y: 330 },
    { x: 290, y: 100 }, { x: 290, y: 200 }, { x: 290, y: 300 },
    { x: 400, y: 140 }, { x: 400, y: 240 },
    { x: 500, y: 190 },
  ];
  const edges = [
    [0,3],[0,4],[1,3],[1,4],[1,5],[2,5],[2,6],
    [3,7],[4,7],[4,8],[5,8],[5,9],[6,9],
    [7,10],[7,11],[8,10],[8,11],[9,11],
    [10,12],[11,12],
  ];
  return (
    <svg viewBox="0 0 560 390" className="w-full h-full" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="edgeGradL" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
        </linearGradient>
        <filter id="glowL">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {edges.map(([a, b], i) => (
        <line key={i}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke="url(#edgeGradL)" strokeWidth="1.5" strokeDasharray="4 3"
          style={{ animation: `edgePulse 3s ease-in-out infinite`, animationDelay: `${i * 0.18}s` }}
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i} filter="url(#glowL)">
          <circle cx={n.x} cy={n.y} r="14" fill="#3b82f6" fillOpacity="0.05" />
          <circle cx={n.x} cy={n.y} r="5"
            fill={i === 12 ? "#06b6d4" : i < 3 ? "#8b5cf6" : "#3b82f6"}
            style={{ animation: `nodePulse 2.5s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
          />
        </g>
      ))}
    </svg>
  );
}

/* ─── Reusable components ─── */

function GlassCard({ children, className = "", hover = true, style: extra }) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${hover ? "hover:-translate-y-1.5 hover:shadow-[0_8px_40px_rgba(99,130,246,0.14)]" : ""} ${className}`}
      style={{
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderColor: "rgba(99,130,246,0.13)",
        boxShadow: "0 2px 20px rgba(99,130,246,0.06), 0 1px 0 rgba(255,255,255,0.9) inset",
        ...extra,
      }}
    >
      {children}
    </div>
  );
}

function SectionBadge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
      style={{
        background: "linear-gradient(135deg, rgba(59,130,246,0.09), rgba(139,92,246,0.09))",
        border: "1px solid rgba(99,130,246,0.2)",
        color: "#4f46e5",
        fontFamily: "'Geist Mono', monospace",
      }}>
      <Sparkles size={11} />
      {children}
    </span>
  );
}

/* ─── Animated mini bar chart ─── */
function MiniBarChart({ values, color }) {
  return (
    <div className="flex items-end gap-1 h-10">
      {values.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm"
          style={{
            height: `${v}%`,
            background: color,
            opacity: 0.5 + i * 0.07,
            animation: `barRise 0.6s ease both`,
            animationDelay: `${i * 0.07}s`,
          }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN APP / HOME PAGE
   ══════════════════════════════════════════ */

export default function Home() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [hoveredShowcase, setHoveredShowcase] = useState(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  }, []);

  const handleStart = () => {
    navigate("/login");
  };

  /* ── DATA ── */

  const features = [
    { icon: <Mic size={22} />,            title: "AI Mock Interviews",    desc: "Real-time AI conducts dynamic, role-specific interviews with adaptive questioning.",                color: "#3b82f6" },
    { icon: <Zap size={22} />,            title: "Instant AI Feedback",   desc: "Comprehensive feedback delivered in seconds — tone, clarity, confidence, accuracy.",                color: "#8b5cf6" },
    { icon: <Activity size={22} />,       title: "Speech Analysis",       desc: "Detect filler words, pacing, sentiment, and vocal confidence with NLP analysis.",                   color: "#06b6d4" },
    { icon: <FileText size={22} />,       title: "Resume Evaluation",     desc: "AI parses and scores resumes against job descriptions with pinpoint precision.",                    color: "#10b981" },
    { icon: <BarChart2 size={22} />,      title: "Performance Reports",   desc: "Detailed PDF reports with scores, benchmarks, and improvement roadmaps.",                          color: "#f59e0b" },
    { icon: <LayoutDashboard size={22} />,title: "HR Dashboard",          desc: "Centralized command center for scheduling, tracking, and evaluating candidates.",                   color: "#3b82f6" },
    { icon: <Target size={22} />,         title: "Candidate Dashboard",   desc: "Personal progress hub — track interviews, scores, and skill growth over time.",                    color: "#8b5cf6" },
    { icon: <Calendar size={22} />,       title: "Smart Scheduling",      desc: "AI-powered calendar sync, automated reminders, and conflict resolution.",                          color: "#06b6d4" },
    { icon: <Shield size={22} />,         title: "Role-Based Auth",       desc: "Granular access control separating candidate, recruiter, and admin workflows.",                    color: "#10b981" },
    { icon: <TrendingUp size={22} />,     title: "Advanced Analytics",    desc: "Hiring pipeline analytics, cohort tracking, and predictive success scoring.",                      color: "#f59e0b" },
  ];

  const testimonials = [
    { name: "Priya Sharma",    role: "Senior Recruiter, TechCorp",  avatar: "PS", color: "#3b82f6",
      text: "Speak2HR cut our initial screening time significantly. The AI feedback is shockingly accurate — candidates who score well consistently perform well on the job.", stars: 5 },
    { name: "Marcus Williams", role: "Software Engineer (Hired)",    avatar: "MW", color: "#8b5cf6",
      text: "I was terrified of interviews. After a few weeks of Speak2HR mock sessions, I landed my dream role. The feedback was brutally honest and incredibly useful.", stars: 5 },
    { name: "Aisha Rahman",    role: "Head of Talent, Finova",       avatar: "AR", color: "#06b6d4",
      text: "We replaced our entire manual screening process. The HR dashboard gives us visibility we never had before. Scheduling alone saves hours every week.", stars: 5 },
    { name: "James Park",      role: "Product Manager (Hired)",      avatar: "JP", color: "#10b981",
      text: "The speech analysis feature exposed exactly where I was losing interviewers — filler words and lack of structure. Fixed it in two weeks. Game changer.", stars: 5 },
  ];

  const faqs = [
    { q: "How does the AI interview actually work?",           a: "Our AI engine conducts interviews via your microphone and camera. It asks role-specific questions, listens to your responses using advanced NLP, evaluates content, clarity, and confidence, and generates a comprehensive report — all in real time, without human involvement." },
    { q: "Is Speak2HR suitable for enterprise HR teams?",      a: "Absolutely. We offer multi-seat HR dashboards, team collaboration tools, custom question banks, branded candidate portals, ATS integrations, and dedicated enterprise support. Speak2HR scales from startup to Fortune 500." },
    { q: "How accurate is the AI scoring?",                    a: "Our models are trained on extensive interview data and validated against real hiring outcomes. We achieve high correlation between AI scores and expert human evaluator assessments across tested cohorts." },
    { q: "Can candidates practice as many times as they want?",a: "Yes. Candidates on our Starter plan get 5 interviews/month. Pro and Enterprise plans offer unlimited practice sessions with full history tracking and progress visualization." },
    { q: "How is candidate data secured?",                     a: "All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We are SOC 2 Type II aligned and fully GDPR compliant. Candidate recordings are never shared and can be deleted on demand." },
    { q: "Does Speak2HR integrate with existing ATS systems?", a: "We integrate natively with Greenhouse, Lever, Workday, BambooHR, and over 40 other ATS platforms via REST API and Zapier. Custom integrations are available for enterprise clients." },
  ];

  const comparison = [
    { label: "Time to screen candidates",   old: "3–5 days",              ai: "Under 30 minutes" },
    { label: "Consistency of evaluation",   old: "Varies by interviewer",  ai: "100% standardized" },
    { label: "Detailed candidate feedback", old: "Rarely provided",        ai: "Always, instantly" },
    { label: "Scheduling coordination",     old: "Manual, error-prone",    ai: "Automated AI sync" },
    { label: "Analytics & reporting",       old: "Spreadsheets",           ai: "Real-time dashboard" },
    { label: "Bias in evaluation",          old: "Significant risk",       ai: "Structurally minimized" },
    { label: "Candidate experience",        old: "Stressful, opaque",      ai: "Guided, empowering" },
  ];

  /* Product Highlights */
  const highlights = [
    { icon: <Brain size={20} />,         title: "AI Interview Simulation",       desc: "Adaptive AI conducts real interviews tailored to each role and seniority level.", color: "#3b82f6" },
    { icon: <FileText size={20} />,      title: "AI Resume Evaluation",          desc: "Intelligent parsing scores resumes against job descriptions instantly.",            color: "#8b5cf6" },
    { icon: <Activity size={20} />,      title: "Speech & Communication",        desc: "NLP-driven analysis of tone, pacing, filler words, and confidence signals.",      color: "#06b6d4" },
    { icon: <ClipboardList size={20} />, title: "Performance Reports",           desc: "Structured PDF reports with multi-dimensional scores and coaching roadmaps.",      color: "#10b981" },
    { icon: <UserCheck size={20} />,     title: "Candidate Portal",              desc: "Personal dashboard to track interviews, scores, and skill progression over time.", color: "#f59e0b" },
    { icon: <LayoutDashboard size={20} />,title: "HR Portal",                   desc: "Centralized hub to manage candidates, schedule interviews, and compare results.",   color: "#3b82f6" },
    { icon: <Calendar size={20} />,      title: "Interview Scheduling",          desc: "AI-powered scheduling with calendar sync, reminders, and conflict detection.",     color: "#8b5cf6" },
    { icon: <Lock size={20} />,          title: "Role-Based Authentication",     desc: "Granular access control across candidate, recruiter, admin, and manager roles.",   color: "#06b6d4" },
    { icon: <MonitorSmartphone size={20}/>,title: "Responsive Dashboard",        desc: "Pixel-perfect experience on desktop, tablet, and mobile without compromise.",     color: "#10b981" },
    { icon: <Shield size={20} />,        title: "Secure Platform",               desc: "End-to-end encryption, JWT auth, rate limiting, and GDPR-ready data handling.",    color: "#f59e0b" },
  ];

  /* Trust pillars */
  const trustPillars = [
    { icon: <Cpu size={20} />,       title: "AI-Powered Workflow",      desc: "Built on OpenAI APIs for real interview intelligence and instant feedback generation.", color: "#3b82f6" },
    { icon: <Code2 size={20} />,     title: "Modern Tech Stack",        desc: "React, Node.js, MongoDB, Express — production-grade architecture from the ground up.", color: "#8b5cf6" },
    { icon: <Lock size={20} />,      title: "Secure Authentication",    desc: "JWT-based auth, bcrypt hashing, protected routes, and session management baked in.",   color: "#06b6d4" },
    { icon: <MonitorSmartphone size={20}/>, title: "Responsive Design", desc: "Fully responsive across all screen sizes — mobile, tablet, and widescreen desktop.",   color: "#10b981" },
    { icon: <Layers size={20} />,    title: "Role-Based Platform",      desc: "Separate, tailored experiences for candidates, recruiters, and administrators.",         color: "#f59e0b" },
    { icon: <Boxes size={20} />,     title: "Scalable Architecture",    desc: "Modular backend, RESTful APIs, and a component-driven frontend built to scale.",         color: "#3b82f6" },
    { icon: <BadgeCheck size={20} />,title: "Modern UI/UX",             desc: "Glassmorphism, micro-interactions, and premium animations crafted for delight.",          color: "#8b5cf6" },
    { icon: <GitBranch size={20} />, title: "Clean Codebase",           desc: "Well-structured, commented, and documented code — portfolio-ready and maintainable.",     color: "#06b6d4" },
  ];

  /* Dashboard showcase cards */
  const showcaseWindows = [
    {
      title: "AI Interview Score",
      subtitle: "Real-time evaluation",
      color: "#3b82f6",
      content: (
        <div className="space-y-3">
          <div className="flex items-end justify-between mb-1">
            <span className="text-xs" style={{ color: "#94a3b8" }}>Overall Score</span>
            <span className="text-2xl font-black" style={{ color: "#3b82f6" }}>92<span className="text-sm font-semibold text-slate-400">/100</span></span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: "rgba(99,130,246,0.1)" }}>
            <div className="h-full rounded-full" style={{ width: "92%", background: "linear-gradient(90deg,#3b82f6,#8b5cf6)" }} />
          </div>
          {["Clarity", "Confidence", "Structure", "Relevance"].map((label, i) => (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: "#94a3b8" }}>{label}</span>
                <span style={{ color: "#4f46e5" }}>{[88, 94, 79, 91][i]}%</span>
              </div>
              <div className="h-1 rounded-full" style={{ background: "rgba(99,130,246,0.08)" }}>
                <div className="h-full rounded-full" style={{
                  width: `${[88, 94, 79, 91][i]}%`,
                  background: ["#3b82f6","#8b5cf6","#06b6d4","#10b981"][i],
                }} />
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "HR Scheduling",
      subtitle: "Interview calendar",
      color: "#8b5cf6",
      content: (
        <div className="space-y-2">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["M","T","W","T","F","S","S"].map((d, i) => (
              <div key={i} className="text-center text-xs" style={{ color: "#94a3b8" }}>{d}</div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => {
              const day = i - 3;
              const hasEvent = [4,9,12,16,21,25].includes(day);
              const isToday = day === 14;
              return (
                <div key={i} className="aspect-square flex items-center justify-center rounded-md text-xs transition-all relative"
                  style={{
                    fontSize: "0.65rem",
                    background: isToday ? "linear-gradient(135deg,#3b82f6,#8b5cf6)" : hasEvent ? "rgba(99,130,246,0.1)" : "transparent",
                    color: isToday ? "white" : day < 1 || day > 31 ? "#d1d5db" : "#475569",
                  }}>
                  {day > 0 && day <= 31 ? day : ""}
                  {hasEvent && !isToday && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />}
                </div>
              );
            })}
          </div>
          {[
            { time: "10:00", name: "Sarah K. — Frontend Role",   color: "#3b82f6" },
            { time: "14:30", name: "James P. — PM Interview",    color: "#8b5cf6" },
            { time: "16:00", name: "Aisha R. — Data Analyst",    color: "#06b6d4" },
          ].map((ev) => (
            <div key={ev.time} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "rgba(99,130,246,0.05)", border: `1px solid ${ev.color}18` }}>
              <div className="w-1.5 h-6 rounded-full flex-shrink-0" style={{ background: ev.color }} />
              <div>
                <div className="text-xs font-semibold" style={{ color: "#1e293b", fontSize: "0.7rem" }}>{ev.name}</div>
                <div className="text-xs" style={{ color: "#94a3b8", fontSize: "0.65rem" }}>{ev.time} AM</div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Activity Overview",
      subtitle: "Platform analytics",
      color: "#06b6d4",
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Interviews",  value: "—",  color: "#3b82f6", icon: <Mic size={12} /> },
              { label: "Candidates",  value: "—",  color: "#8b5cf6", icon: <Users size={12} /> },
              { label: "Reports",     value: "—",  color: "#06b6d4", icon: <FileText size={12} /> },
              { label: "Sessions",    value: "—",  color: "#10b981", icon: <Activity size={12} /> },
            ].map((s) => (
              <div key={s.label} className="p-2.5 rounded-xl" style={{ background: "rgba(99,130,246,0.04)", border: `1px solid ${s.color}18` }}>
                <div className="flex items-center gap-1.5 mb-1" style={{ color: s.color }}>{s.icon}<span className="text-xs" style={{ color: "#94a3b8" }}>{s.label}</span></div>
                <div className="text-lg font-black" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div className="p-2.5 rounded-xl" style={{ background: "rgba(99,130,246,0.04)", border: "1px solid rgba(99,130,246,0.1)" }}>
            <div className="text-xs mb-2" style={{ color: "#94a3b8" }}>Weekly Activity</div>
            <MiniBarChart values={[45, 72, 58, 91, 67, 83, 76]} color="linear-gradient(to top, #3b82f6, #8b5cf6)" />
          </div>
        </div>
      ),
    },
  ];

  /* ── RENDER ── */

  return (
    <div className="landing-page-root min-h-screen overflow-x-hidden relative">

      {/* ── Ambient background orbs ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div style={{
          position: "absolute", width: 900, height: 900, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.13) 0%, rgba(139,92,246,0.06) 50%, transparent 70%)",
          top: "-320px", left: "-250px",
          animation: "aurora 22s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(59,130,246,0.05) 50%, transparent 70%)",
          top: "80px", right: "-180px",
          animation: "aurora 28s ease-in-out infinite", animationDelay: "7s",
        }} />
        <div style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 70%)",
          bottom: "0px", left: "35%",
          animation: "aurora 20s ease-in-out infinite", animationDelay: "3s",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(99,130,246,0.08) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }} />
      </div>

      {/* ══════════════════════════════════
          NAVBAR
      ══════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.6)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: scrolled ? "1px solid rgba(99,130,246,0.12)" : "1px solid transparent",
          boxShadow: scrolled ? "0 2px 24px rgba(99,130,246,0.08)" : "none",
        }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => scrollTo("hero")}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", boxShadow: "0 4px 14px rgba(59,130,246,0.35)" }}>
              <Mic size={16} color="white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="glow-text">Speak</span><span style={{ color: "#0f172a" }}>2HR</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-7">
            {["features", "how-it-works", "testimonials", "faq"].map((id) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="text-sm font-medium transition-colors duration-200 border-none bg-transparent cursor-pointer"
                style={{ color: "#64748b" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#0f172a")}
                onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>
                {id === "how-it-works" ? "How It Works" : id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer"
              onClick={handleStart}
              style={{ color: "#4f46e5", border: "1px solid rgba(99,130,246,0.22)", background: "transparent" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,130,246,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
              Login
            </button>
            <button className="px-5 py-2 text-sm font-semibold rounded-xl text-white transition-all duration-300 cursor-pointer border-none"
              onClick={handleStart}
              style={{ background: "linear-gradient(135deg, #3b82f6, #7c3aed)", boxShadow: "0 4px 18px rgba(59,130,246,0.35)" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 28px rgba(59,130,246,0.5)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 18px rgba(59,130,246,0.35)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              Get Started
            </button>
          </div>

          <button className="md:hidden p-2 border-none bg-transparent cursor-pointer" onClick={() => setMobileOpen(!mobileOpen)} style={{ color: "#334155" }}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4"
            style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(99,130,246,0.1)" }}>
            {["features", "how-it-works", "testimonials", "faq"].map((id) => (
              <button key={id} onClick={() => scrollTo(id)} className="text-left text-base font-medium py-1 border-none bg-transparent cursor-pointer" style={{ color: "#475569" }}>
                {id === "how-it-works" ? "How It Works" : id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
            <div className="flex gap-3 pt-2">
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                onClick={handleStart}
                style={{ border: "1px solid rgba(99,130,246,0.2)", color: "#4f46e5", background: "transparent" }}>Login</button>
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer border-none"
                onClick={handleStart}
                style={{ background: "linear-gradient(135deg,#3b82f6,#7c3aed)" }}>Get Started</button>
            </div>
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section id="hero" className="relative min-h-screen flex items-center pt-20" style={{ zIndex: 1 }}>
        <div className="max-w-7xl mx-auto px-6 w-full py-24 grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <div className="hero-animate hero-animate-d1 mb-6">
              <SectionBadge>AI-Powered Interview Platform</SectionBadge>
            </div>
            <h1 className="hero-animate hero-animate-d2 font-black leading-[1.08] mb-6"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", letterSpacing: "-0.025em" }}>
              <span style={{ color: "#0f172a" }}>Interview Intelligence</span><br />
              <span className="glow-text">for the Next Era</span><br />
              <span style={{ color: "#0f172a" }}>of Hiring</span>
            </h1>
            <p className="hero-animate hero-animate-d3 text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: "#64748b", fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
              Speak2HR empowers candidates with AI mock interviews and gives HR teams the tools to schedule, assess, and hire smarter — all in one platform.
            </p>
            <div className="hero-animate hero-animate-d4 flex flex-wrap gap-4 mb-14">
              <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-base text-white transition-all duration-300 cursor-pointer border-none"
                onClick={handleStart}
                style={{ background: "linear-gradient(135deg, #3b82f6, #7c3aed)", boxShadow: "0 6px 28px rgba(59,130,246,0.38)" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 10px 40px rgba(59,130,246,0.55)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 6px 28px rgba(59,130,246,0.38)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                Get Started Free <ArrowRight size={17} />
              </button>
              <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-300 cursor-pointer"
                onClick={handleStart}
                style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(99,130,246,0.22)", color: "#4f46e5", boxShadow: "0 2px 12px rgba(99,130,246,0.08)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,130,246,0.14)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.85)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(99,130,246,0.08)"; }}>
                Login
              </button>
            </div>

            {/* ── Capability pills ── */}
            <div className="hero-animate hero-animate-d4 flex flex-wrap gap-2">
              {[
                { label: "AI Mock Interviews",      color: "#3b82f6" },
                { label: "Speech Analysis",         color: "#8b5cf6" },
                { label: "Instant Feedback",        color: "#06b6d4" },
                { label: "HR Scheduling",           color: "#10b981" },
                { label: "Resume Evaluation",       color: "#f59e0b" },
                { label: "Role-Based Access",       color: "#3b82f6" },
              ].map((p) => (
                <span key={p.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-default"
                  style={{
                    background: `${p.color}10`,
                    border: `1px solid ${p.color}22`,
                    color: p.color,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${p.color}18`; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${p.color}10`; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: p.color, display: "inline-block" }} />
                  {p.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right: AI visual */}
          <div className="relative hidden lg:flex items-center justify-center" style={{ minHeight: 520 }}>
            {/* Soft halo */}
            <div style={{
              position: "absolute", width: 380, height: 380, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.07) 50%, transparent 70%)",
              filter: "blur(30px)",
            }} />
            {/* Glass sphere */}
            <div className="absolute flex items-center justify-center" style={{
              width: 260, height: 260, borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(239,246,255,0.85) 40%, rgba(237,233,254,0.75) 100%)",
              boxShadow: "0 8px 60px rgba(59,130,246,0.2), 0 2px 0 rgba(255,255,255,0.9) inset",
              border: "1px solid rgba(255,255,255,0.9)",
              backdropFilter: "blur(12px)",
              animation: "floatSlow 5s ease-in-out infinite",
            }}>
              <div style={{ position: "absolute", inset: 14, borderRadius: "50%", border: "1px solid rgba(99,130,246,0.18)" }} />
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "linear-gradient(135deg, #3b82f6, #7c3aed)",
                boxShadow: "0 6px 24px rgba(59,130,246,0.45)",
                display: "flex", alignItems: "center", justify: "center",
              }}>
                <Mic size={24} color="white" />
              </div>
            </div>
            {/* Orbit ring 1 */}
            <div className="absolute" style={{
              width: 340, height: 340, borderRadius: "50%",
              border: "1px solid rgba(99,130,246,0.2)",
              animation: "spin-slow 18s linear infinite",
            }}>
              <div style={{ position: "absolute", top: -5, left: "50%", transform: "translateX(-50%)", width: 10, height: 10, borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 10px rgba(59,130,246,0.8)" }} />
            </div>
            {/* Orbit ring 2 */}
            <div className="absolute" style={{
              width: 440, height: 440, borderRadius: "50%",
              border: "1px dashed rgba(139,92,246,0.18)",
              animation: "spin-slow 28s linear infinite reverse",
            }}>
              <div style={{ position: "absolute", top: -5, left: "50%", transform: "translateX(-50%)", width: 9, height: 9, borderRadius: "50%", background: "#8b5cf6", boxShadow: "0 0 10px rgba(139,92,246,0.8)" }} />
              <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", width: 7, height: 7, borderRadius: "50%", background: "#06b6d4", boxShadow: "0 0 8px rgba(6,182,212,0.8)" }} />
            </div>
            {/* Neural network */}
            <div className="absolute" style={{ width: 520, height: 380, opacity: 0.6 }}>
              <NeuralNetwork />
            </div>
            {/* Floating card — Interview Score */}
            <GlassCard className="absolute p-3.5" hover={false} style={{ top: 40, right: -20, width: 180, animation: "float 4s ease-in-out infinite", boxShadow: "0 8px 32px rgba(99,130,246,0.14)" }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.12)" }}>
                  <CheckCircle size={13} color="#10b981" />
                </div>
                <span className="text-xs font-semibold" style={{ color: "#10b981" }}>Interview Complete</span>
              </div>
              <div className="text-xs" style={{ color: "#94a3b8" }}>AI Score</div>
              <div className="text-2xl font-black mt-0.5 glow-text">92/100</div>
              <div className="mt-2 h-1.5 rounded-full" style={{ background: "rgba(99,130,246,0.1)" }}>
                <div className="h-full rounded-full" style={{ width: "92%", background: "linear-gradient(90deg,#3b82f6,#8b5cf6)" }} />
              </div>
            </GlassCard>
            {/* Floating card — Speech */}
            <GlassCard className="absolute p-3.5" hover={false} style={{ bottom: 60, left: -30, width: 190, animation: "float 5s ease-in-out infinite", animationDelay: "1.5s", boxShadow: "0 8px 32px rgba(99,130,246,0.12)" }}>
              <div className="text-xs font-semibold mb-2.5" style={{ color: "#475569" }}>Speech Analysis</div>
              {["Confidence", "Clarity", "Structure"].map((label, i) => (
                <div key={label} className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "#94a3b8" }}>{label}</span>
                    <span style={{ color: "#4f46e5" }}>{[88, 94, 79][i]}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "rgba(99,130,246,0.08)" }}>
                    <div className="h-full rounded-full" style={{ width: `${[88, 94, 79][i]}%`, background: ["linear-gradient(90deg,#3b82f6,#8b5cf6)", "linear-gradient(90deg,#06b6d4,#3b82f6)", "linear-gradient(90deg,#8b5cf6,#06b6d4)"][i] }} />
                  </div>
                </div>
              ))}
            </GlassCard>
            {/* Floating card — Status */}
            <GlassCard className="absolute p-3" hover={false} style={{ top: 170, right: -50, width: 148, animation: "float 6s ease-in-out infinite", animationDelay: "0.8s", boxShadow: "0 8px 24px rgba(99,130,246,0.1)" }}>
              <div className="text-xs mb-1.5" style={{ color: "#94a3b8" }}>AI Feedback Ready</div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>
                  <Brain size={13} color="white" />
                </div>
                <div>
                  <div className="text-xs font-bold" style={{ color: "#1e293b" }}>Report Generated</div>
                  <div className="text-xs" style={{ color: "#10b981" }}>Just now</div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ animation: "float 3s ease-in-out infinite" }}>
          <div className="text-xs" style={{ color: "#94a3b8" }}>Scroll to explore</div>
          <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, #3b82f6, transparent)" }} />
        </div>
      </section>

      {/* ══════════════════════════════════
          TRUST SECTION
      ══════════════════════════════════ */}
      <section className="relative py-20 overflow-hidden" style={{ zIndex: 1, background: "#f2f5fa" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <SectionBadge>Platform Credibility</SectionBadge>
            <h2 className="mt-4 font-black" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", letterSpacing: "-0.02em", color: "#0f172a" }}>
              Built with <span className="glow-text">enterprise-grade foundations</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {trustPillars.map((p, i) => (
              <div key={p.title}
                className="group p-4 rounded-2xl flex flex-col items-center text-center gap-2.5 transition-all duration-300 hover:-translate-y-1.5 cursor-default"
                style={{ background: "white", border: "1px solid rgba(99,130,246,0.1)", boxShadow: "0 2px 12px rgba(99,130,246,0.04)" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 28px ${p.color}18`; e.currentTarget.style.borderColor = `${p.color}28`; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(99,130,246,0.04)"; e.currentTarget.style.borderColor = "rgba(99,130,246,0.1)"; }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${p.color}12`, border: `1px solid ${p.color}20` }}>
                  <span style={{ color: p.color }}>{p.icon}</span>
                </div>
                <div className="text-xs font-semibold leading-tight" style={{ color: "#334155" }}>{p.title}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14" style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(99,130,246,0.15),transparent)" }} />
      </section>

      {/* ══════════════════════════════════
          FEATURES
      ══════════════════════════════════ */}
      <section id="features" className="relative py-28" style={{ zIndex: 1 }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <SectionBadge>Platform Features</SectionBadge>
            <h2 className="mt-5 font-black leading-tight" style={{ fontSize: "clamp(2rem,4vw,3rem)", letterSpacing: "-0.02em" }}>
              <span style={{ color: "#0f172a" }}>Every tool you need</span><br />
              <span className="glow-text">in one intelligent platform</span>
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-base leading-relaxed" style={{ color: "#64748b", fontFamily: "'Inter', sans-serif" }}>
              From AI-driven mock interviews to enterprise HR dashboards — Speak2HR covers the full interview lifecycle.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {features.map((f) => (
              <div key={f.title}
                className="group highlight-card cursor-default rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1.5"
                style={{ background: "white", border: "1px solid rgba(99,130,246,0.1)", boxShadow: "0 2px 14px rgba(99,130,246,0.05)" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 12px 36px ${f.color}18`; e.currentTarget.style.borderColor = `${f.color}25`; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 14px rgba(99,130,246,0.05)"; e.currentTarget.style.borderColor = "rgba(99,130,246,0.1)"; }}>
                <div className="highlight-icon w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 mb-4"
                  style={{ background: `linear-gradient(135deg, ${f.color}16, ${f.color}08)`, border: `1px solid ${f.color}25` }}>
                  <span style={{ color: f.color }}>{f.icon}</span>
                </div>
                <div className="font-bold text-sm mb-2" style={{ color: "#1e293b" }}>{f.title}</div>
                <div className="text-xs leading-relaxed" style={{ color: "#94a3b8", fontFamily: "'Inter', sans-serif" }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════ */}
      <section id="how-it-works" className="relative py-28 overflow-hidden" style={{ zIndex: 1, background: "#f2f5fa" }}>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <SectionBadge>Workflow Guide</SectionBadge>
            <h2 className="mt-5 font-black" style={{ fontSize: "clamp(2rem,4vw,2.8rem)", letterSpacing: "-0.02em", color: "#0f172a" }}>
              How Speak2HR <span className="glow-text">Empowers You</span>
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-base leading-relaxed" style={{ color: "#64748b", fontFamily: "'Inter', sans-serif" }}>
              Tailored experience streams designed for both sides of the hiring equation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Candidate Flow */}
            <GlassCard className="p-8 relative overflow-hidden" hover={false}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)" }} />
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(59,130,246,0.12)" }}>
                  <Target size={20} color="#3b82f6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: "#1e293b" }}>For Candidates</h3>
                  <p className="text-xs" style={{ color: "#94a3b8" }}>Master your next career step</p>
                </div>
              </div>
              <div className="space-y-6 relative">
                <div className="absolute left-4 top-2 bottom-2 w-0.5" style={{ background: "linear-gradient(to bottom, rgba(59,130,246,0.3) 0%, rgba(139,92,246,0.05) 100%)" }} />
                {[
                  { icon: <Users size={16} />,     title: "Create Account",   desc: "Sign up in 60 seconds, choose your role and target positions." },
                  { icon: <Target size={16} />,    title: "Choose Interview", desc: "Select from 200+ role-specific interview templates curated by industry." },
                  { icon: <Mic size={16} />,       title: "Take AI Interview",desc: "Speak naturally — our AI listens, analyzes, and responds in real time." },
                  { icon: <BarChart2 size={16} />, title: "Receive Feedback", desc: "Instant scorecard with actionable improvement areas." },
                  { icon: <TrendingUp size={16} />,title: "Improve Skills",   desc: "Track your growth across sessions and close skill gaps systematically." }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    <div className="w-8.5 h-8.5 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                      style={{ background: "white", border: "2px solid rgba(59,130,246,0.2)", color: "#3b82f6", width: "34px", height: "34px" }}>
                      {step.icon}
                    </div>
                    <div>
                      <div className="font-bold text-sm" style={{ color: "#1e293b" }}>{step.title}</div>
                      <div className="text-xs leading-relaxed" style={{ color: "#64748b", fontFamily: "'Inter', sans-serif" }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Recruiter Flow */}
            <GlassCard className="p-8 relative overflow-hidden" hover={false}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)" }} />
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(139,92,246,0.12)" }}>
                  <Users size={20} color="#8b5cf6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: "#1e293b" }}>For HR & Recruiters</h3>
                  <p className="text-xs" style={{ color: "#94a3b8" }}>Scale hiring with precision</p>
                </div>
              </div>
              <div className="space-y-6 relative">
                <div className="absolute left-4 top-2 bottom-2 w-0.5" style={{ background: "linear-gradient(to bottom, rgba(139,92,246,0.3) 0%, rgba(59,130,246,0.05) 100%)" }} />
                {[
                  { icon: <Calendar size={16} />, title: "Create Interview Slots", desc: "Build structured interview rounds with AI-generated question banks." },
                  { icon: <Users size={16} />,    title: "Manage Candidates",      desc: "Invite candidates, monitor progress, and compare applicants at scale." },
                  { icon: <FileText size={16} />, title: "Review Reports",         desc: "Deep-dive AI-generated reports with transcript, score, and summary." },
                  { icon: <Award size={16} />,    title: "Evaluate Performance",   desc: "Cross-reference AI scores against your rubric and make data-driven hires." }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    <div className="w-8.5 h-8.5 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                      style={{ background: "white", border: "2px solid rgba(139,92,246,0.2)", color: "#8b5cf6", width: "34px", height: "34px" }}>
                      {step.icon}
                    </div>
                    <div>
                      <div className="font-bold text-sm" style={{ color: "#1e293b" }}>{step.title}</div>
                      <div className="text-xs leading-relaxed" style={{ color: "#64748b", fontFamily: "'Inter', sans-serif" }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          DASHBOARD SHOWCASE
      ══════════════════════════════════ */}
      <section className="relative py-28" style={{ zIndex: 1 }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <SectionBadge>Platform Showcase</SectionBadge>
            <h2 className="mt-5 font-black leading-tight" style={{ fontSize: "clamp(2rem,4vw,3rem)", letterSpacing: "-0.02em" }}>
              <span style={{ color: "#0f172a" }}>Designed for unmatched</span><br />
              <span className="glow-text">user experiences</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {showcaseWindows.map((win, i) => (
              <div
                key={win.title}
                className="rounded-2xl overflow-hidden transition-all duration-500"
                style={{
                  background: "white",
                  border: `1px solid ${win.color}20`,
                  boxShadow: hoveredShowcase === i
                    ? `0 20px 60px ${win.color}22, 0 4px 20px rgba(99,130,246,0.1)`
                    : "0 4px 24px rgba(99,130,246,0.08)",
                  transform: hoveredShowcase === i ? "translateY(-8px) scale(1.01)" : "translateY(0) scale(1)",
                  animation: `float ${5 + i * 0.8}s ease-in-out infinite`,
                  animationDelay: `${i * 0.7}s`,
                }}
                onMouseEnter={() => setHoveredShowcase(i)}
                onMouseLeave={() => setHoveredShowcase(null)}
              >
                {/* Window chrome */}
                <div className="px-4 py-3 flex items-center justify-between"
                  style={{ background: "#f8fafc", borderBottom: `1px solid ${win.color}15` }}>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#fca5a5" }} />
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#fcd34d" }} />
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#86efac" }} />
                    </div>
                  </div>
                  <div className="text-xs font-semibold" style={{ color: win.color }}>{win.title}</div>
                  <div className="text-xs" style={{ color: "#94a3b8" }}>{win.subtitle}</div>
                </div>
                {/* Content */}
                <div className="p-4">{win.content}</div>
              </div>
            ))}
          </div>

          {/* Wide bottom mockup bar */}
          <div className="rounded-2xl overflow-hidden" style={{
            background: "white",
            border: "1px solid rgba(99,130,246,0.14)",
            boxShadow: "0 8px 40px rgba(99,130,246,0.08)",
          }}>
            <div className="flex items-center gap-2 px-4 py-3" style={{ background: "#f8fafc", borderBottom: "1px solid rgba(99,130,246,0.08)" }}>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#fca5a5" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#fcd34d" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#86efac" }} />
              </div>
              <div className="ml-3 flex-1 max-w-xs rounded-md px-3 py-1 text-xs"
                style={{ background: "rgba(99,130,246,0.06)", color: "#94a3b8", fontFamily: "'Geist Mono', monospace" }}>
                app.speak2hr.com/hr/dashboard
              </div>
              <div className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md" style={{ background: "rgba(16,185,129,0.08)", color: "#10b981" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "nodePulse 2s ease-in-out infinite" }} />
                Live Preview
              </div>
            </div>
            <div className="p-5 grid grid-cols-12 gap-4" style={{ background: "#f7f9fc" }}>
              {/* Sidebar */}
              <div className="col-span-2 hidden md:flex flex-col gap-1.5">
                {["Dashboard", "Interviews", "Candidates", "Reports", "Settings"].map((item, i) => (
                  <div key={item} className="px-3 py-2 rounded-lg text-xs font-medium cursor-default transition-all"
                    style={{
                      background: i === 0 ? "linear-gradient(135deg,rgba(59,130,246,0.1),rgba(139,92,246,0.08))" : "transparent",
                      color: i === 0 ? "#3b82f6" : "#94a3b8",
                      border: i === 0 ? "1px solid rgba(99,130,246,0.15)" : "1px solid transparent",
                    }}>
                    {item}
                  </div>
                ))}
              </div>
              {/* Main */}
              <div className="col-span-12 md:col-span-10 grid grid-cols-4 gap-3">
                {[
                  { label: "Total Interviews", value: "Active", color: "#3b82f6" },
                  { label: "Active Candidates", value: "Tracking", color: "#8b5cf6" },
                  { label: "Avg. AI Score", value: "Analyzing", color: "#06b6d4" },
                  { label: "Reports", value: "Generated", color: "#10b981" },
                ].map((card) => (
                  <div key={card.label} className="p-3.5 rounded-xl" style={{ background: "white", border: `1px solid ${card.color}18`, boxShadow: "0 2px 8px rgba(99,130,246,0.04)" }}>
                    <div className="text-xs mb-1" style={{ color: "#94a3b8" }}>{card.label}</div>
                    <div className="text-sm font-bold" style={{ color: card.color }}>{card.value}</div>
                  </div>
                ))}
                <div className="col-span-4 rounded-xl p-4" style={{ background: "white", border: "1px solid rgba(99,130,246,0.08)" }}>
                  <div className="text-xs mb-3" style={{ color: "#94a3b8" }}>Interview Activity — Weekly Overview</div>
                  <div className="flex items-end gap-2 h-14">
                    {[45, 72, 58, 91, 67, 83, 76].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm"
                        style={{ height: `${h}%`, background: `linear-gradient(to top, #3b82f6, #8b5cf6)`, opacity: 0.5 + i * 0.07 }} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
                      <div key={d} className="flex-1 text-center text-xs" style={{ color: "#cbd5e1", fontSize: "0.6rem" }}>{d}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          PRODUCT DEMO VIDEO SECTION
      ══════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden" style={{ zIndex: 1 }}>
        {/* Section gradient background */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(160deg, #f0f4ff 0%, #faf5ff 40%, #ecfeff 100%)",
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, rgba(99,130,246,0.07) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }} />
        {/* Ambient orbs */}
        <div className="absolute" style={{
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)",
          top: "50%", left: "10%", transform: "translateY(-50%)", filter: "blur(50px)",
        }} />
        <div className="absolute" style={{
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
          top: "50%", right: "5%", transform: "translateY(-50%)", filter: "blur(50px)",
        }} />

        <div className="max-w-5xl mx-auto px-6 relative">
          <div className="text-center mb-12">
            <SectionBadge>Platform Demo</SectionBadge>
            <h2 className="mt-5 font-black" style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", letterSpacing: "-0.02em", color: "#0f172a" }}>
              See Speak2HR <span className="glow-text">in Action</span>
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-base leading-relaxed" style={{ color: "#64748b", fontFamily: "'Inter', sans-serif" }}>
              Watch how candidates practice AI interviews, receive instant feedback, and how HR teams manage scheduling and evaluate performance — all in one seamless platform.
            </p>
          </div>

          {/* Floating decorative elements */}
          <GlassCard className="absolute hidden lg:flex flex-col gap-1.5 p-3" hover={false}
            style={{ left: -40, top: "30%", width: 148, animation: "float 5s ease-in-out infinite", zIndex: 2 }}>
            <div className="text-xs font-semibold" style={{ color: "#475569" }}>AI Analyzing...</div>
            <div className="h-1 rounded-full" style={{ background: "rgba(99,130,246,0.1)" }}>
              <div className="h-full rounded-full" style={{ width: "68%", background: "linear-gradient(90deg,#3b82f6,#8b5cf6)" }} />
            </div>
            <div className="text-xs" style={{ color: "#94a3b8" }}>Processing speech...</div>
          </GlassCard>

          <GlassCard className="absolute hidden lg:flex flex-col gap-1.5 p-3" hover={false}
            style={{ right: -40, top: "25%", width: 156, animation: "floatAlt 5.5s ease-in-out infinite", zIndex: 2 }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.12)" }}>
                <CheckCircle size={12} color="#10b981" />
              </div>
              <span className="text-xs font-semibold" style={{ color: "#10b981" }}>Feedback Ready</span>
            </div>
            <div className="text-xs" style={{ color: "#94a3b8" }}>Score: Excellent</div>
          </GlassCard>

          <GlassCard className="absolute hidden lg:flex items-center gap-2 p-3" hover={false}
            style={{ left: -20, bottom: "20%", width: 160, animation: "float 6s ease-in-out infinite", animationDelay: "1s", zIndex: 2 }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>
              <Calendar size={13} color="white" />
            </div>
            <div>
              <div className="text-xs font-semibold" style={{ color: "#1e293b" }}>Interview Scheduled</div>
              <div className="text-xs" style={{ color: "#94a3b8" }}>Tomorrow, 10:00 AM</div>
            </div>
          </GlassCard>

          {/* Video container */}
          <div className="relative grad-border" style={{ borderRadius: "1.5rem" }}>
            <div className="rounded-3xl overflow-hidden" style={{
              background: "white",
              boxShadow: "0 20px 80px rgba(59,130,246,0.16), 0 4px 24px rgba(139,92,246,0.1)",
              animation: "glowPulse 4s ease-in-out infinite",
            }}>
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-5 py-3.5" style={{ background: "#f8fafc", borderBottom: "1px solid rgba(99,130,246,0.08)" }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#fca5a5" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#fcd34d" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#86efac" }} />
                </div>
                <div className="ml-4 flex-1 max-w-sm rounded-lg px-3 py-1 text-xs"
                  style={{ background: "rgba(99,130,246,0.06)", color: "#94a3b8", fontFamily: "'Geist Mono', monospace" }}>
                  speak2hr.com/demo
                </div>
              </div>

              {/* Video area */}
              <div className="relative" style={{ aspectRatio: "16/9", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #ecfeff 100%)" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle, rgba(99,130,246,0.06) 1px, transparent 1px)`,
                    backgroundSize: "28px 28px",
                  }} />

                  {/* Floating UI mockup inside video */}
                  <div className="absolute inset-8 grid grid-cols-3 gap-4 items-center opacity-60">
                    <div className="rounded-xl p-4 flex flex-col gap-3"
                      style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(99,130,246,0.12)", boxShadow: "0 4px 16px rgba(99,130,246,0.08)" }}>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>
                          <Mic size={12} color="white" />
                        </div>
                        <div className="text-xs font-bold" style={{ color: "#1e293b" }}>AI Interview</div>
                      </div>
                      <div className="space-y-1.5">
                        {[70, 85, 60].map((w, i) => (
                          <div key={i} className="h-1.5 rounded-full" style={{ width: `${w}%`, background: i === 1 ? "linear-gradient(90deg,#3b82f6,#8b5cf6)" : "rgba(99,130,246,0.12)" }} />
                        ))}
                      </div>
                      <div className="text-xs" style={{ color: "#94a3b8" }}>Listening...</div>
                    </div>

                    <div className="rounded-xl p-4 flex flex-col items-center gap-3"
                      style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", border: "1px solid rgba(99,130,246,0.15)", boxShadow: "0 8px 32px rgba(99,130,246,0.12)" }}>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#3b82f6,#7c3aed)", boxShadow: "0 4px 16px rgba(59,130,246,0.4)" }}>
                        <Brain size={22} color="white" />
                      </div>
                      <div className="text-xs font-bold text-center" style={{ color: "#1e293b" }}>Speak2HR AI</div>
                      <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(99,130,246,0.1)" }}>
                        <div className="h-full rounded-full" style={{ width: "75%", background: "linear-gradient(90deg,#3b82f6,#8b5cf6)" }} />
                      </div>
                    </div>

                    <div className="rounded-xl p-4 flex flex-col gap-3"
                      style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(99,130,246,0.12)", boxShadow: "0 4px 16px rgba(99,130,246,0.08)" }}>
                      <div className="text-xs font-bold" style={{ color: "#1e293b" }}>Live Feedback</div>
                      {["Confidence", "Clarity", "Pace"].map((l, i) => (
                        <div key={l}>
                          <div className="flex justify-between text-xs mb-0.5"><span style={{ color: "#94a3b8" }}>{l}</span><span style={{ color: "#4f46e5" }}>{[85,92,78][i]}%</span></div>
                          <div className="h-1 rounded-full" style={{ background: "rgba(99,130,246,0.08)" }}>
                            <div className="h-full rounded-full" style={{ width: `${[85,92,78][i]}%`, background: ["#3b82f6","#8b5cf6","#06b6d4"][i] }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setVideoPlaying(!videoPlaying)}
                    className="relative flex items-center justify-center transition-all duration-300 group border-none cursor-pointer"
                    style={{
                      width: 72, height: 72, borderRadius: "50%",
                      background: "linear-gradient(135deg, #3b82f6, #7c3aed)",
                      boxShadow: "0 8px 40px rgba(59,130,246,0.45)",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 12px 56px rgba(59,130,246,0.65)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 40px rgba(59,130,246,0.45)"; }}
                  >
                    <span className="absolute inset-0 rounded-full" style={{ background: "rgba(59,130,246,0.2)", animation: "pulseRing 2.5s ease-out infinite" }} />
                    <span className="absolute inset-0 rounded-full" style={{ background: "rgba(59,130,246,0.15)", animation: "pulseRing 2.5s ease-out infinite", animationDelay: "0.7s" }} />
                    <Play size={26} color="white" fill="white" style={{ marginLeft: 4 }} />
                  </button>
                </div>

                <div className="absolute bottom-4 right-4">
                  <span className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", color: "#94a3b8", border: "1px solid rgba(99,130,246,0.12)", fontFamily: "'Geist Mono', monospace" }}>
                    video placeholder
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Below video — feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {["Candidate Practice", "AI Feedback", "Speech Analysis", "HR Scheduling", "Interview Reports"].map((label) => (
              <span key={label} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={{ background: "white", border: "1px solid rgba(99,130,246,0.15)", color: "#475569", boxShadow: "0 2px 8px rgba(99,130,246,0.06)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "inline-block" }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          PRODUCT HIGHLIGHTS
      ══════════════════════════════════ */}
      <section className="relative py-28" style={{ zIndex: 1, background: "#f2f5fa" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionBadge>Product Highlights</SectionBadge>
            <h2 className="mt-5 font-black" style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", letterSpacing: "-0.02em", color: "#0f172a" }}>
              What Speak2HR<br /><span className="glow-text">delivers for you</span>
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-base leading-relaxed" style={{ color: "#64748b", fontFamily: "'Inter', sans-serif" }}>
              A comprehensive AI interview platform built from the ground up for both candidates and hiring teams.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {highlights.map((h, i) => (
              <div key={h.title}
                className="group highlight-card cursor-default p-5 rounded-2xl flex flex-col gap-3 transition-all duration-300 hover:-translate-y-2"
                style={{ background: "white", border: "1px solid rgba(99,130,246,0.1)", boxShadow: "0 2px 16px rgba(99,130,246,0.05)" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 12px 40px ${h.color}18`; e.currentTarget.style.borderColor = `${h.color}28`; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 16px rgba(99,130,246,0.05)"; e.currentTarget.style.borderColor = "rgba(99,130,246,0.1)"; }}>
                <div className="highlight-icon w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${h.color}18, ${h.color}08)`, border: `1px solid ${h.color}25` }}>
                  <span style={{ color: h.color }}>{h.icon}</span>
                </div>
                <div>
                  <div className="font-bold text-sm mb-1.5" style={{ color: "#1e293b" }}>{h.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "#94a3b8", fontFamily: "'Inter', sans-serif" }}>{h.desc}</div>
                </div>
                <div className="mt-auto">
                  <div className="h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, ${h.color}40, transparent)` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          COMPARISON
      ══════════════════════════════════ */}
      <section className="relative py-28" style={{ zIndex: 1 }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionBadge>Why Speak2HR</SectionBadge>
            <h2 className="mt-5 font-black" style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", letterSpacing: "-0.02em", color: "#0f172a" }}>
              Traditional hiring is broken.<br /><span className="glow-text">We fixed it.</span>
            </h2>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{
            background: "white", border: "1px solid rgba(99,130,246,0.12)", boxShadow: "0 8px 40px rgba(99,130,246,0.08)",
          }}>
            <div className="grid grid-cols-3" style={{ borderBottom: "1px solid rgba(99,130,246,0.1)" }}>
              <div className="p-4 text-sm font-semibold" style={{ color: "#94a3b8" }}>Criteria</div>
              <div className="p-4 text-sm font-semibold flex items-center justify-center gap-2"
                style={{ color: "#94a3b8", borderLeft: "1px solid rgba(99,130,246,0.08)" }}>
                <XCircle size={14} color="#ef4444" /> Traditional
              </div>
              <div className="p-4 text-sm font-bold flex items-center justify-center gap-2"
                style={{ color: "#3b82f6", background: "rgba(59,130,246,0.04)", borderLeft: "1px solid rgba(99,130,246,0.1)" }}>
                <CheckCircle size={14} color="#10b981" /> Speak2HR
              </div>
            </div>
            {comparison.map((row, i) => (
              <div key={row.label} className="grid grid-cols-3 transition-colors duration-200"
                style={{
                  borderBottom: i < comparison.length - 1 ? "1px solid rgba(99,130,246,0.06)" : "none",
                  background: i % 2 === 0 ? "transparent" : "rgba(99,130,246,0.015)",
                }}>
                <div className="p-4 text-sm" style={{ color: "#475569", fontFamily: "'Inter', sans-serif" }}>{row.label}</div>
                <div className="p-4 text-sm text-center" style={{ color: "#cbd5e1", borderLeft: "1px solid rgba(99,130,246,0.06)" }}>{row.old}</div>
                <div className="p-4 text-sm text-center font-semibold"
                  style={{ color: "#3b82f6", background: "rgba(59,130,246,0.02)", borderLeft: "1px solid rgba(99,130,246,0.08)" }}>
                  {row.ai}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════ */}
      <section id="testimonials" className="relative py-28" style={{ zIndex: 1, background: "#f2f5fa" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionBadge>Testimonials</SectionBadge>
            <h2 className="mt-5 font-black" style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", letterSpacing: "-0.02em", color: "#0f172a" }}>
              What our users are<br /><span className="glow-text">saying about us</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t) => (
              <div key={t.name}
                className="group p-6 rounded-2xl flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1.5"
                style={{ background: "white", border: "1px solid rgba(99,130,246,0.1)", boxShadow: "0 2px 20px rgba(99,130,246,0.06)" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 10px 40px rgba(99,130,246,0.13)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 20px rgba(99,130,246,0.06)"; }}>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "#64748b", fontFamily: "'Inter', sans-serif" }}>"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2" style={{ borderTop: "1px solid rgba(99,130,246,0.07)" }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: `linear-gradient(135deg, ${t.color}20, ${t.color}10)`, color: t.color, border: `1px solid ${t.color}22` }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "#1e293b" }}>{t.name}</div>
                    <div className="text-xs" style={{ color: "#94a3b8" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FAQ
      ══════════════════════════════════ */}
      <section id="faq" className="relative py-28" style={{ zIndex: 1 }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionBadge>FAQ</SectionBadge>
            <h2 className="mt-5 font-black" style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", letterSpacing: "-0.02em", color: "#0f172a" }}>
              Questions? <span className="glow-text">We have answers.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl overflow-hidden transition-all duration-300" style={{
                background: "white",
                border: "1px solid rgba(99,130,246,0.1)",
                boxShadow: openFaq === i ? "0 6px 30px rgba(99,130,246,0.1)" : "0 2px 12px rgba(99,130,246,0.04)",
              }}>
                <button className="w-full flex items-center justify-between p-5 text-left border-none bg-transparent cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-sm pr-4" style={{ color: "#1e293b" }}>{faq.q}</span>
                  <ChevronDown size={17} style={{
                    color: "#94a3b8", flexShrink: 0,
                    transition: "transform 0.3s ease",
                    transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                  }} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm leading-relaxed"
                    style={{ color: "#64748b", fontFamily: "'Inter', sans-serif", borderTop: "1px solid rgba(99,130,246,0.07)", paddingTop: "1rem" }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FINAL CTA
      ══════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden" style={{ zIndex: 1 }}>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, rgba(239,246,255,0.9) 0%, rgba(237,233,254,0.7) 50%, rgba(236,254,255,0.8) 100%)",
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, rgba(99,130,246,0.06) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }} />
        <div className="absolute" style={{
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
          top: "50%", left: "50%", transform: "translate(-50%,-50%)", filter: "blur(40px)",
        }} />

        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <SectionBadge>Get Started Today</SectionBadge>
          <h2 className="mt-6 font-black leading-tight mb-6" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: "-0.025em" }}>
            <span style={{ color: "#0f172a" }}>Your next great interview</span><br />
            <span className="glow-text">starts here.</span>
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "#64748b", fontFamily: "'Inter', sans-serif" }}>
            Whether you're a candidate preparing for your dream role or an HR team building smarter hiring workflows — Speak2HR is built for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-white transition-all duration-300 cursor-pointer border-none"
              style={{ background: "linear-gradient(135deg, #3b82f6, #7c3aed)", boxShadow: "0 8px 32px rgba(59,130,246,0.38)", fontSize: "1rem" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 14px 48px rgba(59,130,246,0.55)"; e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(59,130,246,0.38)"; e.currentTarget.style.transform = "translateY(0) scale(1)"; }}>
              Get Started Free <ArrowRight size={18} />
            </button>
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 cursor-pointer border"
              style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(99,130,246,0.22)", color: "#4f46e5", boxShadow: "0 4px 20px rgba(99,130,246,0.08)", fontSize: "1rem" }}
              onMouseEnter={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,130,246,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.85)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,130,246,0.08)"; }}>
              Login to Dashboard
            </button>
          </div>
          <p className="mt-6 text-sm" style={{ color: "#94a3b8" }}>
            Portfolio project · Built with React, Node.js & OpenAI · No credit card required
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════
          FOOTER
      ══════════════════════════════════ */}
      <footer className="relative py-16" style={{ zIndex: 1, background: "white", borderTop: "1px solid rgba(99,130,246,0.1)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-4 cursor-pointer" onClick={() => scrollTo("hero")}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", boxShadow: "0 4px 14px rgba(59,130,246,0.3)" }}>
                  <Mic size={16} color="white" />
                </div>
                <span className="text-lg font-bold">
                  <span className="glow-text">Speak</span><span style={{ color: "#0f172a" }}>2HR</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#94a3b8", fontFamily: "'Inter', sans-serif" }}>
                AI-powered interview assessment platform for modern hiring teams and ambitious candidates.
              </p>
              <div className="flex gap-3 mt-5">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <div key={i}
                    className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
                    style={{ background: "rgba(99,130,246,0.06)", border: "1px solid rgba(99,130,246,0.12)", color: "#94a3b8" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#3b82f6"; e.currentTarget.style.background = "rgba(59,130,246,0.08)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "rgba(99,130,246,0.06)"; }}>
                    <Icon size={15} />
                  </div>
                ))}
              </div>
            </div>
            {[
              { title: "Product", links: ["Features", "How It Works", "Demo", "Changelog"] },
              { title: "Company", links: ["About", "Blog", "Portfolio", "Contact"] },
              { title: "Legal",   links: ["Privacy Policy", "Terms of Service", "Security", "Cookies"] },
            ].map((col) => (
              <div key={col.title}>
                <div className="text-xs font-bold tracking-widest uppercase mb-4"
                  style={{ color: "#cbd5e1", fontFamily: "'Geist Mono', monospace" }}>{col.title}</div>
                <div className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <a key={link} href="#" className="text-sm transition-colors duration-200"
                      style={{ color: "#94a3b8" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#3b82f6")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}>
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
            style={{ borderTop: "1px solid rgba(99,130,246,0.08)" }}>
            <p className="text-xs" style={{ color: "#cbd5e1" }}>© 2025 Speak2HR · Portfolio Project · All rights reserved.</p>
            <p className="text-xs flex items-center gap-1.5" style={{ color: "#cbd5e1" }}>
              <Globe size={11} />
              Built with AI · Powered by intelligence
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
