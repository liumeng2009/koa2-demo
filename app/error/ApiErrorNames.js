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
ApiErrorNames.USER_NAME_NOT_EXIST='userNameNotExist';
ApiErrorNames.ADMIN_CAN_NOT_DELETE='adminCanNotDelete';

ApiErrorNames.INPUT_ERROR_TYPE='inputErrorType';
ApiErrorNames.INPUT_DATE_ERROR_TYPE='inputDateErrorType';
ApiErrorNames.INPUT_FIELD_NULL="inputFieldNull";
ApiErrorNames.INPUT_FIELD_ERROR="inputFieldError";

ApiErrorNames.NEED_UNIQUE_BUILDING_NAME="needUniqueBuildingName";
ApiErrorNames.MAX_AND_MIN="maxAndMin";
ApiErrorNames.BUILDING_NOT_NULL="buildingNotNull";
ApiErrorNames.BUILDING_NOT_EXIST="buildingNotExist";
ApiErrorNames.BUILDING_CAN_NOT_DELETE="buildingCanNotDelete";

ApiErrorNames.NEED_UNIQUE_GROUP_NAME="needUniqueGroupName";
ApiErrorNames.GROUP_NOT_NULL="groupNotNull";
ApiErrorNames.GROUP_NOT_EXIST="groupNotExist";
ApiErrorNames.GROUP_CAN_NOT_DELETE="groupCanNotDelete";

ApiErrorNames.CORPORATION_NOT_NULL="corporationNotNull";
ApiErrorNames.NEED_UNIQUE_CORPORATION_NAME="needUniqueCorporationName";
ApiErrorNames.CORPORATION_NOT_EXIST="CorporationNotExist";
ApiErrorNames.CORPORATION_CAN_NOT_DELETE="CorporationCanNotDelete";

ApiErrorNames.CORPBUILDING_NOT_NULL="corpBuildingNotNull";
ApiErrorNames.NEED_UNIQUE_CORP_BUILDING="needUniqueCorpBuilding";
ApiErrorNames.CORP_BUILDING_NOT_EXIST="cropBuildingNotExist";
ApiErrorNames.CORP_BUILDING_CAN_NOT_DELETE="cropBuildingCanNotDelete";

ApiErrorNames.WORKER_NOT_EXIST="workerNotExist";
ApiErrorNames.WORKER_EXIST="workerExist";
ApiErrorNames.WORKER_BUSY="workerBusy";
ApiErrorNames.WORKER_BUSY_1="workerBusy1";
ApiErrorNames.WORKER_BUSY_ARRAY="workerBusyArray";

ApiErrorNames.BUSINESS_OPERATION_NULL="businessOperationNull";
ApiErrorNames.BUSINESS_EQUIPMENT_NULL="businessEquipmentNull";
ApiErrorNames.BUSINESS_EQUIPMENT_EXIST="businessEquipmentExist";
ApiErrorNames.BUSINESS_NOT_EXIST="businessNotExist";
ApiErrorNames.BUSINESS_USED="businessUsed";
ApiErrorNames.EQUIP_TPYE_FIELD_NOT_NULL="equipTypeFieldNotNull";
ApiErrorNames.EQUIP_TPYE_NAME_EXIST="equipTypeNameExist";
ApiErrorNames.EQUIP_TPYE_CODE_EXIST="equipTypeCodeExist";
ApiErrorNames.EQUIP_TPYE_NULL="equipTypeNull";
ApiErrorNames.EQUIP_OP_FIELD_NOT_NULL="equipOpFieldNotNull";
ApiErrorNames.EQUIP_OP_NAME_EXIST="equipOpNameExist";
ApiErrorNames.EQUIP_OP_CODE_EXIST="equipOpCodeExist";
ApiErrorNames.EQUIP_OP_NULL="equipOpNull";

ApiErrorNames.ORDER_ATTRIBUTE_NOT_NULL="orderAttributeNotNull";
ApiErrorNames.ORDER_NOT_EXIST="orderNotExist";
ApiErrorNames.ORDER_HAVE_OPERATION="orderHaveOperation";
ApiErrorNames.ORDER_SAVE_FAILED="orderSaveFailed";

