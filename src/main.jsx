import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Suppress THREE.Clock deprecation from @react-three/fiber (fixed in R3F v10)
const origWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return;
  origWarn.call(console, ...args);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
