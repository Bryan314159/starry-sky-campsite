import { createContext, useContext, useReducer, useEffect } from 'react';
import { DEFAULT_BG_IMAGE, isValidImageUrl } from '../utils/sceneImages';

const AppContext = createContext(null);

const initialState = {
  scene: 'campsite',
  folders: [],
  selectedFolder: null,
  bookmarksLoaded: false,
  hasBookmarks: false,
  // Task 2.22 — scene 1 background image (ADR-004 方案 C)
  // Task 2.24 — popup image picker writes to this + chrome.storage.local
  bgImage: DEFAULT_BG_IMAGE,
  // bgImageLoaded: true after we've tried to read chrome.storage once
  // (used by BackgroundImage to know whether to wait or render immediately)
  bgImageLoaded: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_BOOKMARKS': {
      const folders = action.payload;
      return {
        ...state,
        folders,
        hasBookmarks: folders.length > 0,
        bookmarksLoaded: true,
      };
    }

    case 'SELECT_FOLDER': {
      const folder = action.payload;
      if (!folder) return state;
      return {
        ...state,
        selectedFolder: folder,
        scene: 'starry',
      };
    }

    case 'RETURN_TO_CAMPSITE': {
      return {
        ...state,
        scene: 'campsite',
        selectedFolder: null,
      };
    }

    case 'SET_BG_IMAGE': {
      const url = action.payload;
      if (typeof url !== 'string' || !url) return state;
      // Security: only accept URLs from the SCENE_IMAGES catalog
      if (!isValidImageUrl(url)) return state;
      return { ...state, bgImage: url };
    }

    case 'SET_BG_IMAGE_LOADED': {
      return { ...state, bgImageLoaded: true };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Task 2.24 — hydrate bgImage from chrome.storage.local on mount
  // Runs once. If stored URL is invalid (catalog changed), keep default.
  useEffect(() => {
    let cancelled = false;
    const loadStored = () => {
      try {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          chrome.storage.local.get(['bgImage'], (result) => {
            if (cancelled) return;
            const stored = result?.bgImage;
            if (typeof stored === 'string' && isValidImageUrl(stored)) {
              dispatch({ type: 'SET_BG_IMAGE', payload: stored });
            }
            dispatch({ type: 'SET_BG_IMAGE_LOADED' });
          });
        } else {
          // Outside extension context (e.g. dev server) — no storage, mark loaded
          dispatch({ type: 'SET_BG_IMAGE_LOADED' });
        }
      } catch {
        dispatch({ type: 'SET_BG_IMAGE_LOADED' });
      }
    };
    loadStored();
    return () => {
      cancelled = true;
    };
  }, []);

  // Task 2.24 — persist bgImage to chrome.storage.local when it changes
  // (skip the very first dispatch which is hydration; only persist on user action)
  useEffect(() => {
    if (!state.bgImageLoaded) return; // wait for hydration to finish
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ bgImage: state.bgImage });
      }
    } catch {
      // Storage not available (dev) — silently skip
    }
  }, [state.bgImage, state.bgImageLoaded]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within <AppProvider>');
  }
  return ctx;
}
