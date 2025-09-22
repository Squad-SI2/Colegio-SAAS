import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
    proxy: {
      // Reenvía /api al backend por el nombre del servicio dentro de la red Docker
      '/api': {
        target: 'http://serv-backend:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
