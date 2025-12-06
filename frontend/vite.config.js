import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const dotnetTarget = env.VITE_DOTNET_PROXY_TARGET || env.VITE_DOTNET_API_BASE
  const fastApiTarget = env.VITE_FASTAPI_PROXY_TARGET || env.VITE_FASTAPI_BASE

  return {
    plugins: [react()],
    server: {
      proxy: {
        ...(dotnetTarget
          ? {
              '/dotnet': {
                target: dotnetTarget,
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/dotnet/, ''),
              },
            }
          : {}),
        ...(fastApiTarget
          ? {
              '/fastapi': {
                target: fastApiTarget,
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/fastapi/, ''),
              },
            }
          : {}),
      },
    },
  }
})
