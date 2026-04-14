import {
  rendererLogging,
  shouldWriteRendererLog,
  type RendererConsoleLevel
} from '../../../shared/rendererConsole'

const FORWARDED_CONSOLE_METHODS = ['log', 'info', 'warn', 'error'] as const satisfies readonly RendererConsoleLevel[]
const CONSOLE_PLACEHOLDER_PATTERN = /%[%sdifoOc]/gu

type ForwardedConsoleMethod = (typeof FORWARDED_CONSOLE_METHODS)[number]

type OriginalConsoleMethods = Record<ForwardedConsoleMethod, (...args: unknown[]) => void>

declare global {
  interface Window {
    __rendererConsoleForwardingState__?: {
      installed: boolean
      originals: OriginalConsoleMethods
    }
  }
}

export function installRendererConsoleForwarding(): void {
  if (
    typeof window === 'undefined' ||
    !window.electron?.forwardRendererConsole ||
    rendererLogging.browserToTerminal === false
  ) {
    return
  }

  const state =
    window.__rendererConsoleForwardingState__ ??
    (window.__rendererConsoleForwardingState__ = {
      installed: false,
      originals: {
        log: console.log.bind(console),
        info: console.info.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console)
      }
    })

  if (state.installed) {
    return
  }

  state.installed = true

  const consoleProxy = console as Console & Record<ForwardedConsoleMethod, (...args: unknown[]) => void>

  FORWARDED_CONSOLE_METHODS.forEach((level) => {
    consoleProxy[level] = (...args: unknown[]) => {
      state.originals[level](...args)

      if (!shouldWriteRendererLog(rendererLogging.browserToTerminal, level)) {
        return
      }

      try {
        window.electron.forwardRendererConsole({
          level,
          message: formatConsoleArguments(args),
          source: getConsoleSourceLocation()
        })
      } catch {
        // Ignore bridge failures to avoid recursive console logging.
      }
    }
  })
}

function formatConsoleArguments(args: unknown[]): string {
  if (args.length === 0) {
    return ''
  }

  const [first, ...rest] = args

  if (typeof first !== 'string') {
    return args.map((value) => serializeConsoleValue(value)).join(' ')
  }

  let argumentIndex = 0

  const formatted = first.replace(CONSOLE_PLACEHOLDER_PATTERN, (token) => {
    if (token === '%%') {
      return '%'
    }

    const value = rest[argumentIndex]

    if (token === '%c') {
      argumentIndex += 1
      return ''
    }

    if (value === undefined) {
      return token
    }

    argumentIndex += 1

    switch (token) {
      case '%d':
      case '%i':
        return formatNumber(value, true)
      case '%f':
        return formatNumber(value, false)
      case '%o':
      case '%O':
        return serializeConsoleValue(value)
      case '%s':
      default:
        return String(value)
    }
  })

  const trailingArguments = rest
    .slice(argumentIndex)
    .map((value) => serializeConsoleValue(value))
    .join(' ')

  if (!formatted) {
    return trailingArguments
  }

  return trailingArguments ? `${formatted} ${trailingArguments}` : formatted
}

function formatNumber(value: unknown, integerOnly: boolean): string {
  const parsed = Number(value)

  if (Number.isNaN(parsed)) {
    return 'NaN'
  }

  return integerOnly ? String(Math.trunc(parsed)) : String(parsed)
}

function serializeConsoleValue(value: unknown): string {
  switch (typeof value) {
    case 'bigint':
    case 'boolean':
    case 'number':
      return String(value)
    case 'function':
      return `[Function ${value.name || 'anonymous'}]`
    case 'string':
      return value
    case 'symbol':
      return value.toString()
    case 'undefined':
      return 'undefined'
    case 'object':
      break
    default:
      return String(value)
  }

  if (value === null) {
    return 'null'
  }

  if (value instanceof Error) {
    return value.stack ?? `${value.name}: ${value.message}`
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (value instanceof URL) {
    return value.toString()
  }

  if (typeof Element !== 'undefined' && value instanceof Element) {
    return value.outerHTML
  }

  return safeStringify(value)
}

function safeStringify(value: object): string {
  const seen = new WeakSet<object>()

  try {
    const serialized = JSON.stringify(value, (_key, currentValue) => normalizeConsoleValue(currentValue, seen))
    return serialized ?? Object.prototype.toString.call(value)
  } catch {
    return Object.prototype.toString.call(value)
  }
}

function normalizeConsoleValue(value: unknown, seen: WeakSet<object>): unknown {
  switch (typeof value) {
    case 'bigint':
      return String(value)
    case 'function':
      return `[Function ${value.name || 'anonymous'}]`
    case 'symbol':
      return value.toString()
    default:
      break
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack
    }
  }

  if (value instanceof Map) {
    return {
      type: 'Map',
      entries: Array.from(value.entries())
    }
  }

  if (value instanceof Set) {
    return {
      type: 'Set',
      values: Array.from(value.values())
    }
  }

  if (typeof Element !== 'undefined' && value instanceof Element) {
    return value.outerHTML
  }

  if (value && typeof value === 'object') {
    if (seen.has(value)) {
      return '[Circular]'
    }

    seen.add(value)
  }

  return value
}

function getConsoleSourceLocation(): string | undefined {
  const stack = new Error().stack

  if (!stack) {
    return undefined
  }

  const stackFrames = stack
    .split('\n')
    .map((frame) => frame.trim())
    .filter(Boolean)

  for (const frame of stackFrames) {
    if (!frame.startsWith('at ')) {
      continue
    }

    if (frame.includes('rendererConsoleForwarding')) {
      continue
    }

    const locationMatch = frame.match(/\(?((?:https?|file):\/\/[^)\s]+|\/[^)\s]+):(\d+):(\d+)\)?$/u)

    if (!locationMatch) {
      continue
    }

    const [, rawLocation, line, column] = locationMatch
    return `${formatSourcePath(rawLocation)}:${line}:${column}`
  }

  return undefined
}

function formatSourcePath(rawLocation: string): string {
  try {
    const locationUrl = new URL(rawLocation)

    if (locationUrl.protocol === 'http:' || locationUrl.protocol === 'https:') {
      return decodeURIComponent(locationUrl.pathname.replace(/^\//u, ''))
    }

    if (locationUrl.protocol === 'file:') {
      return decodeURIComponent(locationUrl.pathname)
    }
  } catch {
    return rawLocation
  }

  return rawLocation
}
