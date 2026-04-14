import type { IpcMain } from 'electron'
import {
  RENDERER_CONSOLE_IPC_CHANNEL,
  rendererLogging,
  shouldWriteRendererLog,
  type RendererConsolePayload
} from '../shared/rendererConsole'

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
    if (!shouldWriteRendererLog(rendererLogging.browserToTerminal, payload.level)) {
      return
    }

    writeRendererLog(payload)
  })
}
