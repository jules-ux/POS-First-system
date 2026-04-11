import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    // 1. Voorkom dat de console wordt leeggemaakt zodat je Tauri-fouten ziet
    clearScreen: false,
    
    plugins: [react(), tailwindcss()],
    
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    // 2. Tauri specifieke server instellingen
    server: {
      port: 1420,
      strictPort: true,
      // Zorg dat Tauri verbinding kan maken met de dev server
      host: process.env.TAURI_DEV_HOST || false,
      hmr: process.env.DISABLE_HMR !== 'true',
    },

    // 3. Zorg dat Tauri omgevingsvariabelen kan lezen
    envPrefix: ['VITE_', 'TAURI_'],
  };
});