ApiErrorNames.OPERATION_NOT_EXIST="operationNotExist";
ApiErrorNames.OPERATION_CALL_MORE_THAN_CREATE="operationCallMoreThanCreate";
ApiErrorNames.OPERATION_ARRIVE_MORE_THAN_CALL="operationArriveMoreThanCall";
ApiErrorNames.OPERATION_FINISH_MORE_THAN_ARRIVE="operationFinishMoreThanArrive";
ApiErrorNames.OPERATION_COMPLETE_MUST_UNIQUE="operationCompleteMustUnique";
ApiErrorNames.FINISHTIME_MORE_THAN_AN_ARRIVETIME="finishTimeMoreThanAnArriveTime";
ApiErrorNames.ACTIONS_MUST_ALL_COMPLETE="actionsMustAllComplete";
ApiErrorNames.ACTIONS_NOT_EXIST="actionsNotExist";
ApiErrorNames.OPERATION_COMPLETE_TIME_MUST_LAST="operationCompleteTimeMustLast";
ApiErrorNames.ACTION_CALL_LESS_THAN_COMPLETE="actionCallLessThanComplete";
ApiErrorNames.ACTION_START_LESS_THAN_COMPLETE="actionStartLessThanComplete";
ApiErrorNames.ACTION_END_LESS_THAN_COMPLETE="actionEndLessThanComplete";
ApiErrorNames.OPERATION_CAN_NOT_EDIT="operationCanNotEdit";
ApiErrorNames.OPERATION_CAN_NOT_DELETE="operationCanNotDelete";

ApiErrorNames.ROLE_NOT_EXIST="roleNotExist";
ApiErrorNames.ROLE_CAN_NOT_DELETE="roleCanNotDelete";
ApiErrorNames.ROLE_HAS_THE_AUTH="roleHasTheRole";
ApiErrorNames.AUTH_NOT_EXIST="authNotExist";
ApiErrorNames.AUTH_ADMIN_NOT_DELETE="authAdminNotDelete";
ApiErrorNames.USER_CAN_NOT_DELETE="userCanNotDelete";
ApiErrorNames.FUNCTION_NOT_EXIST="functionNotExist";
ApiErrorNames.FUNCTION_NAME_EXIST="functionNameExist";
ApiErrorNames.FUNCTION_CODE_EXIST="functionCodeExist";
ApiErrorNames.OPERATE_NOT_EXIST="operateNotExist";
ApiErrorNames.OP_IN_FUNC_HAS_EXIST="opInFuncHasExist";
ApiErrorNames.OP_IN_FUNC_NOT_EXIST="opInFuncNotExist";
ApiErrorNames.OP_IN_FUNC_HAS_USED="opInFuncHasUsed";
ApiErrorNames.NO_AUTH="noAuth";

ApiErrorNames.SIGN_USED="signUsed";
ApiErrorNames.SIGN_OUT_OF_TIME="signOutOfTime";

ApiErrorNames.UPLOAD_ERROR="uploadError";
ApiErrorNames.FILE_SYSTEM_ERROR="fileSystemError";

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
error_map.set(ApiErrorNames.USER_NAME_NOT_EXIST, { code: 10006, message: '用户名不存在！' });
error_map.set(ApiErrorNames.ADMIN_CAN_NOT_DELETE, { code: 10007, message: '最高管理员账户不能被删除！' });
error_map.set(ApiErrorNames.USER_CAN_NOT_DELETE, { code: 10008, message: '该账户处理过工单，所以不能被删除！' });

error_map.set(ApiErrorNames.INPUT_ERROR_TYPE, { code: 20001, message: '输入数值格式错误！' });
error_map.set(ApiErrorNames.INPUT_DATE_ERROR_TYPE, { code: 20002, message: '输入日期格式错误！' });
error_map.set(ApiErrorNames.INPUT_FIELD_NULL, { code: 20003, message: '输入项{1}为空！' });
error_map.set(ApiErrorNames.INPUT_FIELD_ERROR, { code: 20004, message: '输入项{1}错误！' });

//building模块错误
error_map.set(ApiErrorNames.NEED_UNIQUE_BUILDING_NAME, { code: 90001, message: '办公楼名称重复！' });
error_map.set(ApiErrorNames.MAX_AND_MIN, { code: 90002, message: '最大楼层数不能小于最小楼层数！'});
error_map.set(ApiErrorNames.BUILDING_NOT_NULL, { code: 90003, message: '必填的输入值不能为空！'});
error_map.set(ApiErrorNames.BUILDING_NOT_EXIST, { code: 90004, message: '办公楼信息不存在！'});
error_map.set(ApiErrorNames.BUILDING_CAN_NOT_DELETE, { code: 90005, message: '办公楼信息被 {1} 使用了，所以不可以删除！'});
//group模块
error_map.set(ApiErrorNames.NEED_UNIQUE_GROUP_NAME, { code: 91001, message: '组织名称名称重复！' });
error_map.set(ApiErrorNames.GROUP_NOT_NULL, { code: 91003, message: '必填的输入值不能为空！'});
error_map.set(ApiErrorNames.GROUP_NOT_EXIST, { code: 91004, message: '组织信息不存在！'});
error_map.set(ApiErrorNames.GROUP_CAN_NOT_DELETE, { code: 91005, message: '组织信息被 {1} 占用了，所以不可以删除！'});
//corporation模块错误
error_map.set(ApiErrorNames.CORPORATION_NOT_NULL, { code: 92001, message: '必填的输入值不能为空！'});
error_map.set(ApiErrorNames.NEED_UNIQUE_CORPORATION_NAME, { code: 92002, message: '公司名称名称重复！' });
error_map.set(ApiErrorNames.CORPORATION_NOT_EXIST, { code: 92003, message: '公司信息不存在！'});
error_map.set(ApiErrorNames.CORPORATION_CAN_NOT_DELETE, { code: 92004, message: '公司信息被使用过，不可以删除！'});

