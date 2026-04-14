export type RendererConsoleLevel = 'log' | 'info' | 'warn' | 'error'
export type RendererBrowserToTerminal = boolean | 'warn' | 'error'

export type RendererConsolePayload = {
  level: RendererConsoleLevel
  message: string
  source?: string
}

export const RENDERER_CONSOLE_IPC_CHANNEL = 'renderer-console' as const

export const rendererLogging: { browserToTerminal: RendererBrowserToTerminal } = {
  browserToTerminal: import.meta.env.DEV ? 'warn' : false
}

export function shouldWriteRendererLog(
  browserToTerminal: RendererBrowserToTerminal,
  level: RendererConsoleLevel
): boolean {
  switch (browserToTerminal) {
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
