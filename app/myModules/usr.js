/*处理所有用户登录注册、验证修改资料等等相关的接口*/
var lib = require('./lib.js').init();
var mod = {};

/*主要变量*/
var autoid = 0;

/*自动处理html的header
如果没有token，那么自动创建一个用户，把token并写入req
如果已经有token，那么验证用户的token，然后更新token并写入req
nextfn(req,resp,nextfn)*/
mod.setUsrHeader = setUsrHeaderFn;

function setUsrHeaderFn(req, resp, nextfn) {
    var ctoken = req.headers['USRTOKEN'];
    if (ctoken != undefined) {

    } else {
        //新建一个用户
        var hdr = resp._headers || {};
        var cookies = hdr['set-cookie'] || [];
        createTmpUsrFn(function (usr) {
            lib.fns.addCookie(resp, "USRTOKEN=" + usr.token);
            if (nextfn) nextfn(req, resp);
        });
    }
};


/*数据库新建一个用户
返回用户id和自动生成token
token每次手工登陆都会自动更新
resfn(usr)*/
mod.createTmpUsr = createTmpUsrFn;

function createTmpUsrFn(resfn) {
    var timestamp = (new Date()).getTime();
    var usr = {};

    //自增id存储在redis的cfg里面
    usr.id = lib.rds.cfg.autoUsrId = Number(lib.rds.cfg.autoUsrId) + 1;
    lib.rds.saveCfg('autoUsrId', usr.id);

    //token是随机数加id然后Md5加密
    usr.token = lib.crypto.createHash('sha1').update(Math.random() + usr.id + '').digest('base64');
    usr.tokenUpdate = timestamp;

    //写入redis数据库；hash key是uid格式命名如'u123'
    var ukeyname = 'u' + usr.id;
    var mult = lib.rds.cli.multi();
    for (var attr in usr) {
        mult.hmset(ukeyname, attr, usr[attr]);
    };
    mult.exec(function (err, dat) {
        if (!err) {
            console.log('>>>usr', usr);
            if (resfn) resfn(usr);
        } else {
            lib.logr.log(['usr.createTmpUsr', 'redis write failed', err])
        };
    });
};





/*导出*/
module.exports = mod;
