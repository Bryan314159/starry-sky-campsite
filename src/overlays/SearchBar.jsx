import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function SearchBar() {
  const { state } = useAppContext();
  const [query, setQuery] = useState('');

  const isNight = state.scene === 'starry';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      const hasChrome =
        typeof chrome !== 'undefined' && chrome.search?.query;
      if (hasChrome) {
        chrome.search.query({ text: query.trim(), disposition: 'NEW_TAB' });
      } else {
        // Fallback for dev environment
        window.open(
          `https://www.google.com/search?q=${encodeURIComponent(query.trim())}`,
          '_blank',
        );
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        transition: 'background 300ms ease, border-color 300ms ease',
      }}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="搜索..."
        aria-label="搜索书签"
        style={{
          width: 320,
          padding: '10px 20px',
          border: isNight
            ? '1px solid rgba(255, 238, 170, 0.3)'
            : '1px solid rgba(139, 105, 20, 0.25)',
          borderRadius: 20,
          background: isNight
            ? 'rgba(20, 24, 60, 0.65)'
            : 'rgba(255, 251, 235, 0.7)',
          color: isNight ? '#fff4c8' : '#3b2a13',
          fontFamily: '"STKaiti", "KaiTi", "FZKai-Z03S", serif',
          fontSize: 15,
          textAlign: 'center',
          outline: 'none',
          backdropFilter: 'blur(6px)',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}
