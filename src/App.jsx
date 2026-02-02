import React from 'react';
import {
  Send,
  Activity,
  ChevronDown,
  Globe,
  Zap,
  Command,
  HelpCircle,
  Bell,
  Menu // Added for mobile menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApiTester } from './hooks/useApiTester';
import Sidebar from './components/Sidebar';
import RequestBuilder from './components/RequestPanel/RequestBuilder';
import ResponseViewer from './components/ResponsePanel/ResponseViewer';
import ParticlesBackground from './components/ParticlesBackground';

function App() {
  const {
    request,
    updateRequest,
    response,
    isLoading,
    sendRequest,
    history,
    clearHistory
  } = useApiTester();

  return (
    <div className="relative flex h-dvh w-full overflow-hidden text-slate-200 font-sans selection:bg-blue-500/30">
      <ParticlesBackground />

      {/* Sidebar - Hidden on mobile, visible on lg screens */}
      <div className="hidden lg:block h-full z-20 shrink-0">
        <Sidebar
          history={history}
          onSelect={(item) => updateRequest(item)}
          onClear={clearHistory}
        />
      </div>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10 glass-effect bg-slate-950/30">

        {/* Global Control Header / Navigation */}
        <header className="h-16 md:h-[72px] border-b border-white/5 flex items-center px-4 md:px-8 gap-4 md:gap-8 backdrop-blur-xl sticky top-0 z-30">

          {/* Logo / Brand - Mobile optimized */}
          <div className="flex items-center gap-3 cursor-pointer group shrink-0">
            <div className="relative">
              <div className="p-2 md:p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl md:rounded-2xl shadow-lg shadow-blue-500/20">
                <Command className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            </div>
            <div className="hidden md:flex flex-col">
              <h1 className="text-lg font-black tracking-tight leading-none bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                NEUTRON
                <span className="text-blue-500 ml-1">PRO</span>
              </h1>
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mt-0.5">v3.0 RC</span>
            </div>
          </div>

          {/* Unified URL & Protocol Bar - Responsive */}
          <div className="flex-1 flex gap-2 md:gap-4 items-center max-w-5xl mx-auto w-full">
            <div className="flex-1 flex items-center bg-slate-900/60 border border-white/5 rounded-xl md:rounded-2xl overflow-hidden focus-within:border-blue-500/50 focus-within:bg-slate-900/80 transition-all shadow-lg backdrop-blur-md h-10 md:h-12 hover:border-white/10">

              {/* Method Selector */}
              <div className="flex items-center px-2 md:px-4 border-r border-white/5 bg-white/5 h-full shrink-0">
                <select
                  value={request.method}
                  onChange={(e) => updateRequest({ method: e.target.value })}
                  className={`bg-transparent font-black text-[10px] md:text-xs outline-none cursor-pointer uppercase tracking-widest appearance-none text-center min-w-[40px] md:min-w-[50px]
                      ${['GET', 'HEAD', 'OPTIONS'].includes(request.method) ? 'text-blue-400' :
                      ['POST', 'PUT', 'PATCH'].includes(request.method) ? 'text-emerald-400' : 'text-rose-400'}
                    `}
                >
                  {['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'].map(m => (
                    <option key={m} value={m} className="bg-slate-900 text-slate-200">{m}</option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-500 ml-1 hidden md:block" />
              </div>

              {/* URL Input */}
              <input
                type="text"
                placeholder="https://api.example.com/v1/..."
                value={request.url}
                onChange={(e) => updateRequest({ url: e.target.value })}
                className="flex-1 bg-transparent px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-slate-200 outline-none font-mono placeholder:text-slate-600 w-full"
                onKeyDown={(e) => e.key === 'Enter' && sendRequest()}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={sendRequest}
              disabled={isLoading || !request.url}
              className={`
                h-10 md:h-12 px-4 md:px-8 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.1em] flex items-center gap-2 md:gap-3 transition-all relative overflow-hidden group shrink-0
                ${isLoading || !request.url
                  ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed border border-white/5'
                  : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 border border-white/10'}
              `}
            >
              {isLoading ? (
                <Activity className="w-4 h-4 animate-spin" />
              ) : <Send className="w-3 md:w-4 h-3 md:h-4" />}
              <span className="hidden md:inline">{isLoading ? 'Running...' : 'Send'}</span>
            </button>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3 border-l border-white/5 pl-6 ml-2">
            <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-blue-400 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-blue-400 transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-slate-400 hover:text-white transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Workspace Split Panels - Responsive Stack */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

          {/* Configuration Panel - Top on Mobile, Left on Desktop */}
          <div className="h-[45%] lg:h-full lg:w-[45%] flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 bg-slate-900/20">
            <RequestBuilder request={request} updateRequest={updateRequest} />
          </div>

          {/* Analysis & Output Viewer - Bottom on Mobile, Right on Desktop */}
          <div className="flex-1 h-[55%] lg:h-full flex flex-col relative overflow-hidden bg-slate-950/40">
            <ResponseViewer response={response} isLoading={isLoading} onSelectExample={updateRequest} />
          </div>
        </div>

        {/* Status Footer */}
        <footer className="h-8 md:h-10 border-t border-white/5 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-50 text-[10px] font-mono">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-400 uppercase tracking-tight">System Ready</span>
            </div>
            {response && (
              <div className="hidden md:block font-bold text-slate-500">
                LATENCY: <span className="text-blue-400">{response.time}ms</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-slate-600 font-bold uppercase">
            <span>Neutron Core v3.0</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
