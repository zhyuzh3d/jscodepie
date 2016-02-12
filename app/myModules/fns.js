/*常用函数*/
var lib = require('./lib.js').init();
var mod = {};

/*创建一个标准格式msg*/
mod.newMsg = newMsgFn;

function newMsgFn(text, code, data) {
    var res = {};
    res.code = (code == undefined) ? 1 : code;
    res.text = (text == undefined) ? 'OK' : text;
    if (data) res.data = data;
    return res;
};

/*不崩溃的Json转换*/
mod.json2str = json2strFn;

function json2strFn(obj) {
    if (obj == undefined || obj == null) return undefined;
    try {
        return JSON.stringify(obj);
    } catch (err) {
        return undefined;
    }
    return undefined;
};

mod.str2json = str2jsonFn;

function str2jsonFn(str) {
    if (str == undefined || str == null || str.constructor != String) return undefined;
    try {
        return JSON.parse(str);
    } catch (err) {
        return undefined;
    }
    return undefined;
};

/*设置resp的cookie*/
mod.addCookie = addCookieFn;

function addCookieFn(resp, kvstr) {
    var hdr = resp._headers || {};
    var cookies = hdr['set-cookie'] || [];
    cookies.push(kvstr);
    resp.setHeader("Set-Cookie", cookies);
};


/*导出*/
module.exports = mod;
