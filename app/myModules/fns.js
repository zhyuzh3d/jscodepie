/*常用函数*/
var lib = require('./lib.js').reload();
var mod = {};

/*创建一个标准格式msg*/
mod.newMsg = function (text, code, data) {
    var res = {};
    res.code = (code == undefined) ? 1 : code;
    res.text = (text == undefined) ? 'OK' : text;
    if (data) res.data = data;
    return res;
};

/*不崩溃的Json转换*/
mod.json2str = function (obj) {
    if (obj == undefined || obj == null) return undefined;
    try {
        return JSON.stringify(obj);
    } catch (err) {
        return undefined;
    }
    return undefined;
};

mod.str2json = function (str) {
    if (str == undefined || str == null || str.constructor != String) return undefined;
    try {
        return JSON.parse(str);
    } catch (err) {
        return undefined;
    }
    return undefined;
};





/*导出*/
module.exports = mod;
