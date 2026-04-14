import type { IpcMain } from 'electron'
import { is } from '@electron-toolkit/utils'

export type RendererConsoleLevel = 'log' | 'info' | 'warn' | 'error'
export type RendererBrowserToTerminal = boolean | 'warn' | 'error'

export type RendererConsolePayload = {
  level: RendererConsoleLevel
  message: string
  source?: string
}

/** Must stay in sync with preload `ipcRenderer.send` channel. */
export const RENDERER_CONSOLE_IPC_CHANNEL = 'renderer-console' as const

const rendererLogging: { browserToTerminal: RendererBrowserToTerminal } = {
  browserToTerminal: is.dev ? 'warn' : false
}

function shouldWriteRendererLog(level: RendererConsoleLevel): boolean {
  switch (rendererLogging.browserToTerminal) {
    case true:
      return true
    case 'warn':
      return level === 'warn' || level === 'error'
    case 'error':
      return level === 'error'
    default:
      return false
  }
}

function writeRendererLog(payload: RendererConsolePayload): void {
  const locationSuffix = payload.source ? ` (${payload.source})` : ''
  const message = payload.message
    ? `[renderer] ${payload.message}${locationSuffix}`
    : `[renderer]${locationSuffix}`

  switch (payload.level) {
    case 'error':
      console.error(message)
      return
    case 'warn':
      console.warn(message)
      return
    case 'info':
      console.info(message)
      return
    default:
      console.log(message)
  }
}

export function registerRendererConsoleIpc(ipcMain: IpcMain): void {
  ipcMain.on(RENDERER_CONSOLE_IPC_CHANNEL, (_event, payload: RendererConsolePayload) => {
    if (!shouldWriteRendererLog(payload.level)) {
      return
    }

    writeRendererLog(payload)
  })
}
