
const winston = require('winston');
const electron = require('electron');
const { app, BrowserWindow } = electron;
const url = require('url');
const path = require('path');
const fs = require('fs');
const config = require('./config.json');



let mainWindow;
let eSender;

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

function createWindow() {
    let bounds = config.windowState.bounds
    let x, y, wid, hei;
    if (bounds) {
        let area = electron.screen.getPrimaryDisplay().workArea;
        if (
            bounds.x >= area.x &&
            bounds.y >= area.y &&
            bounds.x + bounds.width <= area.x + area.width &&
            bounds.y + bounds.height <= area.y + area.height
        ) {
            x = bounds.x;
            y = bounds.y;
        }
        if (bounds.width <= area.width || bounds.height <= area.height) {
            wid = bounds.width;
            hei = bounds.height;
        }
        else { wid = 800, hei = 450, x = 0, y = 0 }
    }
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        },
        x: x,
        y: y,
        width: wid,
        height: hei,
        minWidth: 400,
        minHeight: 225,
        frame: false,
        show: false
    });
    if (process.env.NODE_ENV == 'development') mainWindow.webContents.openDevTools();
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'Index.html'),
        protocol: 'file',
        slashes: true
    }));
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainWindow.on('resize', saveBoundsSoon);
    mainWindow.on('move', saveBoundsSoon);
};

let saveBoundsCookie;
function saveBoundsSoon() {
    if (saveBoundsCookie) clearTimeout(saveBoundsCookie);
    saveBoundsCookie = setTimeout(() => {
        saveBoundsCookie = undefined;
        config.windowState.bounds = mainWindow.getNormalBounds();
        fs.writeFile('config.json', JSON.stringify(config, null, 2), (err) => {
            if (err) {
                console.error(err);
            }
        });
    })
}

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