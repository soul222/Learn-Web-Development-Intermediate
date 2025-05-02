import '../styles/styles.css';
import 'leaflet/dist/leaflet.css'

import App from './pages/app';
import Camera from "./utils/camera";
import {registerServiceWorker} from "./utils";

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.getElementById('main-content'),
    drawerButton: document.getElementById('drawer-button'),
    navigationDrawer: document.getElementById('navigation-drawer'),
    skipLinkButton: document.getElementById('skip-link'),
  });

  setTimeout(() => app.renderPage(), 300)
  await registerServiceWorker()
  
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.bundle.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.log('Registration Service Worker fails:', error);
        });
    });
  }
  

  window.addEventListener('hashchange', async () => {
    await app.renderPage();

    Camera.stopAllStreams();
  });
});

