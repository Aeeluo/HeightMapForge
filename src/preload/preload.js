const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    downloadTiles: (config) => ipcRenderer.invoke("download-tiles", config),
});