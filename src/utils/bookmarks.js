const SYSTEM_FOLDERS = new Set([
  '其他书签', 'Other Bookmarks',
  '移动设备书签', 'Mobile Bookmarks',
]);

/**
 * Flatten a bookmark node's direct children into {id, title, url} array.
 * Only returns direct bookmark items (with url), not sub-folders.
 */
export function flattenLinks(node) {
  const links = [];
  if (!node || !Array.isArray(node.children)) return links;

  for (const child of node.children) {
    if (child.url) {
      links.push({
        id: child.id,
        title: child.title || child.url,
        url: child.url,
      });
    }
  }
  return links;
}

/**
 * Parse the chrome.bookmarks.getTree() result into the format expected by scenes.
 *
 * Rules:
 * 1. Only read first-level bookmark folders (depth 1 under "Bookmarks Bar")
 * 2. Only extract direct bookmark children (no recursive nesting)
 * 3. Exclude system folders ("Other Bookmarks", "Mobile Bookmarks")
 * 4. Exclude empty folders (no direct bookmarks)
 *
 * @param {Array} tree - Result of chrome.bookmarks.getTree()
 * @returns {Array<{id: string, name: string, children: Array<{id, title, url}>}>}
 */
export function parseBookmarkTree(tree) {
  if (!Array.isArray(tree) || tree.length === 0) return [];

  // Find the bookmarks bar node (root[0] is the entire tree)
  const root = tree[0];
  if (!root || !Array.isArray(root.children)) return [];

  // Collect candidate toolbar nodes: any non-system folder at root level
  // (or inside "其他书签" if bookmarks bar is empty)
  const rootCandidates = root.children.filter((node) => {
    if (!node || !Array.isArray(node.children)) return false;
    if (node.url) return false;
    return true;
  });

  // Decide which folders to scan for bookmark items:
  // - The bookmarks bar (id "1" or "toolbar_____" or "书签栏" title)
  // - "其他书签" (Other Bookmarks) - it may contain real bookmark folders
  // The system folders themselves are NOT excluded here; we just look inside them
  // for user-created folders.

  const targetRoots = [];

  const bookmarksBar = rootCandidates.find(
    (node) =>
      node.id === '1' ||
      node.id === 'toolbar_____' ||
      (node.title || '').includes('书签栏') ||
      (node.title || '').toLowerCase().includes('bookmark bar'),
  );
  if (bookmarksBar) targetRoots.push(bookmarksBar);

  const otherBookmarks = rootCandidates.find(
    (node) =>
      node.id === '2' ||
      node.id === 'unfiled_____' ||
      (node.title || '').includes('其他书签') ||
      (node.title || '').toLowerCase().includes('other bookmark'),
  );
  if (otherBookmarks) targetRoots.push(otherBookmarks);

  // If neither was found, fall back to all root folders except empty/system
  if (targetRoots.length === 0) {
    for (const node of rootCandidates) {
      const title = (node.title || '').trim();
      if (title && !SYSTEM_FOLDERS.has(title)) {
        targetRoots.push(node);
      }
    }
  }

  // Collect bookmark folders from target roots
  const folders = [];
  const seenIds = new Set();

  for (const targetRoot of targetRoots) {
    for (const node of targetRoot.children) {
      if (node.url) continue;

      const title = (node.title || '').trim();
      if (!title) continue;

      // Skip if we've already added this folder (avoid dupes)
      if (seenIds.has(node.id)) continue;

      const links = flattenLinks(node);
      if (links.length === 0) continue;

      seenIds.add(node.id);
      folders.push({
        id: node.id,
        name: title,
        children: links,
      });
    }
  }

  return folders;
}
