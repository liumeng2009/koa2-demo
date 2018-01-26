const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const Sequelize = require('sequelize');


exports.list=async(ctx,next)=>{
    let Operate=model.operates;

    let result=await Operate.findAll({
        where:{
            status:1
        }
    })
    ctx.body={
        status:0,
        data:result
    }
}