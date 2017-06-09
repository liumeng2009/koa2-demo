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
        operations:op,
        staticPath:'../../'
    });
}
exports.addIndex=async(ctx,next)=>{
    await ctx.render('./back/operation/add',{
        title:'新增功能操作',
        staticPath:'../'
    });
}
exports.editIndex=async(ctx,next)=>{
    let id=ctx.params.id;
    console.log('请求的id是：'+id);
    let Operation=model.operations;
    let operation=await Operation.findAll({
        where: {
            id: id
        }
    });
    console.log('heieheieheihieihi'+operation)
    await ctx.render('./back/operation/edit',{
        title:'编辑功能操作',
        staticPath:'../../../',
        operation:operation[0]
    });
}


exports.save=async(ctx,next)=>{
    let name=ctx.request.body.name;
    let code=ctx.request.body.code;
    let discription=ctx.request.body.discription;
    let id=ctx.request.body.id;

    let Operation=model.operations;

    //id存在，说明是编辑模式
    if(id){
        let Operation=model.operations;
        let operation=await Operation.findAll({
            where: {
                id: id
            }
        });
        console.log('found' + JSON.stringify(operation));
        let operationObj=operation[0];
        operationObj.name=name;
        operationObj.code=code;
        operationObj.discription=discription;

        let saveResult= await operationObj.save();
        console.log('update success'+JSON.stringify(saveResult));
        await ctx.redirect('/admin/operation/list');
    }
    //id不存在，说明是新增模式
    else{
        //promise
        let createResult=await Operation.create({
            name:name,
            code:code,
            discription:discription
        });
        console.log('created'+JSON.stringify(createResult)+'test the password');
        await ctx.redirect('/admin/operation/list');
    }
}

exports.delete=async(ctx,next)=>{
    let id=ctx.params.id;
    console.log(id);
    let Operation=model.operations;
    let operation=await Operation.findAll({
        where: {
            id: id
        }
    })
    let deleteResult=await operation[0].destroy();
    console.log('delete success'+JSON.stringify(deleteResult));
    ctx.redirect('/admin/operation/list');
}