import fs from 'node:fs/promises';
import path from 'path'
import { Buffer } from 'node:buffer';

import { getCacheFolder } from '../utils/getCacheFolder'
const CACHE_FOLDER = getCacheFolder()
const CHUNKS_DIR_PATH = `${CACHE_FOLDER}/chunks`
const STATE_CACHE = `${CACHE_FOLDER}/state.json`

const generateChunkName = () => Date.now()

type IStateCache = {
  processedFilesQnt: number
}

export class ChunksStore {
  private _processedFilesQnt = 0

  private _logError: ( error: string ) => void

  private _stateReadingPromise: Promise<unknown> | null

  constructor( logError: ( error: string ) => void ) {
    this._logError = logError
    this._readState()
  }

  async _readState() {
    let resolveStateReadingPromise: (value: unknown) => void
    try {
      this._stateReadingPromise = new Promise(( resolve ) => {
        resolveStateReadingPromise = resolve
      })

      const stateCacheData = await fs.readFile(STATE_CACHE, 'utf-8')
      const stateCache: IStateCache = JSON.parse(stateCacheData)
      this._processedFilesQnt = stateCache.processedFilesQnt

      resolveStateReadingPromise( null )
    } catch(err) {
      if (err.code === 'ENOENT') {
        resolveStateReadingPromise( null )
        return
      }

      this._logError( err?.message ?? err )
    }

  }

  async _saveState() {
    try {
      const stateCache: IStateCache = {
        processedFilesQnt: this._processedFilesQnt
      }

      const chunkBuffer = new Uint8Array(Buffer.from(JSON.stringify(stateCache)));
      await fs.writeFile(STATE_CACHE, chunkBuffer)
    } catch(err) {
      this._logError( err?.message ?? err )
    }
  }


  async saveChunk(chunk: string[]) {
    try {
      if(this._stateReadingPromise) {
        await this._stateReadingPromise
      }

      const chunkFileName = `${CHUNKS_DIR_PATH}/${generateChunkName()}.txt`
      const dir = path.dirname(chunkFileName)

      await fs.mkdir(dir, { recursive: true });

      const chunkBuffer = new Uint8Array(Buffer.from(chunk.join('\n')));
      await fs.writeFile(chunkFileName, chunkBuffer)
    } catch(err) {
      return err?.message ?? err
    }
  }

  async readChunk() {
    try {
      if(this._stateReadingPromise) {
        await this._stateReadingPromise
      }

      const files = await fs.readdir(CHUNKS_DIR_PATH);
      console.log(files.length, this._processedFilesQnt)
      if(files.length === this._processedFilesQnt) {
        this._processedFilesQnt = 0
        this._saveState()
        return null
      } else if( this._processedFilesQnt > files.length) {
        this._processedFilesQnt = 0
        this._saveState()
      }

      console.log(`reading chunks started with inx ${this._processedFilesQnt+1}`)
      const chunkData = await fs.readFile(`${CHUNKS_DIR_PATH}/${files[this._processedFilesQnt++]}`, 'utf8');
      this._saveState()

      return chunkData.split('\n')
    } catch( err ) {
      return err?.message ?? err
    }
  }
}
