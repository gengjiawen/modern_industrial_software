import type { ElectronAPI } from '@electron-toolkit/preload'
import type { RendererConsolePayload } from '../shared/rendererConsole'

type ReadExcelFileArgs = {
  path: string
  sheet: string
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
