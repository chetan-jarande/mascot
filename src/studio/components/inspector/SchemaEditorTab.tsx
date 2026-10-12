import React, { useState, useEffect } from 'react';
import { Check, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import { useGuideStore } from '../../../framework/store/guideStore';
import { SCHEMA_PRESETS } from '../../config/presets';
import type { GuideConfig } from '../../../framework/types/guide-framework';

export const SchemaEditorTab: React.FC = () => {
  const { config, setConfig } = useGuideStore();
  const [text, setText] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (config) {
      setText(JSON.stringify(config, null, 2));
    }
  }, [config]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    try {
      JSON.parse(val);
      setParseError(null);
    } catch (err: any) {
      setParseError(err.message);
    }
  };

  const handleApply = () => {
    try {
      const parsed = JSON.parse(text) as GuideConfig;
      if (!parsed.components || !parsed.globalFallbacks) {
        setParseError('Schema must include components and globalFallbacks objects.');
        return;
      }
      setConfig(parsed);
      setParseError(null);
      setApplied(true);
      setTimeout(() => setApplied(false), 2000);
    } catch (err: any) {
      setParseError(err.message);
    }
  };

  const handleLoadPreset = (key: string) => {
    const preset = SCHEMA_PRESETS[key];
    if (preset) {
      setConfig(preset.config);
      setText(JSON.stringify(preset.config, null, 2));
      setParseError(null);
    }
  };

  return (
    <div className="flex flex-col h-full text-xs">
      {/* Preset Chooser */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-[11px]">
          <Layers className="w-3.5 h-3.5 text-lime-400" />
          <span className="text-slate-400">Preset:</span>
          <select
            onChange={(e) => handleLoadPreset(e.target.value)}
            defaultValue="agency"
            className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            {Object.entries(SCHEMA_PRESETS).map(([key, p]) => (
              <option key={key} value={key} className="bg-slate-900">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleApply}
          disabled={Boolean(parseError)}
          className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
            applied
              ? 'bg-emerald-500 text-slate-950'
              : parseError
              ? 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
              : 'bg-lime-500 hover:bg-lime-400 text-slate-950 shadow-lime-500/20'
          }`}
        >
          {applied ? <Check className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
          {applied ? 'Applied!' : 'Apply Schema'}
        </button>
      </div>

      {parseError && (
        <div className="mb-2 p-2 bg-rose-950/60 border border-rose-500/50 rounded-lg text-rose-300 text-[11px] flex items-center gap-1.5 font-mono">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
          <span className="truncate">{parseError}</span>
        </div>
      )}

      {/* Editor Box */}
      <div className="flex-1 relative">
        <textarea
          value={text}
          onChange={handleTextChange}
          spellCheck={false}
          className="w-full h-full p-3 bg-slate-950 text-emerald-400 font-mono text-[11px] leading-relaxed rounded-xl border border-slate-800 focus:outline-none focus:border-lime-500/80 resize-none selection:bg-lime-500 selection:text-slate-950"
        />
      </div>
    </div>
  );
};
