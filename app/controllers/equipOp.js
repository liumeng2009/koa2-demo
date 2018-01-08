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
    let name=ctx.request.body.name;
    let code=ctx.request.body.code;

    let EquipOp=model.equipOps;

    if(name!=''&code!=''){

    }
    else{
        throw new ApiError(ApiErrorNames.EQUIP_OP_FIELD_NOT_NULL);
    }

    console.log('name:'+name);
    let EquipTypeCheckName=await EquipOp.findAll({
        where:{
            name:name
        }
    })

    if(EquipTypeCheckName.length>0){
        throw new ApiError(ApiErrorNames.EQUIP_OP_NAME_EXIST);
    }

    let EquipTypeCheckCode=await EquipOp.findAll({
        where:{
            code:code
        }
    })

    if(EquipTypeCheckCode.length>0){
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