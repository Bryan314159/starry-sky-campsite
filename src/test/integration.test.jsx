/**
 * Integration test: simulate a real Chrome bookmarks API call
 * and verify the full flow from raw tree → parsed folders → Context state.
 */
import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { AppProvider, useAppContext } from '../context/AppContext';
import { parseBookmarkTree } from '../utils/bookmarks';
import { useBookmarks } from '../hooks/useBookmarks';

// Simulate a real Chrome tree where bookmarks are in 其他书签, not 书签栏
const REAL_CHROME_TREE = [
  {
    id: '0',
    title: '',
    children: [
      {
        id: 'toolbar_____',
        title: 'Bookmarks bar',
        children: [], // EMPTY bookmarks bar
      },
      {
        id: 'unfiled_____',
        title: '其他书签',
        children: [
          {
            id: '10',
            title: '我的工具',
            children: [
              { id: '11', title: 'GitHub', url: 'https://github.com' },
              { id: '12', title: 'Stack Overflow', url: 'https://stackoverflow.com' },
            ],
          },
          {
            id: '20',
            title: 'AI 助手',
            children: [
              { id: '21', title: 'ChatGPT', url: 'https://chatgpt.com' },
            ],
          },
        ],
      },
    ],
  },
];

describe('Integration: real Chrome tree → AppContext → UI', () => {
  it('SP1.1: parses "Bookmarks bar" (lowercase b), even when empty, and falls through to 其他书签', () => {
    const folders = parseBookmarkTree(REAL_CHROME_TREE);
    expect(folders).toHaveLength(2);
    expect(folders[0].name).toBe('我的工具');
    expect(folders[0].children).toHaveLength(2);
    expect(folders[1].name).toBe('AI 助手');
    expect(folders[1].children).toHaveLength(1);
  });
});

describe('Integration: useBookmarks hook with mocked chrome API', () => {
  it('loads real bookmarks when chrome.bookmarks is available', async () => {
    // Mock chrome API
    const originalChrome = globalThis.chrome;
    globalThis.chrome = {
      bookmarks: {
        getTree: () => Promise.resolve(REAL_CHROME_TREE),
      },
    };

    const ctxRef = { current: null };

    function Probe() {
      const ctx = useAppContext();
      ctxRef.current = ctx;
      return null;
    }

    function HookWrapper() {
      useBookmarks();
      return null;
    }

    render(
      <AppProvider>
        <Probe />
        <HookWrapper />
      </AppProvider>,
    );

    await waitFor(() => {
      expect(ctxRef.current.state.bookmarksLoaded).toBe(true);
    });

    expect(ctxRef.current.state.folders).toHaveLength(2);
    expect(ctxRef.current.state.hasBookmarks).toBe(true);
    expect(ctxRef.current.state.folders[0].name).toBe('我的工具');

    globalThis.chrome = originalChrome;
  });
});
