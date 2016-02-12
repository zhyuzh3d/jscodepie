/*应用入口,以及监听watch控制，这个文件不会被自动重载*/
//var app = require('./myModules/app.js');
//app.init();

var lib = require('./myModules/lib.js');
lib.init();
lib.app.init();



lib.watchs.paths.forEach(function (one, i) {
    lib.fs.watch(one, function (event, fname) {
        //如果lib.js变动，重载lib.js,等于变更了watch的回调函数
        if (fname == 'lib.js') {
            var fullpath = lib.path.resolve() + '/myModules/lib.js';
            delete require.cache[fullpath];
            lib = require('./myModules/lib.js');
            lib.init();
        };

        lib.watchs.fns[one](event, fname);
    });
});
