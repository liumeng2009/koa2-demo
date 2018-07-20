const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const auth=require('./authInRole');

exports.saveSign=async(ctx,next)=>{
    await auth.checkAuth(ctx.request.headers.authorization,'op','edit');
    let ids=ctx.request.body.ids;
    let sign=ctx.request.body.sign;

    let Operation=model.operations;
    let SignModel=model.signs;

    let saveIdArray=[];
    if(ids instanceof Array&&ids.length>0){
        for(let id of ids){
            let operationObj=await Operation.findOne({
                where:{
                    status:{
                        $ne:0
                    },
                    id:id
                }
            })
            if(operationObj){
                saveIdArray.push({signString:sign,operationId:operationObj.id});
            }
        }

        //存sign表
        let saveResult=await SignModel.bulkCreate(saveIdArray,{validate:true,returning:true,individualHooks:true});
        ctx.body={
            status:0,
            message:response_config.createdSuccess
        }

    }
    else{
        throw new ApiError(ApiErrorNames.INPUT_FIELD_ERROR,['operationId数组'])
    }
}


exports.getSign=async(ctx,next)=>{
    let id=ctx.params.id;
    let SignModel=model.signs;

    let signResult=await SignModel.findOne({
        attr:['signString'],
        where:{
            operationId:id
        },
        order:[
            ['createdAt','DESC']
        ]
    })

    ctx.body={
        status:0,
        data:signResult
    }
}