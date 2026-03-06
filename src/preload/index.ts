import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

type ReadExcelFileArgs = {
  path: string
  sheet: string
}

const api = {
  readExcelFile: (args: ReadExcelFileArgs) => ipcRenderer.invoke('read-excel-file', args)
}

const electronBridge = {
  ...electronAPI,
  ...api
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronBridge)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-expect-error define in d.ts
  window.electron = electronBridge
}
