import React from 'react';
import {
    History,
    Trash2,
    Search,
    Folder,
    MoreVertical,
    Clock,
    ChevronRight,
    Play,
    Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ history = [], onSelect, onClear }) => {

    // Helper to color-code HTTP methods
    const getMethodColor = (method) => {
        switch (method) {
            case 'GET': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'POST': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'PUT': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'DELETE': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    return (
        <div className="w-80 h-full flex flex-col bg-slate-950/40 border-r border-white/5 backdrop-blur-xl relative z-20">
            {/* Branding Header Area */}
            <div className="p-4 border-b border-white/5">
                <div className="relative group">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search workspace..."
                        className="w-full bg-slate-900/50 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-300 outline-none focus:border-blue-500/30 focus:bg-slate-900/80 transition-all placeholder:text-slate-600"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">

                {/* Collections Section */}
                <div>
                    <div className="flex items-center justify-between px-2 mb-2">
                        <h3 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Collections</h3>
                        <button className="p-1 hover:bg-white/5 rounded text-slate-500 hover:text-blue-400 transition-colors">
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="space-y-1">
                        {[
                            {
                                label: 'Google Books API',
                                method: 'GET',
                                url: 'https://www.googleapis.com/books/v1/volumes?q=react',
                                params: [{ key: 'q', value: 'react', active: true }],
                                headers: [],
                                auth: { type: 'none' }
                            },
                            {
                                label: 'JSON Placeholder',
                                method: 'POST',
                                url: 'https://jsonplaceholder.typicode.com/posts',
                                body: '{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}',
                                params: [],
                                headers: [{ key: 'Content-type', value: 'application/json; charset=UTF-8', active: true }],
                                auth: { type: 'none' }
                            },
                            {
                                label: 'HTTP Bin (Auth)',
                                method: 'GET',
                                url: 'https://httpbin.org/bearer',
                                params: [],
                                headers: [],
                                auth: { type: 'bearer' }
                            }
                        ].map((item, i) => (
                            <div
                                key={i}
                                onClick={() => onSelect(item)}
                                className="group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all border border-transparent hover:border-white/5"
                            >
                                <Folder className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                                <span className="text-xs font-semibold">{item.label}</span>
                                <ChevronRight className="ml-auto w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* History Section */}
                <div>
                    <div className="flex items-center justify-between px-2 mb-3">
                        <h3 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            Recent Activity
                        </h3>
                        {history.length > 0 && (
                            <button
                                onClick={onClear}
                                className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors px-2 py-0.5 rounded hover:bg-rose-500/10"
                            >
                                CLEAR
                            </button>
                        )}
                    </div>

                    <div className="space-y-2">
                        <AnimatePresence>
                            {history.length === 0 ? (
                                <div className="px-4 py-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
                                    <History className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                                    <p className="text-[10px] text-slate-500 font-medium">No recent requests</p>
                                </div>
                            ) : (
                                history.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        onClick={() => onSelect(item)}
                                        className="group relative p-3 rounded-xl bg-slate-900/30 border border-white/5 hover:bg-slate-800/40 hover:border-slate-700 transition-all cursor-pointer overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/[0.02] transition-colors" />

                                        <div className="relative flex items-center justify-between mb-1.5">
                                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${getMethodColor(item.method)}`}>
                                                {item.method}
                                            </span>
                                            <span className="text-[9px] font-mono text-slate-600 group-hover:text-slate-500">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>

                                        <div className="relative text-[11px] text-slate-400 font-mono truncate pr-6 group-hover:text-slate-300 transition-colors">
                                            {item.url}
                                        </div>

                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                            <button className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
                                                <Play className="w-3 h-3 fill-current" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* User Profile / Status - Bottom */}
            <div className="p-4 border-t border-white/5 bg-slate-900/20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-500/20">
                        SG
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-200">User Mode</span>
                        <span className="text-[10px] text-slate-500">Professional Grade</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
