/*主要app，用于启动服务
注意！自动重载会因为端口占用而导致程序崩溃*/
var lib = require('./lib.js').reload();
var mod = {};

mod.svr = lib.http.createServer(lib.httpHandler.handler);
mod.sktio = lib.socketio(mod.svr);

/*启动服务*/
mod.startSever = function () {
    //启动http和sktio服务
    mod.svr.listen(lib.cfg.svrPort);
    //输出
    lib.logr.log(['app.startSever', 'Server starting...']);
};

/*导出*/
module.exports = mod;







//
