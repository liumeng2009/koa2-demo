const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');

exports.list=async(ctx,next)=>{
    let Role=model.roles;
    let result=await Role.findAll({
        where:{
            status:1
        }
    });
    ctx.body={
        status:0,
        data:result
    }
}

exports.add=async(ctx,next)=>{
    let Role=model.roles;
    let result=await Role.create({
        name:ctx.body.name,
        remark:ctx.body.remark,
        status:ctx.body.status
    })
    ctx.body={
        status:0,
        data:result,
        message:response_config.createdSuccess
    }
}

exports.delete=async(ctx,next)=>{
    let Role=model.roles;
    let roleId=ctx.params.id;
    let result=await Role.findOne({
        where:{
            status:1,
            id:roleId
        }
    });
    if(result){

    }
    else{
        throw new ApiError(ApiErrorNames.ROLE_NOT_EXIST);
    }

    let User=model.users;
    let UserResult=await User.findOne({
        where:{
            status:1,
            roleId:roleId
        }
    })

    if(UserResult){
        throw new ApiError(ApiErrorNames.ROLE_CAN_NOT_DELETE);
    }

    result.status=0;
    let saveResult=await result.save();
    ctx.body={
        status:0,
        data:saveResult,
        message:response_config.deleteSuccess
    }
}