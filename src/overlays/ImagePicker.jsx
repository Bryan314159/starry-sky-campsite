import { useState, useEffect } from 'react';
import { SCENE_IMAGES, isValidImageUrl } from '../utils/sceneImages';

/**
 * ImagePicker — popup UI for selecting scene 1 background image.
 *
 * Task 2.24 — popup 手动选图（精简版）
 *
 * 行为：
 *   1. 启动时读 chrome.storage.local.bgImage → 高亮当前选中
 *   2. 用户点击缩略图 → chrome.storage.local.set + 关闭 popup
 *   3. 新标签页打开时 AppContext 会从 storage 读这个值（已实现）
 *
 * 简化为"列表 + 当前选中"：本期只有 1 张图，但仍按多图设计，
 * 未来加 alt-1/alt-2 不需要改 UI。
 */
const STORAGE_KEY = 'bgImage';

function getStoredImage() {
  return new Promise((resolve) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get([STORAGE_KEY], (result) => {
          resolve(result?.[STORAGE_KEY] || null);
        });
      } else {
        resolve(null);
      }
    } catch {
      resolve(null);
    }
  });
}

function setStoredImage(url) {
  return new Promise((resolve) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ [STORAGE_KEY]: url }, () => resolve(true));
      } else {
        resolve(false);
      }
    } catch {
      resolve(false);
    }
  });
}

export default function ImagePicker() {
  const [currentUrl, setCurrentUrl] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getStoredImage().then((url) => {
      if (cancelled) return;
      if (isValidImageUrl(url)) {
        setCurrentUrl(url);
      }
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelect = async (url) => {
    if (url === currentUrl) return; // already selected
    await setStoredImage(url);
    setCurrentUrl(url);
    // Auto-close popup after a brief moment so user sees the selection
    setTimeout(() => {
      try {
        if (typeof window !== 'undefined') window.close();
      } catch {
        /* ignore */
      }
    }, 150);
  };

  return (
    <div>
      <div className="popup-header">
        <span className="popup-title">选择背景图</span>
        <span className="popup-hint">点击切换</span>
      </div>

      <div className="image-list">
        {SCENE_IMAGES.length === 0 ? (
          <div className="popup-empty">暂无可用背景图</div>
        ) : (
          SCENE_IMAGES.map((img) => {
            const isActive = img.url === currentUrl;
            return (
              <div
                key={img.id}
                className={`image-card${isActive ? ' active' : ''}`}
                onClick={() => handleSelect(img.url)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(img.url);
                  }
                }}
              >
                <img
                  className="image-thumb"
                  src={img.url}
                  alt={img.name}
                  loading="lazy"
                />
                <div className="image-info">
                  <div className="image-name">{img.name}</div>
                  <div className="image-desc">{img.description}</div>
                </div>
                {isActive && <div className="image-check">✓</div>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
