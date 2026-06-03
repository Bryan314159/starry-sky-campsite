import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { useRef } from 'react';
import { AppProvider, useAppContext } from '../context/AppContext';

function TestConsumer({ ctxRef }) {
  const ctx = useAppContext();
  ctxRef.current = ctx;
  return null;
}

function setup() {
  const ctxRef = { current: null };
  render(
    <AppProvider>
      <TestConsumer ctxRef={ctxRef} />
    </AppProvider>,
  );
  return {
    getState() {
      return ctxRef.current.state;
    },
    dispatch(action) {
      act(() => {
        ctxRef.current.dispatch(action);
      });
    },
  };
}

describe('AppContext', () => {
  it('SP1.1: initial state is campsite with no bookmarks', () => {
    const { getState } = setup();
    const state = getState();
    expect(state.scene).toBe('campsite');
    expect(state.folders).toEqual([]);
    expect(state.selectedFolder).toBeNull();
    expect(state.bookmarksLoaded).toBe(false);
    expect(state.hasBookmarks).toBe(false);
  });

  it('SET_BOOKMARKS updates folders and flags', () => {
    const { getState, dispatch } = setup();
    const folders = [
      { id: 'f1', name: 'Dev', children: [{ id: 'b1', title: 'GitHub', url: 'https://github.com' }] },
    ];
    dispatch({ type: 'SET_BOOKMARKS', payload: folders });
    expect(getState().folders).toEqual(folders);
    expect(getState().hasBookmarks).toBe(true);
    expect(getState().bookmarksLoaded).toBe(true);
  });

  it('SET_BOOKMARKS with empty array sets hasBookmarks false', () => {
    const { getState, dispatch } = setup();
    dispatch({ type: 'SET_BOOKMARKS', payload: [] });
    expect(getState().hasBookmarks).toBe(false);
  });

  it('SP1.4 / SP4.1: SELECT_FOLDER switches scene to starry', () => {
    const { getState, dispatch } = setup();
    const folder = { id: 'f1', name: 'Dev', children: [] };
    dispatch({ type: 'SELECT_FOLDER', payload: folder });
    expect(getState().scene).toBe('starry');
    expect(getState().selectedFolder).toBe(folder);
  });

  it('SP3.7 / SP4.2: RETURN_TO_CAMPSITE switches back and clears selection', () => {
    const { getState, dispatch } = setup();
    dispatch({ type: 'SELECT_FOLDER', payload: { id: 'f1' } });
    dispatch({ type: 'RETURN_TO_CAMPSITE' });
    expect(getState().scene).toBe('campsite');
    expect(getState().selectedFolder).toBeNull();
  });

  it('SP4.4: rapid SELECT_FOLDER updates to last folder', () => {
    const { getState, dispatch } = setup();
    dispatch({ type: 'SELECT_FOLDER', payload: { id: 'f1', name: 'A' } });
    dispatch({ type: 'SELECT_FOLDER', payload: { id: 'f2', name: 'B' } });
    expect(getState().selectedFolder.name).toBe('B');
  });

  it('SELECT_FOLDER with null does not change state', () => {
    const { getState, dispatch } = setup();
    dispatch({ type: 'SELECT_FOLDER', payload: null });
    expect(getState().scene).toBe('campsite');
  });

  it('throws when useAppContext used outside AppProvider', () => {
    // Suppress console.error for expected throw
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer ctxRef={{ current: null }} />)).toThrow();
    spy.mockRestore();
  });
});
