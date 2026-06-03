import '@testing-library/jest-dom/vitest';
import { ResizeObserver } from '@juggle/resize-observer';

// Polyfill ResizeObserver for jsdom (required by R3F/@react-three/fiber)
globalThis.ResizeObserver = ResizeObserver;