//corpBuilding模块错误
error_map.set(ApiErrorNames.CORPBUILDING_NOT_NULL, { code: 93001, message: '必填的输入值不能为空！'});
error_map.set(ApiErrorNames.NEED_UNIQUE_CORP_BUILDING, { code: 93002, message: '公司所处楼层的信息重复！' });
error_map.set(ApiErrorNames.CORP_BUILDING_NOT_EXIST, { code: 93003, message: '公司所处楼层的信息不存在！'});
error_map.set(ApiErrorNames.CORP_BUILDING_CAN_NOT_DELETE, { code: 93004, message: '楼层信息被使用了，所以不能删除'});

//worker模块错误
error_map.set(ApiErrorNames.WORKER_EXIST, { code: 80002, message: '工程师信息已存在！'});
error_map.set(ApiErrorNames.WORKER_NOT_EXIST, { code: 80001, message: '该条工程师信息不存在！'});
error_map.set(ApiErrorNames.WORKER_BUSY, { code: 80003, message: '工程师：{1} 很忙！'});
error_map.set(ApiErrorNames.WORKER_BUSY_1, { code: 80004, message: '该工程师很忙！'});
error_map.set(ApiErrorNames.WORKER_BUSY_ARRAY, { code: 80005, message: '批量录入的工作时间信息有冲突！'});

//业务内容模块错误
error_map.set(ApiErrorNames.BUSINESS_OPERATION_NULL, { code: 70001, message: '操作项不能为空！'})
error_map.set(ApiErrorNames.BUSINESS_EQUIPMENT_NULL, { code: 70002, message: '设备不能为空！'})
error_map.set(ApiErrorNames.BUSINESS_NOT_EXIST, { code: 70003, message: '业务内容不存在！'})
error_map.set(ApiErrorNames.BUSINESS_EQUIPMENT_EXIST,{ code: 70004, message: '设备已经存在！'});
error_map.set(ApiErrorNames.BUSINESS_USED,{ code: 70005, message: '该业务被使用了，所以不可以删除！'});
//设备类型
error_map.set(ApiErrorNames.EQUIP_TPYE_FIELD_NOT_NULL,{code:71001,message:'设备类型的输入值不能为空'});
error_map.set(ApiErrorNames.EQUIP_TPYE_NAME_EXIST,{code:71002,message:'设备类型名称已存在'});
error_map.set(ApiErrorNames.EQUIP_TPYE_CODE_EXIST,{code:71003,message:'设备类型代码已存在'});
error_map.set(ApiErrorNames.EQUIP_TPYE_NULL,{code:71004,message:'设备类型不存在'});
//设备操作
error_map.set(ApiErrorNames.EQUIP_OP_FIELD_NOT_NULL,{code:72001,message:'故障名的输入值不能为空'});
error_map.set(ApiErrorNames.EQUIP_OP_NAME_EXIST,{code:72002,message:'故障名称已存在'});
error_map.set(ApiErrorNames.EQUIP_OP_CODE_EXIST,{code:72003,message:'故障代码已存在'});
error_map.set(ApiErrorNames.EQUIP_OP_NULL,{code:72004,message:'故障名不存在'});



//需求
error_map.set(ApiErrorNames.ORDER_ATTRIBUTE_NOT_NULL, { code: 60001, message: '必填的输入值不能为空！'});
error_map.set(ApiErrorNames.ORDER_NOT_EXIST, { code: 60002, message: '客户订单信息不存在！'});
error_map.set(ApiErrorNames.ORDER_HAVE_OPERATION, { code: 60003, message: '订单内还有工单存在，所以不可以删除！'});
error_map.set(ApiErrorNames.ORDER_SAVE_FAILED, { code: 60004, message: '订单保存失败！原因：{1}'});

