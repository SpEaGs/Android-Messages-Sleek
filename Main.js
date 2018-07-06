
const winston = require('winston');
const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const url = require('url');
const path = require('path');

let mainWindow;

var logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    ransports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
};

global.log = logger.info;
let log = global.log;

log('Hello world!');

function createWindow(wid = 800, hei = 450) {
    mainWindow = new BrowserWindow({
        width: wid,
        height: hei,
        minWidth: 400,
        minHeight: 225,
        frame: false
    })
    //mainWindow.webContents.openDevTools();
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'Index.html'),
        protocol: 'file',
        slashes: true
    }))
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
};

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    };
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    };
});