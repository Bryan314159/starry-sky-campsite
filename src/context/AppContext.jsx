import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext(null);

const initialState = {
  scene: 'campsite',
  folders: [],
  selectedFolder: null,
  bookmarksLoaded: false,
  hasBookmarks: false,
  // Task 2.22 — scene 1 background image (ADR-004 方案 C)
  // Task 2.24 — popup image picker writes to this + chrome.storage.local
  bgImage: '/scenes/campsite-bg.webp',
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
      return { ...state, bgImage: url };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

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
