import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App smoke test', () => {
  it('renders the 3D canvas', () => {
    const { container } = render(<App />);
    // R3F renders a canvas element
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });
});
