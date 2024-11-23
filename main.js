const { app, BrowserWindow, Menu  } = require('electron');
const path = require('path');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 720,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    });

    // disable when build
    // Menu.setApplicationMenu(null);
    mainWindow.loadFile('index.html');
});
