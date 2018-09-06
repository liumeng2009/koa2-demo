const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const response_config=require('../../config/response_config');
const config = require('../../config/mysql_config');
const db=require('../db');
const auth=require('./authInRole');
const moment=require('moment')

exports.list=async(ctx,next)=>{

    //await auth.checkAuth();

    let Worker=model.workers;
    let User=model.user;

    User.belongsTo(Worker,{foreignKey:'id',targetKey:'userId'});

    let workerObj;

    workerObj=await User.findAll({
        include:[{
            model:Worker
        }],
        order:[
            ['createdAt','asc']
        ]
    });

    ctx.body={
        status:0,
        data:workerObj
    }
}

exports.doing_list=async(ctx,next)=>{
    let time=ctx.params.time;

    let ActionModel=model.actions;
    let User=model.user;
    let Worker=model.workers;
    let Operation=model.operations;
    let Order=model.orders;
    let BusinessContent=model.businessContents;
    let EquipOp=model.equipOps;

    User.hasMany(ActionModel,{foreignKey:'worker',as:'actions'});
    User.belongsTo(Worker,{foreignKey:'id',targetKey:'userId'});
    ActionModel.belongsTo(Operation,{foreignKey:'operationId'});
    Operation.belongsTo(Order,{foreignKey:'orderId'});
    Operation.belongsTo(BusinessContent,{foreignKey:'op'});
    BusinessContent.belongsTo(EquipOp,{foreignKey:'operation',targetKey:'code'});

    let result=await User.findAll({
        where:{
            status:1
        },
        include:[
            {
                model:ActionModel,
                as:'actions',
                required:false,
                where:{
                    status:1,
                    '$or':[
                        {
                            start_time:{'$lte':time},
                            end_time:null
                        },
                        {
                            start_time:{'$lte':time},
                            end_time:{'$gte':time}
                        }
                    ]
                },
                include:[
                    {
                        model:Operation,
                        include:[
                            {
                                model:Order
                            },{
                                model:BusinessContent,
                                include:[
                                    {
                                        model:EquipOp
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                model:Worker,
                required:true
            }
        ]
    })

    ctx.body={
        status:0,
        data:result
    }

}

exports.doing_where=async(ctx,next)=>{
    let time=ctx.params.time;
    let todayStart=moment().startOf('day').valueOf();
    console.log('toeday是'+todayStart);

    let ActionModel=model.actions;
    let User=model.user;
    let Worker=model.workers;
    let Operation=model.operations;
    let Order=model.orders;
    let Corporation=model.corporations;

    User.hasMany(ActionModel,{foreignKey:'worker',as:'actions'});
    User.belongsTo(Worker,{foreignKey:'id',targetKey:'userId'});
    ActionModel.belongsTo(Operation,{foreignKey:'operationId'});
    Operation.belongsTo(Order,{foreignKey:'orderId'});
    Order.belongsTo(Corporation,{foreignKey:'custom_corporation'})

    let result=await User.findAll({
        where:{
            status:1
        },
        include:[
            {
                model:ActionModel,
                as:'actions',
                required:true,
                where:{
                    status:1,
                    '$or':[
                        {
                            start_time:{
                                '$lte':time,
                                '$gte':todayStart
                            },
                            end_time:null
                        },
                        {
                            start_time:{
                                '$lte':time,
                                '$gte':todayStart
                            },
                            end_time:{
                                '$gte':time
                            }
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
                            }
                        ]
                    }
                ]
            },
            {
                model:Worker,
                required:true
            }
        ]
    })

    ctx.body={
        status:0,
        data:result
    }

}

exports.save=async(ctx,next)=>{
    await auth.checkAuth(ctx.query.token,'worker','add');

    let userid=ctx.request.body.userId;
    let User=model.user;
    let Worker=model.workers;
    let workerObj=await Worker.findOne({
        where:{
            userId:userid
        }
    });
    if(workerObj){
        throw new ApiError(ApiErrorNames.WORKER_EXIST);
    }
    else{
        let userObj=await User.findOne({
            where:{
                status:1,
                id:userid
            }
        });
        if(userObj){
            let createResult=await Worker.create({
                userId:userid
            });
            ctx.body={
                status:0,
                data:createResult,
                message:response_config.createdSuccess
            }
        }
        else{
            throw new ApiError(ApiErrorNames.USER_NAME_NOT_EXIST);
        }

    }
}

exports.delete=async(ctx,next)=>{
    await auth.checkAuth(ctx.query.token,'worker','delete');

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
            message:response_config.deleteSuccess
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