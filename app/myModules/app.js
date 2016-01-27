/*主要app，用于启动服务*/

/*服务端顶级app*/
var app = {};

/*载入第三方库*/
app.http = require('http');
app.socketio = require('socket.io');
app.url = require('url');

/*重载其他js文件*/
app.cfg = require('./cfg.js'); //这个设置不能在源码中公开
app.httpHandler = require('./httpHandler.js');

/*启动服务*/
app.startSever = function () {
    //启动http和sktio服务
    app.svr = app.http.createServer(app.httpHandler.handler);
    app.sktio = app.socketio(app.svr);
    app.svr.listen(app.cfg.svrPort);

    //输出
    console.log('>server is starting...');
};


/*导出*/
module.exports = app;




//
