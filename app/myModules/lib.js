/*所有require库的引用，所有reqire都应指向这里，以便于单个module重载刷新*/

var mod = {};

mod.reload = function () {
    if (!mod.isReady) {
        mod.isReady = true;
        mod.http = require('http');
        mod.socketio = require('socket.io');
        mod.url = require('url');
        mod.fs = require('fs');
        mod.path = require('path');
        mod.hash = require("crypto");

        /*重载其他js文件*/
        mod.app = require('./app.js');
        mod.cfg = require('./cfg.js');
        mod.mime = require('./mime.js');
        mod.httpHandler = require('./httpHandler.js');
    }
    return mod;
};

/*导出*/
module.exports = mod;
