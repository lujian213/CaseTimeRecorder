const { contextBridge, ipcRenderer } = require('electron');

// 向渲染进程暴露安全的IPC方法
contextBridge.exposeInMainWorld('electronIPC', {
  // 窗口控制（最小化/关闭）
  windowControl: (action) => ipcRenderer.send('window:control', action),
  
  // 获取窗口当前位置
  getWindowPosition: () => ipcRenderer.invoke('window:get-position'),

  openNewWindow: (route) => ipcRenderer.send('open-new-window', { route }),

  resizeWindow: (height) => ipcRenderer.send('resize-window', height)
});
