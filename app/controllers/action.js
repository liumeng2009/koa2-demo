const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const response_config=require('../../config/response_config');
const config = require('../../config/mysql_config');
const db=require('../db');
const auth=require('./authInRole');

exports.list=async(ctx,next)=>{
    let time=ctx.params.time;

    let startDateStamp=0;
    let endDateStamp=0;

    if(time&&time!='0'&&Date(time)){
        let startDate=new Date();
        startDate.setTime(time);
        startDateStamp=Date.parse(startDate.toDateString());
        endDateStamp=time;
    }
    else{
        throw new ApiError(ApiErrorNames.INPUT_DATE_ERROR_TYPE);
    }

    let ActionModel=model.actions;
    let User=model.user;
    let Operation=model.operations;
    let Order=model.orders;
    let BusinessContent=model.businessContents;
    let EquipOp=model.equipOps;
    let Corporation=model.corporations;

    ActionModel.belongsTo(Operation,{foreignKey:'operationId'});
    ActionModel.belongsTo(User,{foreignKey:'worker'})
    Operation.belongsTo(Order,{foreignKey:'orderId'});
    Operation.belongsTo(BusinessContent,{foreignKey:'op'});
    BusinessContent.belongsTo(EquipOp,{foreignKey:'operation',targetKey:'code'});
    Order.belongsTo(Corporation,{foreignKey:'custom_corporation'});

    let result=await ActionModel.findAll({
        where:{
            status:1,
            '$and':[
                {
                    call_time:{'$gte':startDateStamp}
                },{
                    call_time:{'$lte':endDateStamp}
                }
            ]
        },
        include:[
            {
                model:Operation,
                include:[
                    {
                        model:Order,
                        include:[
                            {
                                model:Corporation
                            }
                        ]
                    },
                    {
                        model:BusinessContent,
                        include:[
                            {
                                model:EquipOp
                            }
                        ]
                    }
                ]
            },
            {
                model:User
            }
        ]
    })

    ctx.body={
        status:0,
        data:result
    }
}

exports.save=async(ctx,next)=>{
    await auth.checkAuth(ctx.request.headers.authorization,'op','edit');
    let userid=ctx.request.body.userId;
    let operationId=ctx.request.body.id;
    let workerId=ctx.request.body.worker;
    let callTimeStamp=ctx.request.body.call_date_timestamp;
    let showArriveDate=ctx.request.body.showArriveDate;
    let arriveTimeStamp=ctx.request.body.arrive_date_timestamp;
    let showFinishDate=ctx.request.body.showFinishDate;
    let finishTimeStamp=ctx.request.body.finish_date_timestamp;
    let completeOperation=ctx.request.body.isCompleteOperation;

    //验证数据合理性
    let Operation=model.operations;
    let Worker=model.workers;
    let ActionModel=model.actions;
    let User=model.user;
    ActionModel.belongsTo(User,{foreignKey:'worker'});

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

    //如果有工单完成时间的这个标记，那么三个时间都不能晚于这个时间了
    let actionObj4=await ActionModel.findOne({
        where:{
            status:1,
            operationId:operationId,
            operationComplete:1
        }
    });
    if(actionObj4){
        let operationCompleteTime=actionObj4.end_time;
        if(callTimeStamp>operationCompleteTime){
            throw new ApiError(ApiErrorNames.ACTION_CALL_LESS_THAN_COMPLETE);
        }
        if(arriveTimeStamp>operationCompleteTime){
            throw new ApiError(ApiErrorNames.ACTION_START_LESS_THAN_COMPLETE);
        }
        if(finishTimeStamp>operationCompleteTime){
            throw new ApiError(ApiErrorNames.ACTION_END_LESS_THAN_COMPLETE);
        }
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
            include:[
                {
                    model:User
                }
            ],
            where:{
                status:1,
                worker:workerId,
                '$or':[
                    {
                        start_time:{'$lte':arriveTimeStamp},
                        end_time:null
                    },
                    {
                        start_time:{'$lte':arriveTimeStamp},
                        end_time:{'$gte':arriveTimeStamp}
                    }
                ]
            }
        });

        if(actionObj){
            //说明这个worker在忙碌
            throw new ApiError(ApiErrorNames.WORKER_BUSY,[actionObj.user.name]);
        }
    }

    if(showFinishDate){
        let actionEndObj=await ActionModel.findOne({
            include:[
                {
                    model:User
                }
            ],
            where:{
                status:1,
                worker:workerId,
                '$or':[
                    {
                        start_time:{'$lte':finishTimeStamp},
                        end_time:null
                    },
                    {
                        start_time:{'$lte':finishTimeStamp},
                        end_time:{'$gte':finishTimeStamp}
                    }
                ]
            }
        });

        if(actionEndObj){
            //说明这个worker在忙碌
            throw new ApiError(ApiErrorNames.WORKER_BUSY,[actionEndObj.user.name]);
        }
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
            as:'actions',
            where:{
                status:1
            }
        }]
    });

    //全部工作都完成，才可以标记工单完成
    if(completeOperation){
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
    }

    //如果加的完成标记，竟然在某个人开始工作的标记之前，也是不合理的
    if(completeOperation){
        let actionObj3=await ActionModel.findOne({
            where:{
                operationId:operationId,
                '$or':[
                    {
                        start_time:{
                            '$gt': finishTimeStamp
                        }
                    },
                    {
                        end_time:{
                            '$gt': finishTimeStamp
                        }
                    }
                ],
                status:1
            }
        });
        if(actionObj3){
            throw new ApiError(ApiErrorNames.OPERATION_COMPLETE_TIME_MUST_LAST);
        }
    }

    console.log('验证通过');

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

