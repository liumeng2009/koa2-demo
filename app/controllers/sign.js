const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const auth=require('./authInRole');
var QRCode = require('qrcode');
const uuid = require('node-uuid');
const WsUtil=require('../../util/ws');

var saveSigns=async function(ids,sign){
    let SignModel=model.signs;
    let Operation=model.operations;
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
        return saveResult;


    }
    else{
        throw new ApiError(ApiErrorNames.INPUT_FIELD_ERROR,['operationId数组'])
    }
}

exports.saveSign=async(ctx,next)=>{
    await auth.checkAuth(ctx.request.headers.authorization,'op','edit');
    let ids=ctx.request.body.ids;
    let sign=ctx.request.body.sign;
    let result=await saveSigns(ids,sign);
    ctx.body={
        status:0,
        message:response_config.saveSuccess,
        data:result
    }
}

exports.clientSaveSign=async(ctx,next)=>{
    let ids=ctx.request.body.ids;
    let sign=ctx.request.body.sign;
    let signid=ctx.request.body.signid;
    let ClientSignModel=model.clientSigns;
    let clientSignResult=await ClientSignModel.findOne({
        where:{
            signId:signid
        }
    })

    if(clientSignResult){
        if(clientSignResult.status==0){
            throw new ApiError(ApiErrorNames.SIGN_ID_ERROR)
        }
        //正常
        else if(clientSignResult.status==1){
            let date=new Date();
            let stamp=date.getTime();
            if(stamp>clientSignResult.start+clientSignResult.clientSeconds*1000){
                throw new ApiError(ApiErrorNames.SIGN_OUT_OF_TIME);
            }
            else{
                //正常，可以保存签名信息
                let result=await saveSigns(ids,sign)
                //成功后
                //socket告诉客户端保存成功了
                let json={signId:signid,action:'sign complete',ids:ids};
                WsUtil.send(JSON.stringify(json))

                //修改clientSign表
                clientSignResult.status=2;
                clientSignResult.signString=sign;
                let ops='';
                if(result instanceof Array){
                    for(let op of result){
                        ops=ops+op.operationId+','
                    }
                }
                clientSignResult.ops=ops;


                await clientSignResult.save();
                ctx.body={
                    status:0,
                    message:response_config.saveSuccess,
                    data:result
                }
            }
        }
        else if(clientSignResult.status==2){
            throw new ApiError(ApiErrorNames.SIGN_COMPLETE)
        }

    }
    else{
        throw new ApiError(ApiErrorNames.SIGN_ID_ERROR)
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

    if(signResult){
        ctx.body={
            status:0,
            data:signResult.signString
        }
    }
    else{
        ctx.body={
            status:0,
            data:''
        }
    }


}

exports.getQRCode=async(ctx,next)=>{
    await auth.checkAuth(ctx.request.headers.authorization,'op','edit');
    let ids=ctx.request.body.ids;
    let signid=uuid.v4();
    //生成signId，将他存入表 signid有三个状态，没有被使用 被使用 结束使用
    let ClientSignModel=model.clientSigns;
    let result=await ClientSignModel.create({
        signId:signid,
        start:null,
        status:0,
        clientSeconds:null
    })

    if(result){
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
            data:{signid:signid,qr:result}
        }
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
    let signId=ctx.request.body.signid;
    let ClientSignModel=model.clientSigns;

    let result=await ClientSignModel.findOne({
        where:{
            signId:signId
        },
        order:[
            ['createdAt','desc']
        ]
    })

    if(result){
        if(result.status==0){
            //说明还没用，需要初始化
            result.status=1;
            let date=new Date();
            let start=date.getTime();
            result.start=start;
            result.clientSeconds=sys_config.clientSeconds;
            let updateResult=await result.save();
            ctx.body={
                status:0,
                data:updateResult
            }
        }
        else{
            ctx.body={
                status:0,
                data:result
            }
        }
    }
    else{
        throw new ApiError(ApiErrorNames.SIGN_ID_ERROR)
    }
}