import React from 'react';
import ReactDOM from 'react-dom/client';
import { StudioApp } from './studio/StudioApp';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <StudioApp />
    </React.StrictMode>
  );
}
