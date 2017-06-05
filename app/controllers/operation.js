/**
 * Created by liumeng on 2017/6/5.
 */
const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');

exports.list=async(ctx,next)=>{
    let Operation=model.operations;

    let op=await Operation.findAll();
    console.log(op)

    await ctx.render('./back/operation/list',{
        title:'功能操作列表',
        operations:op
    });
}