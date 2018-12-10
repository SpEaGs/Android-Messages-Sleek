
const fs = require('fs')
const path = require('path')
const { remote } = require('electron');
const webview = document.getElementById('webviewMain');

let log = global.log;

function min() {
    remote.getCurrentWindow().minimize();
};
function max() {
    switch (remote.getCurrentWindow().isMaximized()) {
        case true: { remote.getCurrentWindow().unmaximize(); break; };
        case false: { remote.getCurrentWindow().maximize(); break; };
    };
};
function cl() {
    remote.getCurrentWindow().close();
};

webview.addEventListener('dom-ready', function () {
    webview.insertCSS(fs.readFileSync(path.join(__dirname, 'injected.css'), 'utf8'));
    if (remote.process.env.NODE_ENV === "development") webview.openDevTools()
});