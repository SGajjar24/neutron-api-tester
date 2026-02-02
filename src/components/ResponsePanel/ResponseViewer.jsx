import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { shadesOfPurple } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
    CheckCircle2,
    AlertCircle,
    Clock,
    Database,
    Copy,
    Download,
    Zap,
    ShieldAlert,
    Search,
    ChevronDown,
    Info,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomePanel from '../WelcomePanel';

// Custom syntax highlighter theme modification
const customTheme = {
    ...shadesOfPurple,
    'hljs': {
        ...shadesOfPurple['hljs'],
        background: 'transparent',
        padding: '1.5rem',
        fontSize: '12px',
        lineHeight: '1.6',
        fontFamily: '"JetBrains Mono", monospace'
    }
};

const ResponseViewer = ({ response, isLoading, onSelectExample }) => {
    const [activeTab, setActiveTab] = useState('body');
    const [copied, setCopied] = useState(false);

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 bg-slate-950/20 backdrop-blur-sm h-full">
                <div className="relative">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 180, 360],
                        }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="w-24 h-24 rounded-3xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.15)] backdrop-blur-md"
                    >
                        <Zap className="w-10 h-10 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    </motion.div>
                    <div className="absolute -inset-8 bg-blue-500/5 blur-3xl animate-pulse-slow rounded-full pointer-events-none" />
                </div>
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-white/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        <h3 className="text-xs font-bold text-slate-300 tracking-widest uppercase">Neutron Pulse</h3>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium font-mono">ESTABLISHING UPLINK...</p>
                </div>
            </div>
        );
    }

    if (!response) {
        return <WelcomePanel onSelectExample={onSelectExample} />;
    }

    const isSuccess = response.status >= 200 && response.status < 300;
    const profile = response.profile || {};

    return (
        <div className="flex flex-col h-full relative">
            {/* Context bar */}
            <div className="flex items-center gap-4 px-4 md:px-6 py-3 border-b border-white/5 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-20 overflow-x-auto no-scrollbar">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isSuccess ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                    {isSuccess ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span className="text-sm font-black tracking-tight">{response.status} {response.statusText}</span>
                </div>

                <div className="h-4 w-px bg-white/10 mx-2" />

                <div className="flex items-center gap-4 text-[10px] md:text-xs font-bold text-slate-400 font-mono whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        <span>{response.time}ms</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-purple-400" />
                        <span>{response.size}</span>
                    </div>
                </div>
            </div>

            {/* Main Response Area */}
            <div className="flex-1 overflow-hidden relative group">
                {/* Syntax Highlighted Code */}
                <div className="absolute inset-0 overflow-auto custom-scrollbar">
                    <SyntaxHighlighter
                        language="json"
                        style={customTheme}
                        customStyle={{ margin: 0, minHeight: '100%' }}
                        wrapLines={true}
                        showLineNumbers={true}
                        lineNumberStyle={{ minWidth: '3em', paddingRight: '1em', color: '#334155', textAlign: 'right' }}
                    >
                        {JSON.stringify(response.data || { error: response.message }, null, 2)}
                    </SyntaxHighlighter>
                </div>

                {/* Floating Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={() => {
                            const text = JSON.stringify(response.data || { error: response.message }, null, 2);
                            navigator.clipboard.writeText(text);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                        className={`p-2.5 rounded-xl border backdrop-blur-md shadow-lg transition-all ${copied
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-600'
                            }`}
                        title="Copy Response"
                    >
                        {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={() => {
                            const text = JSON.stringify(response.data || { error: response.message }, null, 2);
                            const blob = new Blob([text], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `neutron-${Date.now()}.json`;
                            a.click();
                        }}
                        className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-600 backdrop-blur-md shadow-lg transition-all"
                        title="Download JSON"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Analysis Footer */}
            <div className="bg-slate-950/80 backdrop-blur-xl border-t border-white/5 p-3 md:p-4 shrink-0">
                <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Live Analysis</span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {profile.version && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">v{profile.version}</span>
                        </div>
                    )}

                    {profile.traits?.map((trait, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-white/5">
                            <div className="w-1 h-1 rounded-full bg-slate-500" />
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">{trait}</span>
                        </div>
                    ))}

                    {profile.boundaries?.rateLimit && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 ml-auto">
                            <ShieldAlert className="w-3 h-3 text-red-400" />
                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-tight">LIMIT: {profile.boundaries.rateLimit.remaining}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResponseViewer;
