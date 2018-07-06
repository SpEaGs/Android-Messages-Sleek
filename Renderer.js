
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