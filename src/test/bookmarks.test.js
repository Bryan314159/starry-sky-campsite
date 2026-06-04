import { describe, it, expect } from 'vitest';
import { parseBookmarkTree, flattenLinks } from '../utils/bookmarks';

// ── flattenLinks ──

describe('flattenLinks', () => {
  it('extracts direct bookmark children with id, title, url', () => {
    const node = {
      children: [
        { id: '1', title: 'GitHub', url: 'https://github.com' },
        { id: '2', title: 'MDN', url: 'https://developer.mozilla.org' },
      ],
    };
    expect(flattenLinks(node)).toEqual([
      { id: '1', title: 'GitHub', url: 'https://github.com' },
      { id: '2', title: 'MDN', url: 'https://developer.mozilla.org' },
    ]);
  });

  it('skips sub-folders (only returns items with url)', () => {
    const node = {
      children: [
        { id: '1', title: 'GitHub', url: 'https://github.com' },
        { id: '2', title: 'Nested Folder', children: [] },
      ],
    };
    const result = flattenLinks(node);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('returns empty array for node with no children', () => {
    expect(flattenLinks({})).toEqual([]);
    expect(flattenLinks(null)).toEqual([]);
  });
});

// ── parseBookmarkTree ──

function makeTree(toolbarChildren = [], otherChildren = []) {
  return [
    {
      id: '0',
      title: 'Bookmarks',
      children: [
        {
          id: '1',
          title: '书签栏',
          children: toolbarChildren,
        },
        {
          id: '2',
          title: '其他书签',
          children: otherChildren,
        },
      ],
    },
  ];
}

function makeFolder(id, title, bookmarks = []) {
  return {
    id,
    title,
    children: bookmarks.map((b) => ({
      id: b.id,
      title: b.title,
      url: b.url,
    })),
  };
}

describe('parseBookmarkTree', () => {
  it('SP1.1: returns folder with bookmarks as children array', () => {
    const tree = makeTree([
      makeFolder('f1', '开发工具', [
        { id: 'b1', title: 'GitHub', url: 'https://github.com' },
        { id: 'b2', title: 'Claude', url: 'https://claude.ai' },
      ]),
    ]);
    const result = parseBookmarkTree(tree);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 'f1',
      name: '开发工具',
      children: [
        { id: 'b1', title: 'GitHub', url: 'https://github.com' },
        { id: 'b2', title: 'Claude', url: 'https://claude.ai' },
      ],
    });
  });

  it('SP1.1: returns multiple folders', () => {
    const tree = makeTree([
      makeFolder('f1', '开发工具', [{ id: 'b1', title: 'GitHub', url: 'https://github.com' }]),
      makeFolder('f2', '设计灵感', [{ id: 'b2', title: 'Dribbble', url: 'https://dribbble.com' }]),
    ]);
    expect(parseBookmarkTree(tree)).toHaveLength(2);
  });

  it('SP2.1: returns empty array when no valid folders', () => {
    expect(parseBookmarkTree([])).toEqual([]);
    expect(parseBookmarkTree(null)).toEqual([]);
    expect(parseBookmarkTree([{}])).toEqual([]);
  });

  it('SP2.3: excludes empty folders', () => {
    const tree = makeTree([
      { id: 'empty', title: 'Empty', children: [] },
    ]);
    expect(parseBookmarkTree(tree)).toHaveLength(0);
  });

  it('SP2.3: excludes folders with only sub-folders (no direct bookmarks)', () => {
    const tree = makeTree([
      {
        id: 'nested',
        title: 'Nested Only',
        children: [
          { id: 'sub', title: 'Sub', children: [{ id: 'deep', title: 'Deep', url: 'https://x.com' }] },
        ],
      },
    ]);
    expect(parseBookmarkTree(tree)).toHaveLength(0);
  });

  it('falls back: uses "Bookmarks bar" title (lowercase b)', () => {
    const tree = [
      {
        id: '0',
        children: [
          {
            id: 'toolbar_____',
            title: 'Bookmarks bar',
            children: [
              makeFolder('f1', 'Tools', [{ id: 'b1', title: 'GitHub', url: 'https://github.com' }]),
            ],
          },
        ],
      },
    ];
    expect(parseBookmarkTree(tree)).toHaveLength(1);
  });

  it('SCANS other bookmarks when bookmarks bar is empty', () => {
    // User's actual situation: toolbar is empty, all folders in 其他书签
    const tree = makeTree(
      [], // empty bookmarks bar
      [
        makeFolder('f1', '我的工具', [{ id: 'b1', title: 'GH', url: 'https://github.com' }]),
        makeFolder('f2', 'AI 助手', [{ id: 'b2', title: 'ChatGPT', url: 'https://chatgpt.com' }]),
      ],
    );
    const result = parseBookmarkTree(tree);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('我的工具');
    expect(result[1].name).toBe('AI 助手');
  });

  it('SCANS both bookmarks bar and other bookmarks', () => {
    const tree = makeTree(
      [
        makeFolder('f1', 'Bar Folder', [{ id: 'b1', title: 'GH', url: 'https://github.com' }]),
      ],
      [
        makeFolder('f2', 'Unfiled Folder', [{ id: 'b2', title: 'MDN', url: 'https://mdn.io' }]),
      ],
    );
    const result = parseBookmarkTree(tree);
    expect(result).toHaveLength(2);
    expect(result.map((f) => f.name).sort()).toEqual(['Bar Folder', 'Unfiled Folder']);
  });

  it('deduplicates folders with same id', () => {
    const tree = makeTree(
      [
        makeFolder('f1', 'Dupe', [{ id: 'b1', title: 'GH', url: 'https://github.com' }]),
      ],
      [
        // Same id — should not duplicate
        makeFolder('f1', 'Dupe', [{ id: 'b1', title: 'GH', url: 'https://github.com' }]),
      ],
    );
    const result = parseBookmarkTree(tree);
    expect(result).toHaveLength(1);
  });
});
