/*将http接口动态请求分发到httpApis文件夹注册的所有接口函数
将静态/web请求直接处理返回
*/
var app;
var mod = {};
mod.apis = {};
mod.name = 'httpHandler';

/*引入第三方库*/
var fs = require('fs');
var url = require('url');
var path = require('path');

/*引入自己的库*/
var mime = require('./mime.js');
var cfg = require('./cfg.js');

/*所有http请求的接口控制器,分发到app.httpApis[urlobj.pathname]*/
mod.handler = handlerFn;

function handlerFn(req, resp, next) {
    var urlobj = url.parse(req.url);
    var urlpath = urlobj.pathname;

    console.log('>>get http req', req.url);

    if (urlpath.indexOf('/api/') == 0) {
        //动态Api接口
        var apifn = mod.apis[urlpath];
        if (apifn && apifn.constructor == Function) {
            try {
                apifn(urlobj, req, resp, next);
            } catch (err) {
                console.log('>app.httpHandler ERR', req.url);
            };
        } else {
            send404File(resp);
        }
    } else {
        //静态文件服务，对特殊目录重新定向
        switch (urlpath) {
        case '/':
            urlpath = '/index.html';
            break;
        case '/favicon.ico':
            urlpath = '/favicon.ico';
            break;
        default:
            break;
        };
        urlpath = 'web' + urlpath; //静态文件都是相对于web的路径,这里的路径不受当前目录影响
        mod.webHandler(urlpath, urlobj, req, resp, next);
    }
};

/*处理静态文件函数*/
mod.webHandler = webHandlerFn;

function webHandlerFn(fpath, urlobj, req, resp, next) {
    var ext = path.extname(fpath);
    var mimetype = mime[ext];

    //返回文件数据
    if (!app) app = require('./app.js');
    fs.exists(fpath, function (exists) {
        if (exists) {
            var dat = fs.readFileSync(fpath);
            resp.writeHead(200, mimetype);
            resp.end(dat);
        } else {
            //找不到文件，返回404模版
            send404File(resp);
        };
    });
};

/*返回404错误页面模版*/
function send404File(resp) {
    var dat = fs.readFileSync('web/404.html', 'utf-8');
    resp.writeHead(404, mime['.html']);
    resp.end(dat);
};


/*导出*/
module.exports = mod;
