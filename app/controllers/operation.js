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
    await ctx.render('./back/operation/add',{
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
        }).then(function(p) {
            console.log('found' + JSON.stringify(p));
            if(p.length>0){
                let operationObj=p[0];
                operationObj.name=name;
                operationObj.code=code;
                operationObj.discription=discription;
                operationObj.save().then(function(p){
                    console.log('update success'+JSON.stringify(p));
                    ctx.redirect('/admin/operation/list');
                });
            }

        }).catch(function (err) {
            //console.log('hahahahahahahah'+JSON.stringify(err));
            throw new ApiError(err);
        });
    }
    //id不存在，说明是新增模式
    else{
        //promise
        await Operation.create({
            name:name,
            code:code,
            discription:discription
        }).then(function(p){
            console.log('created'+JSON.stringify(p)+'test the password');
            ctx.redirect('/admin/operation/list');
        }).catch(function(err){
            console.log('failed'+err)
            throw new ApiError(err);
        });
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
    }).then(function(p){
        console.log('delete success'+JSON.stringify(p));
        ctx.redirect('/admin/operation/list');
    })
}