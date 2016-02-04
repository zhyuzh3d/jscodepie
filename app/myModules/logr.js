/*处理所有日志，输出和记入文件，自动新建文件*/
var lib = require('./lib.js').reload();
var mod = {};

var logRootFolder = 'log';
var logFolders = ['sys', 'web'];
var logFiles = {}; //实际存储的当天的文件目录名称
var stag = ';&\n&'; //日志存储分隔符

/*验证和创建目录及主要文件*/
function mkFolder() {
    if (!lib.fs.existsSync(logRootFolder)) {
        lib.fs.mkdirSync(logRootFolder);
    };

    //创建子目录
    logFolders.forEach(function (fdr) {
        var fd = logRootFolder + '/' + fdr;
        if (!lib.fs.existsSync(fd)) {
            lib.fs.mkdirSync(fd);
        };
        refreshLogFile();
    });
};
mkFolder();

/*每10分钟检查是否过了1天需要更新文件名*/
var startDay = (new Date()).getDay(); //当前启动时间

setInterval(function () {
    var curDay = (new Date()).getDay();
    if (startDay != curDay) {
        refreshLogFile();
    };
}, 600000);

/*为所有日志文件创建新的日志文件*/
function refreshLogFile() {
    logFolders.forEach(function (fdr) {
        //更新当天的日志文件名
        var dt = new Date();
        var fname = fdr + lib.moment().format('YYYYMMDD') + '.log';
        logFiles[fdr] = logRootFolder + '/' + fdr + '/' + fname;
    });
};

/*生成log的msg*/
function genLogMsg(msg, logfname) {
    var ms = {};
    ms.time = new Date();
    if (msg.constructor == String) {
        ms = lib.fns.newMsg(msg);
    } else if (msg.constructor == Array) {
        if (msg.length > 0) ms.code = msg[0];
        if (msg.length > 1) ms.text = msg[1];
        if (msg.length > 2) ms.data = msg[2];
    };
    return ms;
};

/*只输出到控制台*/
mod.logc = function (msg, logfname) {
    if (!logfname) logfname = 'sys';
    ms = genLogMsg(msg, logfname);
    console.log(logfname.toUpperCase(), lib.moment().format('HH:mm:ss'), ms.code, '>', ms.text, ms.data);
};

/*写入文件日志,msg可以是object，string或［］
写入msg格式的文字，便于统计和分析
code应使用模块名加函数名，如'app.startSever'*/
mod.logf = function (msg, logfname) {
    if (!logfname) logfname = 'sys';
    ms = genLogMsg(msg, logfname);

    //写入文件并输出到控制台
    var str = lib.fns.json2str(ms);
    lib.fs.appendFile(logFiles[logfname], str + stag);
    return ms;
};

/*写入文件同时输出到控制台*/
mod.log = function (msg, logfname) {
    if (!logfname) logfname = 'sys';
    var ms = mod.logf(msg, logfname);
    console.log(logfname.toUpperCase(), lib.moment().format('HH:mm:ss'), ms.code, '>', ms.text, ms.data);
};





/*导出*/
module.exports = mod;
