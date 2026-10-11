import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 font-sans text-2xl font-semibold">
      Mascot Studio
    </div>
  </React.StrictMode>
);
