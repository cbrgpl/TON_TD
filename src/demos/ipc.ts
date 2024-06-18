/* eslint-disable no-console */
window.ipcRenderer.on('main-process-message', (_event, ...args: any[]) => {
  console.log('[Receive Main-process message]:', ...args);
});
