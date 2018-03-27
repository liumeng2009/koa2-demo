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
    let EquipType = model.equipTypes;
    let groupObj =await EquipType.findAll({
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
    await auth.checkAuth(ctx.query.token,'business','edit')
    let name=ctx.request.body.name;
    let code=ctx.request.body.code;

    let EquipType=model.equipTypes;

    if(name!=''&code!=''){

    }
    else{
        throw new ApiError(ApiErrorNames.EQUIP_TPYE_FIELD_NOT_NULL);
    }


    let EquipTypeCheckName=await EquipType.findAll({
        where:{
            name:name
        }
    })

    if(EquipTypeCheckName.length>0){
        throw new ApiError(ApiErrorNames.EQUIP_TPYE_NAME_EXIST);
    }

    let EquipTypeCheckCode=await EquipType.findAll({
        where:{
            code:code
        }
    })

    if(EquipTypeCheckCode.length>0){
        throw new ApiError(ApiErrorNames.EQUIP_TPYE_CODE_EXIST);
    }

    let createResult=await EquipType.create({
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
    await auth.checkAuth(ctx.query.token,'business','edit')
    let id=ctx.params.id;
    let EquipType=model.equipTypes;
    let equipTypeObj=await EquipType.findOne({
        where:{
            id:id
        }
    })
    if(equipTypeObj){
        let deleteResult=await equipTypeObj.destroy();
        ctx.body={
            status:0,
            data:deleteResult,
            message:response_config.deleteSucess
        }
    }
    else{
        throw new ApiError(ApiErrorNames.EQUIP_TPYE_NULL);
    }
}