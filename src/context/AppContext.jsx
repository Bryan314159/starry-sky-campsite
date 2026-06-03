import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext(null);

const initialState = {
  scene: 'campsite',
  folders: [],
  selectedFolder: null,
  bookmarksLoaded: false,
  hasBookmarks: false,
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
