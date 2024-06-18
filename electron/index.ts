import { app, BrowserWindow } from 'electron'
import path from 'path'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegrationInWorker: true
    }
  })

  console.log('fsdgsd')

  win.loadFile('./../index.html')
}

app.on('ready', () => {
  createWindow()
})
