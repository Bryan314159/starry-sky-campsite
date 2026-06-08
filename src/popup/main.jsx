import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ImagePicker from '../overlays/ImagePicker';
import './popup.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ImagePicker />
  </StrictMode>,
);
