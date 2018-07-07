
const fs = require('fs')
const path = require('path')
const { remote, ipcRenderer } = require('electron');

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

const webview = document.getElementById('webviewMain');
webview.addEventListener('dom-ready', function () {
    webview.insertCSS(fs.readFileSync(path.join(__dirname, 'injected.css'), 'utf8'));
    if (remote.process.env.NODE_ENV === "development") webview.openDevTools()
});
