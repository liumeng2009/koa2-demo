const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const Sequelize = require('sequelize');


exports.list=async(ctx,next)=>{
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
                        required:true
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