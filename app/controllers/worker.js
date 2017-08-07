const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const Sequelize = require('sequelize');
const config = require('../../config/mysql_config');
const db=require('../db');

exports.list=async(ctx,next)=>{
    let Worker = model.workers;
    let User=model.user;
    Worker.belongsTo(User);

    let workerObj;

    workerObj=await Worker.findAll({
        include:[{
            model:User
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

exports.userNotInWorkerList=async(ctx,next)=>{

    var sequelize=db.sequelize;

/*    var sequelize = new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        dialect: config.dialect,
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        dialectOptions: {
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        }
    });*/

    //一个不得已的方法，不知道如何使用model以及关系进行编程，直接使用sql语句了。
    let userObj=await sequelize.query('select * from users where id not in (select userid as id from workers);',{ plain : false,  raw : true,type:sequelize.QueryTypes.SELECT});

    ctx.body={
        status:0,
        data:userObj
    }

}

exports.save=async(ctx,next)=>{
    let userid=ctx.params.userid;
    let Worker=model.workers;
    let workerObj=await Worker.findOne({
        where:{
            userId:userId
        }
    });
    if(workerObj){
        throw new ApiError(ApiErrorNames.WORKER_EXIST);
    }
    else{
        let createResult=await Worker.create({
            userId:userid
        });
        ctx.body={
            status:0,
            data:createResult,
            message:response_config.createdSuccess
        }
    }
}

exports.delete=async(ctx,next)=>{
    let id=ctx.params.id;
    let Worker=model.workers;
    let workerObj=await Worker.findOne({
        where:{
            id:id
        }
    })
    if(workerObj){
        let deleteResult=await workerObj.delete();
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