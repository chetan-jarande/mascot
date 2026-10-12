import React, { useState } from 'react';
import { Trash2, Copy, Check, Filter } from 'lucide-react';
import { useGuideStore } from '../../../framework/store/guideStore';
import type { TelemetryAction } from '../../../framework/types/guide-framework';

export const TelemetryTab: React.FC = () => {
  const { telemetryLogs, clearTelemetry } = useGuideStore();
  const [filter, setFilter] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const filteredLogs = telemetryLogs.filter((log) => {
    if (filter === 'all') return true;
    if (filter === 'validation') return log.action.includes('validation');
    if (filter === 'tour') return log.action.includes('tour');
    if (filter === 'focus_blur') return log.action === 'focus' || log.action === 'blur';
    return log.action === filter;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(telemetryLogs, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const getActionBadgeClass = (action: TelemetryAction) => {
    switch (action) {
      case 'validation_failed':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'validation_success':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'tour_start':
      case 'tour_step':
      case 'tour_end':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'focus':
        return 'bg-lime-500/20 text-lime-400 border-lime-500/40';
      case 'blur':
        return 'bg-slate-700/50 text-slate-400 border-slate-600/50';
      default:
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    }
  };

  return (
    <div className="flex flex-col h-full text-xs">
      {/* Top Filter and Actions */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-[11px]">
          <Filter className="w-3 h-3 text-slate-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900">All Events ({telemetryLogs.length})</option>
            <option value="validation" className="bg-slate-900">Validation Events</option>
            <option value="tour" className="bg-slate-900">Tour Events</option>
            <option value="focus_blur" className="bg-slate-900">Focus / Blur</option>
            <option value="form_submit" className="bg-slate-900">Form Submissions</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-medium transition-colors border border-slate-700"
            title="Copy logs as JSON"
          >
            {copied ? <Check className="w-3 h-3 text-lime-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={clearTelemetry}
            className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
            title="Clear Log History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 italic">
            No telemetry events recorded yet. Interact with the form inputs or launch the tour.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-[11px] flex flex-col gap-1 transition-all"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getActionBadgeClass(
                    log.action
                  )}`}
                >
                  {log.action}
                </span>
                <span className="text-[10px] text-slate-500">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <div className="text-slate-300 flex items-center justify-between mt-1">
                <span>
                  Target Node: <span className="text-sky-400 font-semibold">#{log.componentId}</span>
                </span>
              </div>

              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <pre className="text-[10px] text-slate-400 bg-slate-900/90 p-1.5 rounded-lg border border-slate-800/80 overflow-x-auto mt-1">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
