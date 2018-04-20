const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const Sequelize = require('sequelize');
const auth=require('./authInRole');

const uuid = require('node-uuid');


exports.list=async(ctx,next)=>{

    let idd=uuid.v4();
    console.log('新的id'+idd);

    let Function=model.functions;
    let Operate=model.operates;
    let OpInFunc=model.opInFuncs;

    Function.hasMany(OpInFunc,{foreignKey:'funcId',as:'ops'});
    OpInFunc.belongsTo(Operate,{foreignKey:'opId'});

    let result=await Function.findAll({
        where:{
            status:1
        },
        include:[
            {
                model:OpInFunc,
                as:'ops',
                include:[
                    {
                        model:Operate,
                        required:false
                    }
                ]
            }
        ]
    })

    ctx.body={
        status:0,
        data:result
    }

}

exports.parent_list=async(ctx,next)=>{
    let Function=model.functions;
    let result=await Function.findAll({
        where:{
            status:1,
            class:0
        }
    })
    ctx.body={
        status:0,
        data:result
    }
}

exports.add=async(ctx,next)=>{
    await auth.checkAuth(ctx.query.token,'function','add');
    let name=ctx.request.body.name;
    let code=ctx.request.body.code;
    let classs=ctx.request.body.classs;
    let belong=ctx.request.body.belong;

    let FunctionModel=model.functions;

    if(name==''||name==undefined){
        throw new ApiError(ApiErrorNames.INPUT_FIELD_NULL,['功能名称'])
    }
    if(code==''||code==undefined){
        throw new ApiError(ApiErrorNames.INPUT_FIELD_NULL,['功能代码'])
    }

    let r1=await FunctionModel.findOne({
        where:{
            status:1,
            name:name
        }
    })
    if(r1){
        throw new ApiError(ApiErrorNames.FUNCTION_NAME_EXIST)
    }
    let r2=await FunctionModel.findOne({
        where:{
            status:1,
            code:code
        }
    })
    if(r2){
        throw new ApiError(ApiErrorNames.FUNCTION_NAME_EXIST)
    }

    let result=await FunctionModel.create({
        name:name,
        code:code,
        class:classs,
        belong:classs==0?null:belong,
        status:1
    })

    ctx.body={
        status:0,
        data:result,
        message:response_config.createdSuccess
    }

}