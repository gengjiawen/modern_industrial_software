import type { ElectronAPI } from '@electron-toolkit/preload'

type ReadExcelFileArgs = {
  path: string
  sheet: string
}

type RendererConsolePayload = {
  level: 'log' | 'info' | 'warn' | 'error'
  message: string
  source?: string
}

type RendererElectronAPI = ElectronAPI & {
  readExcelFile: (args: ReadExcelFileArgs) => Promise<Record<string, unknown>[]>
  forwardRendererConsole: (payload: RendererConsolePayload) => void
}

declare global {
  interface Window {
    electron: RendererElectronAPI
  }
}
