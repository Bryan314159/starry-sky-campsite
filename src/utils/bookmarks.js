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

  // Find "Bookmarks Bar" / "书签栏" node
  // Chrome uses id="1" for the bookmarks bar, but may also use "toolbar_____"
  // Fall back to matching by known titles or parentId=0 children
  let toolbar = root.children?.find(
    (node) =>
      node.id === '1' ||
      node.id === 'toolbar_____' ||
      (node.title || '').includes('书签栏') ||
      (node.title || '').includes('Bookmarks Bar') ||
      (node.title || '').includes('Bookmarks bar'),
  );

  // Fallback: if toolbar not found by id or title, use any non-system folder at root level
  if (!toolbar || !Array.isArray(toolbar.children)) {
    if (Array.isArray(root.children)) {
      for (const child of root.children) {
        if (child.children && !child.url && child.children.length > 0) {
          const title = (child.title || '').trim();
          if (!SYSTEM_FOLDERS.has(title)) {
            toolbar = child;
            break;
          }
        }
      }
    }
  }

  if (!toolbar || !Array.isArray(toolbar.children)) return [];

  const folders = [];

  for (const node of toolbar.children) {
    // Only process folders (no url property means it's a folder)
    if (node.url) continue;

    const title = (node.title || '').trim();
    if (!title) continue;

    // Exclude system folders
    if (SYSTEM_FOLDERS.has(title)) continue;

    const links = flattenLinks(node);

    // Exclude empty folders
    if (links.length === 0) continue;

    folders.push({
      id: node.id,
      name: title,
      children: links,
    });
  }

  return folders;
}
