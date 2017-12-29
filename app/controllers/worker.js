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