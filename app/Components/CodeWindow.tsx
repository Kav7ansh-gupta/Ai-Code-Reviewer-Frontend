"use client";

import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/themes/prism-tomorrow.css";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  Sparkles, 
  Copy, 
  Trash2, 
  ChevronRight, 
  Check, 
  Terminal,
  Cpu,
  Zap,
  AlertCircle
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CodeWindow = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [activeTab, setActiveTab] = useState<"code" | "result">("code");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const Langs = [
    { id: "javascript", name: "JavaScript" },
    { id: "python", name: "Python" },
    { id: "java", name: "Java" },
    { id: "cpp", name: "C++" },
    { id: "c", name: "C" },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(result || code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setCode("");
    setResult("");
    setActiveTab("code");
    setError(null);
  };

  const analyzeCode = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to analyze code");
      }

      const data = await res.json();
      setResult(data.result);
      setActiveTab("result");
    } catch (err) {
      console.error(err);
      setError("An error occurred while analyzing your code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-purple-500/30 p-4 md:p-8 font-sans">
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px]" />
      </div>

      <main className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-2.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                AI Code Reviewer
              </h1>
              <p className="text-zinc-500 text-sm font-medium">Professional real-time analysis</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 bg-zinc-900/50 p-1.5 rounded-xl border border-zinc-800"
          >
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-medium px-3 py-1.5 cursor-pointer outline-none"
            >
              {Langs.map((lang) => (
                <option key={lang.id} value={lang.id} className="bg-zinc-900 text-zinc-100">
                  {lang.name}
                </option>
              ))}
            </select>
            <div className="w-px h-6 bg-zinc-800" />
            <button
              onClick={analyzeCode}
              disabled={loading || !code.trim()}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm transition-all duration-200",
                loading || !code.trim()
                  ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20 active:scale-95"
              )}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Code</span>
                </>
              )}
            </button>
          </motion.div>
        </header>

        {/* Main Editor/Result Container */}
        <div className="grid grid-cols-1 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl overflow-hidden border border-zinc-800/50 flex flex-col h-[70vh]"
          >
            {/* Tabs & Toolbar */}
            <div className="px-4 py-3 bg-zinc-900/40 border-b border-zinc-800/50 flex items-center justify-between">
              <div className="flex p-1 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                <button
                  onClick={() => setActiveTab("code")}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-md transition-all duration-200 flex items-center gap-2",
                    activeTab === "code" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  CODE
                </button>
                <button
                  onClick={() => result && setActiveTab("result")}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-md transition-all duration-200 flex items-center gap-2",
                    activeTab === "result" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300",
                    !result && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  REVIEW
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-all"
                  title="Copy"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleClear}
                  className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Clear"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto custom-scrollbar relative">
              <AnimatePresence mode="wait">
                {activeTab === "code" ? (
                  <motion.div
                    key="editor"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <Editor
                      value={code}
                      onValueChange={(code) => setCode(code)}
                      highlight={(code) => highlight(code, languages[language] || languages.javascript, language)}
                      padding={20}
                      className="font-mono text-sm md:text-base min-h-full prism-editor-wrapper"
                      style={{
                        fontFamily: '"Fira Code", "Fira Mono", monospace',
                        fontSize: 16,
                      }}
                      placeholder="Paste your code here and click Analyze..."
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 prose prose-invert max-w-none prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800"
                  >
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={atomDark as any}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-lg border border-zinc-800 !bg-zinc-950/50"
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={cn("bg-zinc-800 px-1.5 py-0.5 rounded text-purple-400", className)} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {result}
                    </ReactMarkdown>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Alert */}
              {error && (
                <div className="absolute bottom-4 left-4 right-4 animate-in slide-in-from-bottom-2">
                  <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg flex items-center gap-3 backdrop-blur-md">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-sm text-red-200">{error}</p>
                    <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-400">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Stats */}
            <div className="px-4 py-2 bg-zinc-900/40 border-t border-zinc-800/50 flex items-center justify-between text-[10px] md:text-xs text-zinc-500 font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  SYSTEM READY
                </span>
                <span className="hidden md:inline uppercase">MODERN ENGINE v1.0</span>
              </div>
              <div className="flex items-center gap-4">
                <span>{code.length} CHARS</span>
                <span className="uppercase">{language}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8">
          {[
            { icon: Cpu, title: "Bugs & Security", desc: "Identify critical vulnerabilities and logical errors in your code." },
            { icon: Zap, title: "Performance", desc: "Get optimization tips to make your applications faster and more efficient." },
            { icon: ChevronRight, title: "Refactored Code", desc: "Receive high-quality refactored versions of your snippets." },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
              className="glass p-5 rounded-2xl border border-zinc-800/50"
            >
              <feature.icon className="w-5 h-5 text-purple-500 mb-3" />
              <h3 className="font-bold text-zinc-200 text-sm mb-1">{feature.title}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CodeWindow;
