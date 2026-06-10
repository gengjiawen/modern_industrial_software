import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'

import { test, expect, _electron as electron, ElectronApplication } from '@playwright/test'

const requireFromRoot = createRequire(resolve(process.cwd(), 'package.json'))
const electronExecutablePath = requireFromRoot('electron') as string
const playwrightCoreDir = dirname(requireFromRoot.resolve('playwright-core/package.json'))
const electronLoaderPath = join(playwrightCoreDir, 'lib/server/electron/loader.js')

let electronApp: ElectronApplication

test.beforeEach(async () => {
  electronApp = await electron.launch({
    executablePath: electronExecutablePath,
    args: ['-r', electronLoaderPath, resolve(process.cwd(), 'out/main/index.js')],
    env: {
      ...process.env,
      NODE_ENV: 'test'
    }
  })

  await electronApp.waitForEvent('window')
})

test.afterEach(async () => {
  if (electronApp) {
    await electronApp.close()
  }
})

test('Electron app starts without crashing or white screen', async () => {
  const window = await electronApp.firstWindow()

  await window.waitForLoadState('domcontentloaded')
  await expect(window.locator('#root > *').first()).toBeVisible()
  await expect(window.locator('main').first()).toBeVisible()

  const rootChildCount = await window.locator('#root > *').count()
  expect(rootChildCount).toBeGreaterThan(0)

  const visibleTextLength = await window.locator('body').evaluate((body) => body.innerText.trim().length)
  expect(visibleTextLength).toBeGreaterThan(20)

  await window.waitForTimeout(1500)
  expect(await window.isClosed()).toBe(false)
})
