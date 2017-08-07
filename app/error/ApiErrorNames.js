/**
 * API错误名称
 */
var ApiErrorNames = {};

ApiErrorNames.UNKNOW_ERROR = "unknowError";
ApiErrorNames.USER_NOT_EXIST = "userNotExist";
ApiErrorNames.USER_PSW_ERROR = "userPswError";
ApiErrorNames.JWT_ERROR="jwtError";
ApiErrorNames.NEED_LOGIN="needLogin";
ApiErrorNames.USER_NAME_EXIST='userNameExist';

ApiErrorNames.INPUT_ERROR_TYPE='inputErrorType';

ApiErrorNames.NEED_UNIQUE_BUILDING_NAME="needUniqueBuildingName";
ApiErrorNames.MAX_AND_MIN="maxAndMin";
ApiErrorNames.BUILDING_NOT_NULL="buildingNotNull";
ApiErrorNames.BUILDING_NOT_EXIST="buildingNotExist";

ApiErrorNames.NEED_UNIQUE_GROUP_NAME="needUniqueGroupName";
ApiErrorNames.GROUP_NOT_NULL="groupNotNull";
ApiErrorNames.GROUP_NOT_EXIST="groupNotExist";

ApiErrorNames.CORPORATION_NOT_NULL="corporationNotNull";
ApiErrorNames.NEED_UNIQUE_CORPORATION_NAME="needUniqueCorporationName";
ApiErrorNames.CORPORATION_NOT_EXIST="CorporationNotExist";

ApiErrorNames.CORPBUILDING_NOT_NULL="corpBuildingNotNull";
ApiErrorNames.NEED_UNIQUE_CORP_BUILDING="needUniqueCorpBuilding";
ApiErrorNames.CORP_BUILDING_NOT_EXIST="cropBuildingNotExist";

ApiErrorNames.WORKER_NOT_EXIST="workerNotExist";
ApiErrorNames.WORKER_EXIST="workerExist";

/**
 * API错误名称对应的错误信息
 */
const error_map = new Map();

error_map.set(ApiErrorNames.UNKNOW_ERROR, { code: 500, message: '未知错误！' });
error_map.set(ApiErrorNames.USER_NOT_EXIST, { code: 10001, message: '用户不存在！' });
error_map.set(ApiErrorNames.USER_PSW_ERROR, { code: 10002, message: '密码错误！' });
error_map.set(ApiErrorNames.JWT_ERROR, { code: 10003, message: '身份验证错误！' });
error_map.set(ApiErrorNames.NEED_LOGIN, { code: 10004, message: '请先登录！' });
error_map.set(ApiErrorNames.USER_NAME_EXIST, { code: 10005, message: '用户名已存在！' });

error_map.set(ApiErrorNames.INPUT_ERROR_TYPE, { code: 20001, message: '输入数值格式错误！' });

//building模块错误
error_map.set(ApiErrorNames.NEED_UNIQUE_BUILDING_NAME, { code: 90001, message: '办公楼名称重复！' });
error_map.set(ApiErrorNames.MAX_AND_MIN, { code: 90002, message: '最大楼层数不能小于最小楼层数！'});
error_map.set(ApiErrorNames.BUILDING_NOT_NULL, { code: 90003, message: '必填的输入值不能为空！'});
error_map.set(ApiErrorNames.BUILDING_NOT_EXIST, { code: 90004, message: '办公楼信息不存在！'});
//group模块
error_map.set(ApiErrorNames.NEED_UNIQUE_GROUP_NAME, { code: 91001, message: '组织名称名称重复！' });
error_map.set(ApiErrorNames.GROUP_NOT_NULL, { code: 91003, message: '必填的输入值不能为空！'});
error_map.set(ApiErrorNames.GROUP_NOT_EXIST, { code: 91004, message: '组织信息不存在！'});
//corporation模块错误
error_map.set(ApiErrorNames.CORPORATION_NOT_NULL, { code: 92001, message: '必填的输入值不能为空！'});
error_map.set(ApiErrorNames.NEED_UNIQUE_CORPORATION_NAME, { code: 92002, message: '公司名称名称重复！' });
error_map.set(ApiErrorNames.CORPORATION_NOT_EXIST, { code: 92003, message: '公司信息不存在！'});

//corpBuilding模块错误
error_map.set(ApiErrorNames.CORPBUILDING_NOT_NULL, { code: 93001, message: '必填的输入值不能为空！'});
error_map.set(ApiErrorNames.NEED_UNIQUE_CORP_BUILDING, { code: 93002, message: '公司所处楼层的信息重复！' });
error_map.set(ApiErrorNames.CORP_BUILDING_NOT_EXIST, { code: 93003, message: '公司所处楼层的信息不存在！'});

//worker模块错误
error_map.set(ApiErrorNames.WORKER_EXIST, { code: 94002, message: '工程师信息已存在！'});
error_map.set(ApiErrorNames.WORKER_NOT_EXIST, { code: 94001, message: '该条工程师信息不存在！'});


//根据错误名称获取错误信息
ApiErrorNames.getErrorInfo = (error_name) => {

    var error_info;

    if (error_name) {
        error_info = error_map.get(error_name);
    }

    //如果没有对应的错误信息，默认'未知错误'
    if (!error_info) {
        error_name = UNKNOW_ERROR;
        error_info = error_map.get(error_name);
    }

    return error_info;
}

module.exports = ApiErrorNames;