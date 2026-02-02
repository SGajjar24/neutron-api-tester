import React, { useState } from 'react';
import {
    Plus,
    X,
    Eye,
    Settings,
    ShieldCheck,
    Terminal,
    FileCode,
    LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RequestBuilder = ({ request, updateRequest }) => {
    const [activeTab, setActiveTab] = useState('params');

    const addRow = (type) => {
        const updated = [...request[type], { key: '', value: '', active: true }];
        updateRequest({ [type]: updated });
    };

    const removeRow = (type, index) => {
        const updated = request[type].filter((_, i) => i !== index);
        if (updated.length === 0) updated.push({ key: '', value: '', active: true });
        updateRequest({ [type]: updated });
    };

    const updateRow = (type, index, field, value) => {
        const updated = [...request[type]];
        updated[index][field] = value;
        updateRequest({ [type]: updated });
    };

    const tabs = [
        { id: 'params', label: 'Params', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
        { id: 'headers', label: 'Headers', icon: <Terminal className="w-3.5 h-3.5" /> },
        { id: 'body', label: 'Body', icon: <FileCode className="w-3.5 h-3.5" /> },
        { id: 'auth', label: 'Auth', icon: <ShieldCheck className="w-3.5 h-3.5" /> }
    ];

    return (
        <div className="flex flex-col h-full relative">
            {/* Tab Navigation - Redesigned for Mobile Fit */}
            <div className="flex items-center border-b border-white/5 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-10">
                <div className="flex-1 flex items-center overflow-x-auto no-scrollbar mask-fade-right px-1 md:px-0">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex-1 min-w-fit flex items-center justify-center gap-2 px-3 py-4 
                                text-[10px] md:text-[11px] font-bold uppercase tracking-widest transition-all relative
                                ${activeTab === tab.id ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}
                            `}
                        >
                            {tab.icon}
                            <span className="hidden sm:inline">{tab.label}</span>
                            <span className="sm:hidden">{tab.label.slice(0, 4)}</span>

                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Visual Settings Gear */}
                <div className="hidden md:flex items-center pl-3 pr-4 border-l border-white/5">
                    <button className="p-2 text-slate-500 hover:text-white transition-colors hover:rotate-90 duration-500">
                        <Settings className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Tab Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="h-full"
                    >
                        {/* Params & Headers Editor */}
                        {activeTab === 'params' || activeTab === 'headers' ? (
                            <div className="space-y-2">
                                {/* Header Row */}
                                <div className="flex text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-slate-500 font-extrabold px-3 mb-2 opacity-70">
                                    <div className="w-8 sticky left-0"></div>
                                    <div className="flex-1 pl-1">Key</div>
                                    <div className="flex-1 pl-1 ml-3 border-l border-white/5">Value</div>
                                    <div className="w-8"></div>
                                </div>

                                {/* Rows */}
                                {request[activeTab].map((row, index) => (
                                    <div key={index} className="flex items-center gap-2 md:gap-3 group animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                                        <div className="flex items-center justify-center w-8 shrink-0">
                                            <input
                                                type="checkbox"
                                                checked={row.active}
                                                onChange={(e) => updateRow(activeTab, index, 'active', e.target.checked)}
                                                className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900/50 accent-blue-500 cursor-pointer transition-colors hover:border-blue-500/50"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Key"
                                            value={row.key}
                                            onChange={(e) => updateRow(activeTab, index, 'key', e.target.value)}
                                            className="flex-1 min-w-0 bg-slate-900/30 border border-white/5 rounded-lg md:rounded-xl px-3 md:px-4 py-2 text-xs text-slate-200 focus:border-blue-500/40 focus:bg-slate-900/50 transition-all outline-none mono-font placeholder:text-slate-700"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Value"
                                            value={row.value}
                                            onChange={(e) => updateRow(activeTab, index, 'value', e.target.value)}
                                            className="flex-1 min-w-0 bg-slate-900/30 border border-white/5 rounded-lg md:rounded-xl px-3 md:px-4 py-2 text-xs text-slate-200 focus:border-blue-500/40 focus:bg-slate-900/50 transition-all outline-none mono-font placeholder:text-slate-700"
                                        />
                                        <button
                                            onClick={() => removeRow(activeTab, index)}
                                            className="w-8 flex items-center justify-center text-slate-700 hover:text-rose-400 font-bold opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}

                                {/* Add Row Button */}
                                <button
                                    onClick={() => addRow(activeTab)}
                                    className="mt-4 flex items-center gap-2 text-[10px] uppercase font-bold text-blue-400/70 hover:text-blue-400 transition-colors px-1 py-2 group w-full hover:bg-white/[0.02] rounded-lg"
                                >
                                    <div className="p-1 rounded bg-blue-500/10 border border-blue-500/20 group-hover:rotate-90 transition-transform">
                                        <Plus className="w-3 h-3" />
                                    </div>
                                    <span>Add Item</span>
                                </button>
                            </div>
                        ) : activeTab === 'body' ? (
                            <div className="h-full flex flex-col pt-1">
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest hidden md:inline">Content Type:</span>
                                        <select className="bg-slate-900/40 border border-white/10 text-[10px] uppercase font-bold text-blue-400 rounded-lg px-2 md:px-3 py-1 outline-none cursor-pointer hover:border-blue-500/30 hover:bg-slate-900/60 transition-colors">
                                            <option>JSON (application/json)</option>
                                            <option>Text (text/plain)</option>
                                            <option>XML (application/xml)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex-1 relative group">
                                    <textarea
                                        placeholder='{ "key": "value" }'
                                        value={request.body}
                                        onChange={(e) => updateRequest({ body: e.target.value })}
                                        className="w-full h-full bg-slate-950/40 border border-white/5 rounded-xl md:rounded-2xl p-4 md:p-5 mono-font text-[11px] md:text-xs text-slate-300 outline-none focus:border-blue-500/30 focus:bg-slate-950/60 resize-none shadow-inner custom-scrollbar transition-all"
                                        spellCheck="false"
                                    />
                                </div>
                            </div>
                        ) : (
                            // Auth Tab
                            <div className="space-y-6 pt-2">
                                <div className="p-6 md:p-8 border border-white/5 rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-900/40 to-slate-900/10 backdrop-blur-sm relative overflow-hidden group">
                                    <div className="absolute -top-4 -right-4 md:top-0 md:right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity rotate-12 pointer-events-none">
                                        <ShieldCheck className="w-24 h-24 md:w-32 md:h-32 text-blue-400" />
                                    </div>

                                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-4">Authentication Type</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-slate-200 outline-none mb-6 focus:border-blue-500/40 focus:bg-slate-900/80 transition-all appearance-none cursor-pointer relative z-10"
                                            value={request.auth.type}
                                            onChange={(e) => updateRequest({ auth: { ...request.auth, type: e.target.value } })}
                                        >
                                            <option value="none">No Authentication</option>
                                            <option value="bearer">Bearer Token</option>
                                            <option value="basic">Basic Auth</option>
                                            <option value="apikey">API Key</option>
                                        </select>
                                        <div className="absolute right-4 top-3.5 pointer-events-none z-10">
                                            <ChevronDown className="w-4 h-4 text-slate-500" />
                                        </div>
                                    </div>

                                    {request.auth.type === 'bearer' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="space-y-3"
                                        >
                                            <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-wider">Bearer Token</label>
                                            <div className="relative group/input">
                                                <input
                                                    type="password"
                                                    placeholder="Paste token here..."
                                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-xs text-blue-400 mono-font outline-none focus:border-blue-500/40 transition-all placeholder:text-slate-700"
                                                />
                                                <button className="absolute right-3 top-2.5 text-slate-600 hover:text-blue-400 transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

// Helper for chevron since it was not imported
const ChevronDown = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6" /></svg>
);

export default RequestBuilder;
