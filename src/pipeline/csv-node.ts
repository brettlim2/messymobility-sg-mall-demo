import { readFile } from 'node:fs/promises'
import Papa from 'papaparse'
import { parseRow } from './csv'
import type { Ping } from './types'

/** Node/CLI loader — reads a local CSV path without XMLHttpRequest. */
export async function loadPingsFromCsvFile(path: string): Promise<Ping[]> {
  const text = await readFile(path, 'utf-8')
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const pings = results.data
            .map((row) => parseRow(row))
            .filter((p): p is Ping => p !== null)
          resolve(pings)
        } catch (err) {
          reject(err)
        }
      },
      error: (err: Error) => reject(err),
    })
  })
}
