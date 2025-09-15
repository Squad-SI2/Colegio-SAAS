import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })



// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: true,
//     port: 5173,
//     strictPort: true, //opcional
//     proxy: {
//       // cualquier fetch a /api/* se redirige al backend dentro de la red Docker
//       '/api': { target: 'http://backend:8000', changeOrigin: true }
//     }
//   }
// })

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      // Reenvía /api al backend por el nombre del servicio dentro de la red Docker
      '/api': {
        target: 'http://backend:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

