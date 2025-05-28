const { app, BrowserWindow, ipcMain } = require("electron");
const { downloadTiles } = require("../shared/renderer.js");
console.log(downloadTiles); // This should log the function or `undefined` if there's an issue
const path = require("path");

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            preload: path.join(__dirname, "../preload/preload.js"),
            nodeIntegration: true,
            contextIsolation: true,
        },
    });

    mainWindow.loadFile(path.join(__dirname, "../renderer/views", "index.html"));
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.handle("download-tiles", async (event, config) => {
        const { tileUrl, bbox, zoom } = config;
        return await downloadTiles(tileUrl, bbox, zoom);
    });
});
