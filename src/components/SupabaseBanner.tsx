import { useState } from 'react';
import { DatabaseIcon, CheckCircle2Icon, AlertCircleIcon, XIcon, Loader2Icon } from 'lucide-react';
import { useAppStore } from '../store/AppStore';
import { isSupabaseConfigured } from '../lib/supabase';

export function SupabaseBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { isDemoMode, isCheckingConnection } = useAppStore();

  if (dismissed) return null;

  let bgClass = 'bg-amber-950/80 border-amber-800/60 text-amber-200';
  if (isCheckingConnection) {
    bgClass = 'bg-slate-950/80 border-slate-800/60 text-slate-200';
  } else if (!isDemoMode) {
    bgClass = 'bg-emerald-950/80 border-emerald-800/60 text-emerald-200';
  }

  return (
    <div className={`w-full py-2 px-4 text-xs font-medium border-b flex items-center justify-between transition-colors ${bgClass}`}>
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
        <DatabaseIcon className="h-3.5 w-3.5 shrink-0" />
        {isCheckingConnection ? (
          <div className="flex items-center gap-1.5">
            <Loader2Icon className="h-3.5 w-3.5 text-indigo-400 animate-spin" />
            <span>Verifying Supabase backend connection status...</span>
          </div>
        ) : !isDemoMode ? (
          <div className="flex items-center gap-1.5">
            <CheckCircle2Icon className="h-3.5 w-3.5 text-emerald-400" />
            <span><strong>Supabase Connected:</strong> Real-time database synchronization active.</span>
          </div>
        ) : isSupabaseConfigured ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            <AlertCircleIcon className="h-3.5 w-3.5 text-amber-400" />
            <span><strong>Supabase Connection Failed:</strong> Running in Local Demo Mode. The database in <code>.env.local</code> is unreachable or not fully set up.</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 flex-wrap">
            <AlertCircleIcon className="h-3.5 w-3.5 text-amber-400" />
            <span><strong>Local Demo Mode:</strong> Add <code>VITE_SUPABASE_URL</code> & <code>VITE_SUPABASE_ANON_KEY</code> to <code>.env.local</code> to connect your Supabase database.</span>
          </div>
        )}
      </div>
      <button 
        onClick={() => setDismissed(true)} 
        className="p-1 hover:opacity-75 transition-opacity"
        title="Dismiss banner"
      >
        <XIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
