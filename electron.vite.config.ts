import { defineConfig } from 'electron-vite'
import { createRendererBaseConfig } from './vite.renderer.shared'

export default defineConfig({
  main: {
    build: {
      externalizeDeps: true
    }
  },
  preload: {
    build: {
      externalizeDeps: true
    }
  },
  renderer: createRendererBaseConfig()
})
