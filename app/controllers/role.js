const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const auth=require('./authInRole');

exports.list=async(ctx,next)=>{
    let Role=model.roles;
    let result=await Role.findAll({
        where:{
            status:1
        },
        order:['createdAt']
    });
    ctx.body={
        status:0,
        data:result
    }
}

exports.add=async(ctx,next)=>{
    await auth.checkAuth(ctx.query.token,'role','add')
    let Role=model.roles;
    let result=await Role.create({
        name:ctx.request.body.name,
        remark:ctx.request.body.remark,
        status:1
    })
    ctx.body={
        status:0,
        data:result,
        message:response_config.createdSuccess
    }
}

exports.edit=async(ctx,next)=>{
    await auth.checkAuth(ctx.query.token,'role','edit')
    let id=ctx.request.body.id;
    let name=ctx.request.body.name;
    let remark=ctx.request.body.remark;
    if(name&&name!=''){

    }
    else{
        throw new ApiError(ApiErrorNames.INPUT_FIELD_NULL,['角色名称']);
    }
    let Role=model.roles;
    let result=await Role.findOne({
        id:id,
        status:1
    })


    //如果是系统管理员角色，不可以修改




    if(result){
        if(result.name=='系统管理员'){
            result.remark=remark;
        }
        else{
            result.name=name;
            result.remark=remark;
        }

    }
    else{
        throw new ApiError(ApiErrorNames.ROLE_NOT_EXIST);
    }

    let editResult=await result.save()

    ctx.body={
        status:0,
        data:editResult,
        message:response_config.updatedSuccess
    }
}

exports.delete=async(ctx,next)=>{
    await auth.checkAuth(ctx.query.token,'role','delete')
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

    let User=model.user;
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

exports.get=async(ctx,next)=>{
    let id=ctx.params.id;
    let Role=model.roles;

    let result=await Role.findOne({
        where:{
            status:1,
            id:id
        }
    })
    if(result){

    }
    else{
        throw new ApiError(ApiErrorNames.ROLE_NOT_EXIST)
    }

    ctx.body={
        status:0,
        data:result
    }
}