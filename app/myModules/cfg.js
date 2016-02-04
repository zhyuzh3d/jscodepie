/*公开的设置参数，可被外部访问*/
var lib = require('./lib.js').reload();
var mod = {};
var app;
mod.name = 'cfg';

/*服务器相关设置*/
mod.svrPort = 8081; //http服务器端口
mod.webCacheSec = 3600 * 24 * 7; //etag页面缓存期限

mod.a = 0;
setInterval(function () {
    mod.a += 1;
}, 1000);





/*导出*/
module.exports = mod;
