/*主要app，用于启动服务*/
var lib = require('./lib.js').reload();
var log = lib.logr.log;
var mod = {};

/*启动服务*/
mod.startSever = function () {
    //启动http和sktio服务
    mod.svr = lib.http.createServer(lib.httpHandler.handler);
    mod.sktio = lib.socketio(mod.svr);
    mod.svr.listen(lib.cfg.svrPort);

    //输出
    log(['app.startSever', 'Server starting...']);
};

/*导出*/
module.exports = mod;




//