//工单
error_map.set(ApiErrorNames.OPERATION_NOT_EXIST, { code: 50001, message: '工单信息不存在！'});
error_map.set(ApiErrorNames.OPERATION_CALL_MORE_THAN_CREATE, { code: 50002, message: '指派工程师的时间应该大于工单的建立时间！'});
error_map.set(ApiErrorNames.OPERATION_ARRIVE_MORE_THAN_CALL, { code: 50003, message: '工程师开始工作时间应该大于工程师被指派的时间！'});
error_map.set(ApiErrorNames.OPERATION_FINISH_MORE_THAN_ARRIVE, { code: 50004, message: '工程师完成工作的时间应该大于工程师开始工作的时间！'});
error_map.set(ApiErrorNames.OPERATION_COMPLETE_MUST_UNIQUE,{code:50005,message:'工单完成的时刻，只能由一个工程师来标记！'});
error_map.set(ApiErrorNames.FINISHTIME_MORE_THAN_AN_ARRIVETIME,{code:50006,message:'完成时间不能小于已存在进程的到达时间！'});
error_map.set(ApiErrorNames.ACTIONS_MUST_ALL_COMPLETE,{code:50007,message:'有其他的工作进程没有完成，所以还不能完成这个工单！'});
error_map.set(ApiErrorNames.ACTIONS_NOT_EXIST,{code:50008,message:'此工作进程不存在！'});
error_map.set(ApiErrorNames.OPERATION_COMPLETE_TIME_MUST_LAST,{code:50009,message:'工单完成的时刻必须是最晚的一个工作完成时刻！'});
error_map.set(ApiErrorNames.ACTION_CALL_LESS_THAN_COMPLETE, { code: 50010, message: '指派工程师的时间应该小于工单的完成时间！'});
error_map.set(ApiErrorNames.ACTION_START_LESS_THAN_COMPLETE, { code: 50011, message: '工作开始时间应该小于工单的完成时间！'});
error_map.set(ApiErrorNames.ACTION_END_LESS_THAN_COMPLETE, { code: 50012, message: '工作完成时间应该小于等于工单的完成时间！'});
error_map.set(ApiErrorNames.OPERATION_CAN_NOT_EDIT, { code: 50013, message: '工程师已经进行处理了，所以工单信息不能进行修改！'});
error_map.set(ApiErrorNames.OPERATION_CAN_NOT_DELETE, { code: 50014, message: '工程师已经进行处理了，所以工单信息不能进行删除！'});

//角色
error_map.set(ApiErrorNames.ROLE_NOT_EXIST, { code: 40000, message: '角色信息不存在！'});
error_map.set(ApiErrorNames.ROLE_CAN_NOT_DELETE, { code: 40001, message: '有用户属于该角色，所以不可以删除！'});
error_map.set(ApiErrorNames.ROLE_HAS_THE_AUTH, { code: 40002, message: '角色已经有{1}权限了，不能重复添加！'});
error_map.set(ApiErrorNames.AUTH_NOT_EXIST, { code: 40003, message: '功能项不存在！'});
error_map.set(ApiErrorNames.AUTH_ADMIN_NOT_DELETE, { code: 40004, message: '系统管理员的权限无法删除！'});
error_map.set(ApiErrorNames.FUNCTION_NOT_EXIST, { code: 40005, message: '功能名称不存在！'});
error_map.set(ApiErrorNames.FUNCTION_NAME_EXIST, { code: 40011, message: '功能名称已存在！'});
error_map.set(ApiErrorNames.FUNCTION_CODE_EXIST, { code: 40012, message: '功能代码已存在！'});
error_map.set(ApiErrorNames.OPERATE_NOT_EXIST, { code: 40006, message: '功能操作不存在！'});
error_map.set(ApiErrorNames.OP_IN_FUNC_HAS_EXIST, { code: 40007, message: '功能项已经存在，不可以重复添加！'});
error_map.set(ApiErrorNames.OP_IN_FUNC_NOT_EXIST, { code: 40008, message: '功能项不存在！'});
error_map.set(ApiErrorNames.OP_IN_FUNC_HAS_USED, { code: 40009, message: '功能项已经被 {1} 使用，无法删除！'});
error_map.set(ApiErrorNames.NO_AUTH, { code: 40010, message: '没有访问权限！'});

error_map.set(ApiErrorNames.SIGN_USED, { code: 30001, message: '签名ID已经被使用，您可以再次扫码进行尝试！'});
error_map.set(ApiErrorNames.SIGN_OUT_OF_TIME, { code: 30002, message: '签名ID已经超时，您可以再次扫码进行尝试！'});

error_map.set(ApiErrorNames.UPLOAD_ERROR, { code: 10010, message: '文件上传出错！'});
error_map.set(ApiErrorNames.FILE_SYSTEM_ERROR, { code: 10011, message: '文件系统操作出错！'});


//根据错误名称获取错误信息
ApiErrorNames.getErrorInfo = (error_name) => {

    var error_info;

    var UNKNOW_ERROR='未知错误'

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