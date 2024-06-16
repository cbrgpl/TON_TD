import { type BrowserWindow, ipcMain } from 'electron'

import fs from 'node:fs/promises';
import { Buffer } from 'node:buffer';

import { EThreadEvents } from './../../threadEvents'

const PARSED_DATA_FOLDER = '~'
const generateChunkName = () => Date.now()

export class ChunksStore {
  private _client: BrowserWindow
  constructor( client: BrowserWindow ) {
    this._client = client

    ipcMain.on(EThreadEvents.SAVE_CHUNK, (event, args: [ string[] ] ) => {
      console.log(event)
      console.log(args)
    })
  }

  async saveChunk(chunks: string[]) {
    try {
      const chunkBuffer = new Uint8Array(Buffer.from(chunks.join('\n')));
      await fs.writeFile(`${PARSED_DATA_FOLDER}/${generateChunkName()}.txt`, chunkBuffer)
    } catch(err) {
      console.log(err)
      this._client.webContents.send(EThreadEvents.SAVING_CHUNK_ERROR)
    }
  }
  readChunk(chunksListInx: number) {}
}
