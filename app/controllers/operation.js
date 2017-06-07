/**
 * Created by liumeng on 2017/6/5.
 */
const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');

exports.list=async(ctx,next)=>{

    if(ctx.url=='/admin/operation'){
        await ctx.redirect('/admin/operation/list');
    }
    else{
        let Operation=model.operations;
        let op=await Operation.findAll();
        console.log(op)

        await ctx.render('./back/operation/list',{
            title:'功能操作列表',
            operations:[{
                name:'liumeng',
                code:'hu',
                description:'你好'
            },{
                name:'liumeng',
                code:'hu',
                description:'你好111111111'
            }],
            staticPath:'../../'
        });
    }

}
exports.add=async(ctx,next)=>{
    await ctx.render('./back/operation/add',{
        title:'新增功能操作',
        staticPath:'../../'
    });
}