const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const Sequelize = require('sequelize');
const auth=require('./authInRole')

exports.authCreate=async(ctx,next)=>{
    await auth.checkAuth(ctx.query.token,'function','add')
    let functionId=ctx.request.body.funcId;
    let operateId=ctx.request.body.opId;

    let FunctionModel=model.functions;
    let OperateModel=model.operates;

    let FunctionResult=await FunctionModel.findOne({
        where:{
            status:1,
            id:functionId
        }
    })
    if(FunctionResult){

    }
    else{
        throw new ApiError(ApiErrorNames.FUNCTION_NOT_EXIST)
    }

    let OperateResult=await OperateModel.findOne({
        where:{
            status:1,
            id:operateId
        }
    })
    if(OperateResult){

    }
    else{
        throw new ApiError(ApiErrorNames.OPERATE_NOT_EXIST)
    }

    let OpInFuncModel=model.opInFuncs;

    let opInFuncResult=await OpInFuncModel.findOne({
        where:{
            funcId:functionId,
            opId:operateId
        }
    });

    if(opInFuncResult){
        throw new ApiError(ApiErrorNames.OP_IN_FUNC_HAS_EXIST);
    }

    let createOBj=await OpInFuncModel.create({
        funcId:functionId,
        opId:operateId
    })

    ctx.body={
        status:0,
        data:createOBj,
        message:response_config.createdSuccess
    }

}

exports.authDelete=async(ctx,next)=>{
    await auth.checkAuth(ctx.query.token,'function','delete')
    let functionId=ctx.request.body.funcId;
    let operateId=ctx.request.body.opId;

    let FunctionModel=model.functions;
    let OperateModel=model.operates;

    let FunctionResult=await FunctionModel.findOne({
        where:{
            status:1,
            id:functionId
        }
    })
    if(FunctionResult){

    }
    else{
        throw new ApiError(ApiErrorNames.FUNCTION_NOT_EXIST)
    }

    let OperateResult=await OperateModel.findOne({
        where:{
            status:1,
            id:operateId
        }
    })
    if(OperateResult){

    }
    else{
        throw new ApiError(ApiErrorNames.OPERATE_NOT_EXIST)
    }

    let OpInFuncModel=model.opInFuncs;


    let opInFuncResult=await OpInFuncModel.findOne({
        where:{
            funcId:functionId,
            opId:operateId
        }
    });

    if(opInFuncResult){
        let id=opInFuncResult.id;
        //检查这个权限名是否被使用过
        let AuthInRoleModel=model.authInRoles;
        let RoleModel=model.roles;
        AuthInRoleModel.belongsTo(RoleModel,{foreignKey:'roleId'});

        let authInRoleObj=await AuthInRoleModel.findOne({
            where:{
                authId:id
            },
            include:[
                {
                    model:RoleModel
                }
            ]
        });

        if(authInRoleObj){
            //被使用过
            console.log('哈哈哈'+JSON.stringify(authInRoleObj));
            throw new ApiError(ApiErrorNames.OP_IN_FUNC_HAS_USED,[authInRoleObj.role.name]);
        }
        else{
            //可以删除了
            let deleteObj=await opInFuncResult.destroy()
            ctx.body={
                status:0,
                data:deleteObj,
                message:response_config.deleteSuccess
            }
        }


    }
    else{
        throw new ApiError(ApiErrorNames.OP_IN_FUNC_NOT_EXIST);
    }
}