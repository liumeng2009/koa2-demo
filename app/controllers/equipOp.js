/**
 * Created by liumeng on 2017/9/13.
 */
/**
 * Created by liumeng on 2017/7/7.
 */
const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const auth=require('./authInRole');

exports.list=async(ctx,next)=>{
    let EquipOp = model.equipOps;
    let groupObj =await EquipOp.findAll({
        order:[
            ['updatedAt','DESC']
        ]
    });
    ctx.body={
        status:0,
        data:groupObj
    }
}

exports.save=async(ctx,next)=>{
    await auth.checkAuth(ctx.request.headers.authorization,'business','edit')
    let name=ctx.request.body.name;
    let code=ctx.request.body.code;

    let EquipOp=model.equipOps;

    if(name!=''&code!=''){

    }
    else{
        throw new ApiError(ApiErrorNames.EQUIP_OP_FIELD_NOT_NULL);
    }

    console.log('name:'+name);
    let EquipTypeCheckName=await EquipOp.findOne({
        where:{
            name:name
        }
    })

    if(EquipTypeCheckName){
        throw new ApiError(ApiErrorNames.EQUIP_OP_NAME_EXIST);
    }

    let EquipTypeCheckCode=await EquipOp.findOne({
        where:{
            code:code
        }
    })

    if(EquipTypeCheckCode){
        throw new ApiError(ApiErrorNames.EQUIP_OP_CODE_EXIST);
    }

    let createResult=await EquipOp.create({
        name:name,
        code:code
    });
    console.log('created'+JSON.stringify(createResult));
    ctx.body={
        status:0,
        data:createResult,
        message:response_config.createdSuccess
    }

}

exports.delete=async(ctx,next)=>{
    await auth.checkAuth(ctx.request.headers.authorization,'business','edit')
    let id=ctx.params.id;
    let EquipOp=model.equipOps;
    let equipOpObj=await EquipOp.findOne({
        where:{
            id:id
        }
    })
    if(equipOpObj){
        let deleteResult=await equipOpObj.destroy();
        ctx.body={
            status:0,
            data:deleteResult,
            message:response_config.deleteSucess
        }
    }
    else{
        throw new ApiError(ApiErrorNames.EQUIP_OP_NULL);
    }
}