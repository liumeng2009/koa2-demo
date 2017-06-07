/**
 * Created by liumeng on 2017/5/24.
 */
/**
 * API错误名称
 */
var ApiErrorNames = {};

ApiErrorNames.UNKNOW_ERROR = 'unknowError';
ApiErrorNames.USER_NOT_EXIST = 'userNotExist';
ApiErrorNames.NAME_PSW_ERROR='namePswError';
ApiErrorNames.MYSQL_ERROR='SequelizeDatabaseError';


/**
 * API错误名称对应的错误信息
 */
const error_map = new Map();

error_map.set(ApiErrorNames.UNKNOW_ERROR, { code: 500, message: '未知错误' });
error_map.set(ApiErrorNames.USER_NOT_EXIST, { code: 200, message: '用户不存在' });
error_map.set(ApiErrorNames.NAME_PSW_ERROR, { code: 200, message: '用户名或者密码错误' });
error_map.set(ApiErrorNames.MYSQL_ERROR, { code: 500, message: '数据库读写失败' });

//根据错误名称获取错误信息
ApiErrorNames.getErrorInfo = (error_name) => {

    var error_info;

    if (error_name) {
        error_info = error_map.get(error_name);
    }

    //如果没有对应的错误信息，默认'未知错误'
    if (!error_info) {
        error_name = ApiErrorNames.UNKNOW_ERROR;
        error_info = error_map.get(error_name);
    }

    return error_info;
}

module.exports = ApiErrorNames;