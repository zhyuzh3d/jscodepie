/*redis数据库操作*/
var lib = require('./lib.js').init();
var mod = {};
mod.cfg = {}; //需要累计存储的数据，存入redis数据库

/*初始化，连接并登陆*/
mod.init = initFn;

function initFn(nextfn) {
    mod.cli = lib.redis.createClient(6379, 'localhost', {});
    mod.cli.auth('zhyuzh3DsRedis', function (err, dat) {
        if (!err) {
            initCfg(function () {
                readCfgFn(nextfn);
            });
        } else {
            lib.logr.log(['rds.init', 'Auth failed']);
        }
    });
};


/*初始化config key*/
function initCfg(resfn) {
    var mult = mod.cli.multi();
    if (!mod.cfg['autoUsrId']) mult.hset('_config', 'autoUsrId', 0);

    mult.exec(function (err, dat) {
        if (resfn) {
            resfn(err, dat)
        } else {
            if (err) lib.logr.log(['rds.initCfg', 'Write failed', err]);
        };
    });
};

/*保存一个config设置参数
NX表示如果不存在才会执行*/
mod.saveCfg = saveCfgFn;

function saveCfgFn(field, val, resfn) {
    var orgval = mod.cfg[field];
    mod.cfg[field] = val;
    mod.cli.hset('_config', field, val, function (err, dat) {
        if (resfn) {
            resfn(err, dat)
        } else {
            if (err) lib.logr.log(['rds.saveCfg', 'Write failed', err]);
        };
    });
};

/*读取cfg全部设置key*/
mod.readCfg = readCfgFn;

function readCfgFn(resfn) {
    mod.cli.hgetall('_config', function (err, dat) {
        mod.cfg = dat;
        if (resfn) {
            resfn(err, dat)
        } else {
            if (err) lib.logr.log(['rds.readCfg', 'Read failed', err]);
        };
    });
};


/*复制一个hashkey并重命名
nextfn(isok)
*/
mod.copyHashKey = copyHashKeyFn;

function copyHashKeyFn(orgkey, newkeyname, nextfn) {
    rds.cli.hgetall(orgkey, function (err, okey) {
        if (err) {
            app.fns.logc('ERR', 'redis copyHashKey failed', err);
            if (nextfn) nextfn(false);
            return;
        };
        //写入新key
        var mult = rds.cli.multi();
        for (var attr in okey) {
            mult.hset(newkeyname, attr, okey[attr]);
        };
        mult.exec(function (err, res) {
            if (err) {
                app.fns.logc('ERR', 'redis copyHashKey failed', err);
                if (nextfn) nextfn(false);
                return;
            };
            if (nextfn) nextfn(true);
        })
    })
};


/*把一个rds返回的hash值对队列转化为一个obj
［filed1,val1,filed2,val2,...］*/
mod.hashArr2Obj = hashArr2ObjFn;

function hashArr2ObjFn(arr) {
    if (arr == null || arr == [] || arr.length < 2) return undefined;
    var obj = {};
    for (var i = 0; i < arr.length; i += 2) {
        obj[arr[i]] = arr[i + 1];
    };
    return obj;
}




/*导出*/
module.exports = mod;