exports.edit=async(ctx,next)=>{
    await auth.checkAuth(ctx.request.headers.authorization,'op','edit');
    let operationId=ctx.request.body.operationId;
    let actionId=ctx.request.body.id;
    let workerId=ctx.request.body.workerId;
    let create_stamp=ctx.request.body.create_stamp;
    let call_stamp=ctx.request.body.call_stamp;
    let showArriveDate=ctx.request.body.showArriveDate;
    let start_stamp=ctx.request.body.start_stamp;
    let showFinishDate=ctx.request.body.showFinishDate;
    let end_stamp=ctx.request.body.end_stamp;
    let isCompleteOperation=ctx.request.body.isCompleteOperation;

    let Operation=model.operations;
    let Worker=model.workers;
    let ActionModel=model.actions;
    let User=model.user;
    ActionModel.belongsTo(User,{foreignKey:'worker'});
    Operation.hasMany(ActionModel,{foreignKey:'operationId',as:'actions'});

    let actionObj=await ActionModel.findOne({
        where:{
            status:1,
            id:actionId
        }
    })

    if(actionObj){
        //验证四个时间的合理性
        console.log('指派时间'+call_stamp);
        console.log('建立时间'+create_stamp);
        if(call_stamp<create_stamp){
            //指派小于工单建立 不合理
            throw new ApiError(ApiErrorNames.OPERATION_CALL_MORE_THAN_CREATE);
        }

        if(showArriveDate&&start_stamp<call_stamp){
            throw new ApiError(ApiErrorNames.OPERATION_ARRIVE_MORE_THAN_CALL);
        }

        if(showFinishDate&&end_stamp<start_stamp){
            throw new ApiError(ApiErrorNames.OPERATION_FINISH_MORE_THAN_ARRIVE);
        }

        //如果有工单完成时间的这个标记，那么三个时间都不能晚于这个时间了
        let actionObj4=await ActionModel.findOne({
            where:{
                status:1,
                operationId:operationId,
                operationComplete:1,
                id:{
                    '$ne':actionId
                }
            }
        });
        if(actionObj4){
            let operationCompleteTime=actionObj4.end_time;
            if(call_stamp>operationCompleteTime){
                throw new ApiError(ApiErrorNames.ACTION_CALL_LESS_THAN_COMPLETE);
            }
            if(start_stamp>operationCompleteTime){
                throw new ApiError(ApiErrorNames.ACTION_START_LESS_THAN_COMPLETE);
            }
            if(end_stamp>operationCompleteTime){
                throw new ApiError(ApiErrorNames.ACTION_END_LESS_THAN_COMPLETE);
            }
        }


        console.log(2+workerId);
        //验证工程师是否存在
        let workerObj=await Worker.findOne({
            where:{
                userId:workerId
            }
        })

        if(workerObj){
            console.log(21);
        }
        else{
            throw new ApiError(ApiErrorNames.WORKER_NOT_EXIST);
        }
        console.log(22);

        //验证工程师现在的状态，如果工程师在工作中，就不能开始另一项工作了
        if(showArriveDate){
            let actionObj=await ActionModel.findOne({
                include:[
                    {
                        model:User
                    }
                ],
                where:{
                    status:1,
                    worker:workerId,
                    id:{
                        '$ne':actionId
                    },
                    '$or':[
                        {
                            start_time:{'$lte':start_stamp},
                            end_time:null
                        },
                        {
                            start_time:{'$lte':start_stamp},
                            end_time:{'$gte':start_stamp}
                        }
                    ]
                }
            });

            if(actionObj){
                //说明这个worker在忙碌
                throw new ApiError(ApiErrorNames.WORKER_BUSY,[actionObj.user.name]);
            }
        }

        if(showFinishDate){
            let actionEndObj=await ActionModel.findOne({
                include:[
                    {
                        model:User
                    }
                ],
                where:{
                    status:1,
                    worker:workerId,
                    id:{
                        '$ne':actionId
                    },
                    '$or':[
                        {
                            start_time:{'$lte':end_stamp},
                            end_time:null
                        },
                        {
                            start_time:{'$lte':end_stamp},
                            end_time:{'$gte':end_stamp}
                        }
                    ]
                }
            });

            if(actionEndObj){
                //说明这个worker在忙碌
                throw new ApiError(ApiErrorNames.WORKER_BUSY,[actionEndObj.user.name]);
            }
        }




        console.log(3);
        //如果指派一个工程师，他在这个工单中已经被指派了，并且没有完成，则不能指派
        let actionObj2=await ActionModel.findOne({
            where:{
                id:{
                    '$ne':actionId
                },
                operationId:operationId,
                worker:workerId,
                end_time:null,
                status:1
            }
        })

        if(actionObj2){
            //说明这个人，在此工单中，已经被指派，并且还没有完成工作。重复指派了。
            throw new ApiError(ApiErrorNames.WORKER_BUSY_1);
        }


        //验证operationComplete标记的合理性 唯一性
        let operationObj=await Operation.findOne({
            where:{
                id:operationId,
                status:1
            },
            include:[
                {
                    model:ActionModel,
                    as:'actions',
                    where:{
                        status:1
                    }
                }]
        });
        console.log(4);
        //全部工作都完成，才可以标记工单完成
        if(isCompleteOperation){
            if(operationObj&&operationObj.actions){
                for(let i=0;i<operationObj.actions.length;i++){
                    let _ac=operationObj.actions[i];
                    if(_ac.operationComplete.toString()=='1'&&_ac.id!=actionId){
                        throw new ApiError(ApiErrorNames.OPERATION_COMPLETE_MUST_UNIQUE);
                        break;
                    }
                    if(!_ac.end_time&&_ac.id!=actionId){
                        //说明没有完成
                        throw new ApiError(ApiErrorNames.ACTIONS_MUST_ALL_COMPLETE);
                    }


                }
            }
        }
        console.log(5);
        //如果加的完成标记，时间点在某个人开始工作的标记之前，或者在某个人完成工作之前，也是不合理的
        if(isCompleteOperation){
            let actionObj3=await ActionModel.findOne({
                where:{
                    operationId:operationId,
                    id:{
                        '$ne':actionId
                    },
                    '$or':[
                        {
                            start_time:{
                                '$gt': end_stamp

                            }
                        },
                        {
                            end_time:{
                                '$gt': end_stamp
                            }
                        }
                    ],

                    status:1
                }
            });
            if(actionObj3){
                throw new ApiError(ApiErrorNames.OPERATION_COMPLETE_TIME_MUST_LAST);
            }
        }
        console.log(6);
        actionObj.worker=workerId;
        actionObj.call_time=call_stamp;
        actionObj.operationComplete=isCompleteOperation?1:0;
        if(showArriveDate){
            actionObj.start_time=start_stamp;
        }
        else{
            actionObj.start_time=null;
        }
        if(showFinishDate){
            actionObj.end_time=end_stamp;
        }
        else{
            actionObj.end_time=null;
        }


        let editResult=await actionObj.save();


        console.log(editResult);

        ctx.body={
            status:0,
            data:editResult,
            message:response_config.updatedSuccess
        }




    }
    else{
        throw new ApiError(ApiErrorNames.ACTIONS_NOT_EXIST);
    }
}

exports.delete=async(ctx,next)=>{
    await auth.checkAuth(ctx.query.token,'op','edit');
    let id=ctx.params.id;
    let ActionModel=model.actions;
    let actionObj=await ActionModel.findOne({
        where:{
            id:id,
            status:1
        }
    })
    if(actionObj){
        actionObj.status=0;
        let saveResult=await actionObj.save();
        ctx.body={
            status:0,
            data:saveResult,
            message:response_config.deleteSuccess
        }
    }
    else{
        throw new ApiError(ApiErrorNames.ACTIONS_NOT_EXIST);
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