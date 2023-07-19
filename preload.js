const { contextBridge, ipcRenderer } = require('electron');

// 렌더러 프로세스에서 사용할 API 정의
// use window.electron.doThing() in renderer process
contextBridge.exposeInMainWorld(
  'electron',
  {
    toggleDevTool: () => ipcRenderer.send('toggleDevTool'),
    refresh: () => ipcRenderer.send('refresh'),
  }
)