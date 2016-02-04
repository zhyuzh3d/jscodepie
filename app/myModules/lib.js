/*所有require库的引用，所有reqire都应指向这里，以便于单个module重载刷新
动态载入自定义模块
本页函数不会自动重载*/

var mod = {};
var myModules; //所有modules文件夹下的自定义模块（不包含lib.js)；

mod.reload = function () {
    if (!mod.isReady) {
        mod.isReady = true;

        //基础模块和第三方模块
        mod.http = require('http');
        mod.socketio = require('socket.io');
        mod.url = require('url');
        mod.fs = require('fs');
        mod.path = require('path');
        mod.hash = require('crypto');
        mod.moment = require('moment');

        //重载modules文件夹下的所有js文件模块
        myModules = getMyModules();
        for (var attr in myModules) {
            var fpath = myModules[attr];
            mod[attr] = require('./' + fpath);
        };

        //监听modules文件夹下新增文件并加载新文件
        mod.fs.watch('./myModules/', function (event, fname) {
            switch (event) {
            case 'change':
                //文件变化，重载这个模块
                if (fname != 'lib.js') {
                    var fullpath = mod.path.resolve() + '/myModules/' + fname;
                    var basename = mod.path.basename(fname, '.js');
                    delete require.cache[fullpath]; //清理require缓存需要使用绝对路径
                    mod[basename] = require('./' + fname);
                    mod.logr.log(['lib.reload', 'Module reload on change', fname]);
                };
                break;
            default:
                //其他情况，不管发生什么都全面检查
                var mds = getMyModules();
                for (var attr in mds) {
                    if (!myModules[attr]) {
                        //新增文件
                        var filename = mds[attr];
                        var fullpath = mod.path.resolve() + '/myModules/' + filename;
                        var basename = mod.path.basename(filename, '.js');
                        myModules[basename] = filename; //向mymodules增加新的对象
                        delete require.cache[fullpath];
                        mod[basename] = require('./' + filename);
                        mod.logr.log(['lib.reload', 'Module reload', fname]);
                    };
                };
                break;
            };
        });
    };
    return mod;
};


/*获取所有自定义模块js文件名*/
function getMyModules() {
    var res = {};
    var files = mod.fs.readdirSync('myModules')
    files.forEach(function (file) {
        var fpath = './myModules/' + file;
        var stat = mod.fs.lstatSync(fpath);
        var ext = mod.path.extname(fpath);
        //排除文件夹和lib.js
        if (!stat.isDirectory() && ext == '.js') {
            var fname = mod.path.basename(fpath, '.js');
            if (fname != 'lib') {
                res[fname] = file;
            };
        };
    });
    return res;
};


/*导出*/
module.exports = mod;
