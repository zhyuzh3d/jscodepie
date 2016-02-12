/*主要app，用于启动服务
注意！自动重载会因为端口占用而导致程序崩溃*/
var lib = require('./lib.js').init();
var mod = {};


/*初始化服务*/
mod.init = initFn;

function initFn(nextfn) {
    mod.sktio = lib.socketio(mod.svr);
    mod.svr = lib.http.createServer(lib.httpHandler.handler);
    lib.rds.init(function () {
        startServerFn();
        if (nextfn) nextfn();
    });
};

/*启动服务器*/
mod.startServer = startServerFn;

function startServerFn() {
    //启动http和sktio服务
    mod.svr.listen(lib.cfg.svrPort);
    lib.logr.log(['app.startSever', 'Server starting...', 'OK']);
}

/*导出*/
module.exports = mod;







//
