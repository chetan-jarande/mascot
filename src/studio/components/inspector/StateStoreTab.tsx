import React from 'react';
import { useGuideStore } from '../../../framework/store/guideStore';

export const StateStoreTab: React.FC = () => {
  const {
    activeComponentId,
    currentExpression,
    currentMessage,
    activeMascotId,
    tourProviderId,
    tourActive,
    tourStep,
    fieldValues,
    fieldErrors,
  } = useGuideStore();

  return (
    <div className="flex-1 overflow-y-auto space-y-3 font-mono text-xs pr-1">
      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
        <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
          Active Focused Node
        </div>
        <div className="text-lime-400 font-bold">
          {activeComponentId ? `#${activeComponentId}` : 'null (Idle State)'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
            Mascot Emotion
          </div>
          <div className="text-sky-400 font-bold">{currentExpression}</div>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
            Active Avatar
          </div>
          <div className="text-purple-400 font-bold uppercase">{activeMascotId}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
            Tour Status
          </div>
          <div className={tourActive ? 'text-amber-400 font-bold' : 'text-slate-400 font-bold'}>
            {tourActive ? `Active (Step ${tourStep})` : 'Inactive'}
          </div>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
            Tour Engine
          </div>
          <div className="text-cyan-400 font-bold uppercase">{tourProviderId}</div>
        </div>
      </div>

      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
        <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
          Current Mascot Speech
        </div>
        <div className="text-slate-200 text-[11px] leading-relaxed">
          &ldquo;{currentMessage}&rdquo;
        </div>
      </div>

      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
        <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
          Field Values Store
        </div>
        <pre className="text-amber-300 text-[11px] overflow-x-auto">
          {JSON.stringify(fieldValues, null, 2)}
        </pre>
      </div>

      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
        <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
          Field Validation Errors Store
        </div>
        <pre className="text-rose-400 text-[11px] overflow-x-auto">
          {JSON.stringify(fieldErrors, null, 2)}
        </pre>
      </div>
    </div>
  );
};
