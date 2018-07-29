const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const auth=require('./authInRole');
var QRCode = require('qrcode');
const uuid = require('node-uuid');

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
            message:response_config.saveSuccess,
            data:saveResult
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
        data:signResult.signString
    }
}

exports.getQRCode=async(ctx,next)=>{
    await auth.checkAuth(ctx.request.headers.authorization,'op','edit');
    let ids=ctx.request.body.ids;
    let signid=uuid.v4();
    //url?ids=***,***,***
    let url=sys_config.clientUrl+'#/sign/'
    url=url+signid+'/';
    if(ids instanceof Array){
        for(let id of ids){
            url=url+id+','
        }
    }

    console.log(url);

    let result=await generateQR(url)
    ctx.body={
        status:0,
        data:result
    }
}

const generateQR = async text => {
    try {
        return await QRCode.toDataURL(text)
    } catch (err) {
        console.error(err)
    }
}

//客户端用自己的设备信息，操作系统信息换取userid
exports.clientSign=async(ctx,next)=>{
    let signId=ctx.request.body.signId;
    let date=new Date();
    let start=date.getTime();
    let ClientSignModel=model.clientSigns;
    let ip=ctx.request.ip;
    let seconds=sys_config.clientSeconds

    let createResult=await ClientSignModel.create({
        signId:signId,
        start:start,
        status:1,
        clientIp:ip,
        clientSeconds:seconds
    })

    ctx.body={
        status:0,
        data:createResult
    }

}

exports.getClientSign=async(ctx,next)=>{
    let userid=ctx.query.userid;

    let ClientSignModel=model.clientSigns;

    let result=await ClientSignModel.findOne({
        where:{
            userId:userid
        }
    })
}