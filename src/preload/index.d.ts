import type { ElectronAPI } from '@electron-toolkit/preload'

type ReadExcelFileArgs = {
  path: string
  sheet: string
}

type RendererElectronAPI = ElectronAPI & {
  readExcelFile: (args: ReadExcelFileArgs) => Promise<Record<string, unknown>[]>
}

declare global {
  interface Window {
    electron: RendererElectronAPI
  }
}
