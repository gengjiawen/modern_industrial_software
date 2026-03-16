import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export const rendererRoot = resolve('src/renderer')
export const rendererSrcRoot = resolve('src/renderer/src')

export function createRendererBaseConfig() {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': rendererSrcRoot,
        '@renderer': rendererSrcRoot
      }
    }
  }
}
