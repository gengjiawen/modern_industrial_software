import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export const rendererRoot = resolve('src/renderer')
export const rendererSrcRoot = resolve('src/renderer/src')
const routesDirectory = resolve(rendererSrcRoot, 'routes')
const generatedRouteTree = resolve(rendererSrcRoot, 'routeTree.gen.ts')

export function createRendererBaseConfig() {
  return {
    plugins: [
      tanstackRouter({
        autoCodeSplitting: true,
        routesDirectory,
        generatedRouteTree
      }),
      react(),
      tailwindcss()
    ],
    resolve: {
      alias: {
        '@': rendererSrcRoot,
        '@renderer': rendererSrcRoot
      }
    }
  }
}
