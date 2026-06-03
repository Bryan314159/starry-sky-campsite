import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { parseBookmarkTree } from '../utils/bookmarks';

const MOCK_FOLDERS = [
  {
    id: 'mock-1',
    name: 'AI 工具',
    children: [
      { id: 'u1', title: 'ChatGPT', url: 'https://chatgpt.com' },
      { id: 'u2', title: 'Claude', url: 'https://claude.ai' },
      { id: 'u3', title: 'GitHub', url: 'https://github.com' },
      { id: 'u4', title: 'Vercel', url: 'https://vercel.com' },
    ],
  },
  {
    id: 'mock-2',
    name: '设计灵感',
    children: [
      { id: 'u5', title: 'Awwwards', url: 'https://www.awwwards.com' },
      { id: 'u6', title: 'Behance', url: 'https://www.behance.net' },
      { id: 'u7', title: 'Dribbble', url: 'https://dribbble.com' },
    ],
  },
  {
    id: 'mock-3',
    name: '学习资料',
    children: [
      { id: 'u8', title: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
      { id: 'u9', title: 'React 文档', url: 'https://react.dev' },
    ],
  },
];

function hasChromeBookmarks() {
  return (
    typeof chrome !== 'undefined' &&
    chrome.bookmarks &&
    typeof chrome.bookmarks.getTree === 'function'
  );
}

export function useBookmarks() {
  const { dispatch } = useAppContext();

  useEffect(() => {
    async function load() {
      if (hasChromeBookmarks()) {
        try {
          const tree = await chrome.bookmarks.getTree();
          const folders = parseBookmarkTree(tree);
          dispatch({ type: 'SET_BOOKMARKS', payload: folders });
        } catch (err) {
          console.warn('[星空营地] Failed to load bookmarks:', err);
          dispatch({ type: 'SET_BOOKMARKS', payload: [] });
        }
      } else {
        // Development: use mock data
        dispatch({ type: 'SET_BOOKMARKS', payload: MOCK_FOLDERS });
      }
    }

    load();
  }, [dispatch]);
}
