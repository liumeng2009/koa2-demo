const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const response_config=require('../../config/response_config');
const config = require('../../config/mysql_config');
const db=require('../db');

exports.list=async(ctx,next)=>{

    let Worker=model.workers;
    let User=model.user;

    User.belongsTo(Worker,{foreignKey:'id',targetKey:'userId'});



    //var sequelize=db.sequelize;

    let workerObj;

    //let selectStr='select users.id,users.name,users.gender,users.phone,users.email,workers.userId from users left join workers on users.id=workers.userId where users.status=1 order by users.createdAt asc';

    //workerObj=await sequelize.query(selectStr,{ plain : false,  raw : true,type:sequelize.QueryTypes.SELECT});

    workerObj=await User.findAll({
        include:[{
            model:Worker
        }],
        order:[
            ['updatedAt','DESC']
        ]
    });

    ctx.body={
        status:0,
        data:workerObj
    }
}

exports.save=async(ctx,next)=>{
    let userid=ctx.request.body.userId;
    let operationId=ctx.request.body.id;
    let workerId=ctx.request.body.worker.id;
    let callTimeStamp=ctx.request.body.call_date_timestamp;
    let showArriveDate=ctx.request.body.showArriveDate;
    let arriveTimeStamp=ctx.request.body.arrive_date_timestamp;
    let showFinishDate=ctx.request.body.showFinishDate;
    let finishTimeStamp=ctx.request.body.finish_date_timestamp;
    let completeOperation=ctx.request.body.isCompleteOperation;

    let actionId=ctx.params.actionId;

    //验证数据合理性
    let Operation=model.operations;
    let Worker=model.workers;
    let ActionModel=model.actions;

    //工单是否存在
    let operation=await Operation.findOne({
        where:{
            id:operationId,
            status:1
        }
    });

    if(operation){

    }
    else{
        throw new ApiError(ApiErrorNames.OPERATION_NOT_EXIST);
    }

    //各个时间点是否合理 建立<指派<工作开始<工作结束
    let operation_create_time_stamp=operation.create_time;
    console.log(operation_create_time_stamp);
    console.log(callTimeStamp);
    console.log(arriveTimeStamp);
    console.log(finishTimeStamp);
    if(callTimeStamp<operation_create_time_stamp){
        //指派小于工单建立 不合理
        throw new ApiError(ApiErrorNames.OPERATION_CALL_MORE_THAN_CREATE);
    }

    if(showArriveDate&&arriveTimeStamp<callTimeStamp){
        throw new ApiError(ApiErrorNames.OPERATION_ARRIVE_MORE_THAN_CALL);
    }

    if(showFinishDate&&finishTimeStamp<arriveTimeStamp){
        throw new ApiError(ApiErrorNames.OPERATION_FINISH_MORE_THAN_ARRIVE);
    }

    //验证工程师信息是否存在
    console.log(workerId);
    let workerObj=await Worker.findOne({
        where:{
            userId:workerId
        }
    })

    if(workerObj){

    }
    else{
        throw new ApiError(ApiErrorNames.WORKER_NOT_EXIST);
    }


    //验证工程师现在的状态，如果工程师在工作中，就不能开始另一项工作了
    if(showArriveDate){
        let actionObj=await ActionModel.findOne({
            where:{
                '$and':[
                    {worker:workerId},
                    {'$or':[
                        {
                            '$and':[
                                {
                                    start_time:{'$lt':arriveTimeStamp}
                                },
                                {
                                    end_time:{'$gt':arriveTimeStamp}
                                }
                            ]
                        },
                        {
                            '$and':[
                                {
                                    start_time:{'$lt':arriveTimeStamp}
                                },
                                {
                                    end_time:null
                                }
                            ]
                        }
                    ]}
                ]
            }
        });

        if(actionObj){
            //说明这个worker在忙碌
            throw new ApiError(ApiErrorNames.WORKER_BUSY);
        }

    }


    //如果指派一个工程师，他在这个工单中已经被指派了，并且没有完成，则不能指派
    let actionObj2=await ActionModel.findOne({
        where:{
            operationId:operationId,
            worker:workerId,
            end_time:null
        }
    })

    if(actionObj2){
        //说明这个人，在此工单中，已经被指派，并且还没有完成工作。重复指派了。
        throw new ApiError(ApiErrorNames.WORKER_BUSY_1);
    }



    Operation.hasMany(ActionModel,{foreignKey:'operationId',as:'actions'});
    //验证operationComplete标记的合理性 唯一性
    let operationObj=await Operation.findOne({
        where:{
            id:operationId,
            status:1
        },
        include:[
        {
            model:ActionModel,
            as:'actions'
        }]
    });

    if(operationObj&&operationObj.actions){
        for(let i=0;i<operationObj.actions.length;i++){
            let _ac=operationObj.actions[i];
            if(_ac.operationComplete.toString()=='1'){
                throw new ApiError(ApiErrorNames.OPERATION_COMPLETE_MUST_UNIQUE);
                break;
            }
            if(!_ac.end_time){
                //说明没有完成
                throw new ApiError(ApiErrorNames.ACTIONS_MUST_ALL_COMPLETE);
            }


        }
    }






    //如果加的完成标记，竟然在某个人开始工作的标记之前，也是不合理的
    if(completeOperation){
        let actionObj3=await ActionModel.findOne({
            where:{
                operationId:operationId,
                start_time:{
                    '$gt':{
                        finishTimeStamp
                    }
                },
                status:1
            }
        });
        if(actionObj3){
            throw new ApiError(ApiErrorNames.OPERATION_COMPLETE_MUST_UNIQUE);
        }
    }




    if(actionId){

    }
    else{
        //新增
        let createResult=await ActionModel.create({
            operationId:operationId,
            call_time:callTimeStamp,
            start_time:showArriveDate?arriveTimeStamp:null,
            end_time:showFinishDate?finishTimeStamp:null,
            status:1,
            worker:workerId,
            operationComplete:completeOperation?1:0
        });
        ctx.body={
            status:0,
            data:createResult,
            message:response_config.createdSuccess
        }
    }
}

exports.delete=async(ctx,next)=>{
    let userid=ctx.params.userid;
    let Worker=model.workers;
    let workerObj=await Worker.findOne({
        where:{
            userId:userid
        }
    })
    if(workerObj){
        let deleteResult=await workerObj.destroy();
        ctx.body={
            status:0,
            data:deleteResult,
            message:response_config.deleteSucess
        }
    }
    else{
        throw new ApiError(ApiErrorNames.WORKER_NOT_EXIST);
    }
}

exports.get=async(_id)=>{
    let Worker=model.workers;
    let User=model.user;

    let userObj=await User.findOne({
        where:{
            status:1,
            id:_id
        }
    })

    let workerObj=await Worker.findOne({
        where:{
            userId:_id
        }
    })

    if(userObj&&workerObj){
        return userObj
    }
    else{
        return null;
    }
}