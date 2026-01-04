import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
 server: {
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'https://noneternally-unhomologous-desirae.ngrok-free.dev',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
