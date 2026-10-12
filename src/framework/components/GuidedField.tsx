import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { useGuideStore } from '../store/guideStore';

export interface SelectOption {
  value: string;
  label: string;
}

export interface GuidedFieldProps {
  componentId: string;
  type?: 'text' | 'email' | 'select' | 'textarea';
  options?: SelectOption[];
  className?: string;
}

export const GuidedField: React.FC<GuidedFieldProps> = ({
  componentId,
  type = 'text',
  options = [],
  className = '',
}) => {
  const { config, fieldValues, fieldErrors, activeComponentId, setActiveComponent, setFieldValue } =
    useGuideStore();

  const metadata = config?.components[componentId];
  if (!metadata) {
    return (
      <div className="p-3 text-xs text-amber-400 bg-amber-950/40 border border-amber-800 rounded-lg">
        Warning: Missing metadata configuration for component ID: <code>{componentId}</code>
      </div>
    );
  }

  const value = fieldValues[componentId] || '';
  const error = fieldErrors[componentId];
  const isActive = activeComponentId === componentId;
  const isRequired = metadata.validations?.some((r) => r.type === 'required');

  return (
    <div
      data-guide-id={componentId}
      className={`relative p-4 rounded-2xl transition-all duration-300 border ${
        isActive
          ? 'bg-slate-800/80 border-lime-500/80 shadow-lg shadow-lime-500/10 scale-[1.01]'
          : error
          ? 'bg-slate-900/70 border-rose-500/60 shadow-lg shadow-rose-500/10'
          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
      } ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          {metadata.label}
          {isRequired && <span className="text-rose-400 font-bold">*</span>}
        </label>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-950/60 px-1.5 py-0.5 rounded border border-slate-800">
          id: {metadata.componentId}
        </span>
      </div>

      {type === 'select' ? (
        <select
          value={value}
          onFocus={() => setActiveComponent(componentId)}
          onBlur={() => setActiveComponent(null)}
          onChange={(e) => setFieldValue(componentId, e.target.value)}
          className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500/40 transition-all cursor-pointer"
        >
          <option value="">{metadata.placeholder || 'Select an option...'}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={value}
          placeholder={metadata.placeholder}
          rows={3}
          onFocus={() => setActiveComponent(componentId)}
          onBlur={() => setActiveComponent(null)}
          onChange={(e) => setFieldValue(componentId, e.target.value)}
          className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500/40 transition-all resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={metadata.placeholder}
          onFocus={() => setActiveComponent(componentId)}
          onBlur={() => setActiveComponent(null)}
          onChange={(e) => setFieldValue(componentId, e.target.value)}
          className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500/40 transition-all"
        />
      )}

      {/* Field Status / Validation Feedback */}
      <div className="mt-2.5 flex items-start gap-1.5 text-[11px] min-h-[18px]">
        {error ? (
          <p className="text-rose-400 font-medium flex items-center gap-1.5 animate-fadeIn">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
          </p>
        ) : (
          <p className="text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 text-slate-500" />
            {metadata.infoMessage || 'Enter details for this field.'}
          </p>
        )}
      </div>
    </div>
  );
};
