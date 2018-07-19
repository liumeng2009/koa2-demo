const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const auth=require('./authInRole');

exports.saveSign=async(ctx,next)=>{
    let signType=ctx.request.body.signtype;
    let id=ctx.request.body.id;
    let sign=ctx.request.body.sign;

    if(signType=='operation'){
        await saveOperationSign(id,sign)
    }
    else if(signType=='order'){
        await saveOrderSign(id,sign)
    }
    else{
        throw new ApiError(ApiErrorNames.INPUT_FIELD_ERROR,['单号类型'])
    }
}

var saveOperationSign=async function(operationId,signString){
    await auth.checkAuth(ctx.request.headers.authorization,'op','add');
    let Operation=model.operations;
    let SignModel=model.signs;
    let operationObj=await Operation.findOne({
        where:{
            status:{
                $ne:0
            },
            id:operationId
        }
    })
    if(operationObj){
        await SignModel.create({
            signId:operationId,
            signString:signString,
            signType:'operation'
        })
        ctx.body={
            status:0,
            message:response_config.createdSuccess
        }
    }
    else{
        throw new ApiError(ApiErrorNames.OPERATION_NOT_EXIST)
    }
}

var saveOrderSign=async function(orderId,signString){
    await auth.checkAuth(ctx.request.headers.authorization,'op','add');
    let OrderModel=model.orders;
    let Operation=model.operations;
    let SignModel=model.signs;

    let orderObj=await OrderModel.findOne({
        where:{
            status:{
                $ne:0
            },
            id:orderId
        }
    })
    if(orderObj){
        await SignModel.create({
            signId:orderId,
            signString:signString,
            signType:'order'
        })
        ctx.body={
            status:0,
            message:response_config.createdSuccess
        }
    }
    else{
        throw new ApiError(ApiErrorNames.ORDER_NOT_EXIST)
    }
}

exports.getSign=async(ctx,next)=>{
    let signType=ctx.params.signtype;
    let id=ctx.params.id;
    let SignModel=model.signs;

    if(signType=='order'){
        let signResult=await SignModel.findOne({
            attr:['signString'],
            where:{
                signType:signType,
                signId:id
            },
            order:[
                ['createdAt','DESC']
            ]
        })
        
    }
    else if(signType=='operation'){

    }

}