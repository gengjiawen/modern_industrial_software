import { defineConfig } from 'vite'
import { createRendererBaseConfig, rendererRoot } from './vite.renderer.shared'

export default defineConfig({
  ...createRendererBaseConfig(),
  root: rendererRoot,
  server: {
    allowedHosts: ['eu.gengjiawen.com'],
    host: '0.0.0.0',
    port: 3000
  }
})
