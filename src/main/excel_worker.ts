import { parentPort } from 'worker_threads'
import XLSX from 'xlsx'

parentPort?.on('message', (args: { path: string; sheet: string }) => {
  console.log(`read excel in worker, ${args}`)
  const workbook = XLSX.readFile(args.path)
  const sheetName = args.sheet
  const worksheet = workbook.Sheets[sheetName]
  const data = XLSX.utils.sheet_to_json(worksheet)
  parentPort?.postMessage(data)
})
