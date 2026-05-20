import React from 'react';
import {
    Sparkles,
    BookOpen,
    Youtube,
    MapPin,
    ArrowRight,
    Zap,
    Key,
    Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

const EXAMPLE_APIS = [
    {
        name: 'Google Books API',
        icon: <BookOpen className="w-5 h-5" />,
        description: 'Search for books by title, author, or ISBN',
        method: 'GET',
        url: 'https://www.googleapis.com/books/v1/volumes',
        params: [{ key: 'q', value: 'programming' }],
        color: 'blue'
    },
    {
        name: 'YouTube Data API',
        icon: <Youtube className="w-5 h-5" />,
        description: 'Search videos, channels, and playlists',
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/search',
        params: [{ key: 'part', value: 'snippet' }, { key: 'q', value: 'coding tutorial' }],
        requiresKey: true,
        color: 'red'
    },
    {
        name: 'Google Geocoding',
        icon: <MapPin className="w-5 h-5" />,
        description: 'Convert addresses to coordinates',
        method: 'GET',
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        params: [{ key: 'address', value: 'New York, USA' }],
        requiresKey: true,
        color: 'green'
    }
];

const WelcomePanel = ({ onSelectExample, userApiKey }) => {
    const handleSelect = (api) => {
        let params = [...api.params];
        if (api.requiresKey && userApiKey) {
            params.push({ key: 'key', value: userApiKey });
        }
        onSelectExample({
            method: api.method,
            url: api.url,
            params: params.map(p => ({ ...p, active: true }))
        });
    };

    return (
        <div className="flex-1 flex flex-col items-center p-6 md:p-8 pb-20 bg-slate-950/20 overflow-y-auto custom-scrollbar w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full"
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Getting Started</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-100 mb-3 tracking-tight">
                        Welcome to <span className="gradient-text">Neutron</span>
                    </h2>
                    <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                        Test any REST API with automatic version detection, boundary analysis, and real-time profiling.
                    </p>
                </div>

                {/* How It Works */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    {[
                        { step: '1', title: 'Enter URL', desc: 'Paste your API endpoint', icon: <Globe className="w-4 h-4" /> },
                        { step: '2', title: 'Add API Key', desc: 'Include in params or headers', icon: <Key className="w-4 h-4" /> },
                        { step: '3', title: 'Run & Analyze', desc: 'Get instant profiling', icon: <Zap className="w-4 h-4" /> }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/40 text-center group hover:bg-slate-900/50 hover:border-slate-700/50 transition-all"
                        >
                            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Step {item.step}</div>
                            <h4 className="text-sm font-bold text-slate-200 mb-1">{item.title}</h4>
                            <p className="text-[10px] text-slate-500">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Start Examples */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-px flex-1 bg-slate-800/60" />
                        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em]">Quick Start Examples</span>
                        <div className="h-px flex-1 bg-slate-800/60" />
                    </div>

                    <div className="space-y-3">
                        {EXAMPLE_APIS.map((api, idx) => (
                            <motion.button
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + idx * 0.1 }}
                                onClick={() => handleSelect(api)}
                                className="w-full p-4 rounded-2xl bg-slate-900/20 border border-slate-800/40 hover:bg-slate-900/40 hover:border-slate-700/50 transition-all group text-left flex items-center gap-4"
                            >
                                <div className={`p-3 rounded-xl ${api.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                                    api.color === 'red' ? 'bg-red-500/10 text-red-400' :
                                        'bg-green-500/10 text-green-400'
                                    }`}>
                                    {api.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm font-bold text-slate-200">{api.name}</h4>
                                        {api.requiresKey && (
                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                                                API KEY
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-slate-500">{api.description}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* API Key Hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3"
                >
                    <Key className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                        <h5 className="text-xs font-bold text-amber-300 mb-1">Using Your Google API Key</h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                            Go to the <strong className="text-slate-300">Params</strong> tab and add a new parameter with key <code className="px-1.5 py-0.5 rounded bg-slate-800 text-blue-400 text-[10px] font-mono">key</code> and your API key as the value. The profiler will automatically detect the API version and boundaries.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default WelcomePanel;
