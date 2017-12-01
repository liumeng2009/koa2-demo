/**
 * Created by liumeng on 2017/6/5.
 */
const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');

exports.list=async(ctx,next)=>{
    let Operation=model.operations;
    let Action=model.actions;
    let Order=model.orders;
    let Corporation=model.corporations;
    let CorpBuilding=model.corpBuildings;
    let Building=model.buildings;
    let ActionModel=model.actions;
    let User=model.user;

    Operation.belongsTo(Order,{foreignKey:'orderId'});
    Order.belongsTo(Corporation,{foreignKey:'custom_corporation'});
    Order.belongsTo(CorpBuilding,{foreignKey:'custom_position'});
    CorpBuilding.belongsTo(Building,{foreignKey:'buildingId'});
    Operation.hasMany(ActionModel,{foreignKey:'operationId',as:'actions'});
    //ActionModel.belongsTo(Operation,{foreignKey:'operationId',as:'actions'})

    ActionModel.belongsTo(User,{foreignKey:'worker'});

    let pageid=ctx.params.pageid;

    let operations;

    let total=await Operation.count({
        where:{
            status:1
        }
    });

    if(pageid&&pageid!=0){
        let pageidnow=parseInt(pageid);
        operations=await Operation.findAll({
            where:{
                status:1
            },
            include:[{
                model:Order,
                include:[
                    {
                        model:Corporation
                    },
                    {
                        model:CorpBuilding,
                        include:[
                            {
                                model:Building
                            }
                        ]
                    }
                ]
            },{
                model:ActionModel,
                as:'actions',
                required:false,
                where:{
                    status:1
                },
                include:[
                    {
                        model:User
                    }
                ]
            }],
            offset: (pageidnow-1)*sys_config.pageSize,
            limit: sys_config.pageSize,
            order:[
                ['updatedAt','DESC']
            ]
        })
    }
    else{
        operations=await Operation.findAll({
            where:{
                status:1
            },
            include:[{
                model:Order,
                include:[
                    {
                        model:Corporation
                    },
                    {
                        model:CorpBuilding,
                        include:[
                            {
                                model:Building
                            }
                        ]
                    }
                ]
            },{
                model:ActionModel,
                as:'actions',
                include:[
                    {
                        model:User
                    }
                ]
            }
            ],
            order:[
                ['updatedAt','DESC']
            ]
        })
    }
    ctx.body={
        status:0,
        data:operations,
        total:total
    }
}

exports.getOperation=async(ctx,next)=>{

    console.log(132222222222222);
    let id=ctx.params.id;

    let Operation=model.operations;
    let Action=model.actions;
    let Order=model.orders;
    let Corporation=model.corporations;
    let CorpBuilding=model.corpBuildings;
    let Building=model.buildings;
    let ActionModel=model.actions;
    let User=model.user;
    let BusinessContent=model.businessContents;
    let EquipType=model.equipTypes;
    let EquipOps=model.equipOps;

    Operation.belongsTo(Order,{foreignKey:'orderId'});
    Order.belongsTo(Corporation,{foreignKey:'custom_corporation'});
    Order.belongsTo(CorpBuilding,{foreignKey:'custom_position'});
    CorpBuilding.belongsTo(Building,{foreignKey:'buildingId'});
    Operation.hasMany(ActionModel,{foreignKey:'operationId',as:'actions'});
    Operation.belongsTo(BusinessContent,{foreignKey:'op'});
    ActionModel.belongsTo(User,{foreignKey:'worker'});

    BusinessContent.belongsTo(EquipType,{foreignKey:'type',targetKey:'code'});
    BusinessContent.belongsTo(EquipOps,{foreignKey:'operation',targetKey:'code'});

    let operation=await Operation.findOne({
        where:{
            id:id,
            status:1
        },
        include:[{
            model:Order,
            include:[
                {
                    model:Corporation
                },
                {
                    model:CorpBuilding,
                    include:[
                        {
                            model:Building
                        }
                    ]
                }
            ]
        },{
            model:BusinessContent,
            include:[{
                model:EquipType
            },{
                model:EquipOps
            }],
        },{
            model:ActionModel,
            as:'actions',
            where:{
                status:1
            },
            required:false,
            include:[
                {
                    model:User
                }
            ],
        }],
        order:[
            [{model: ActionModel, as: 'actions'},'updatedAt','desc']
        ]
    })

    if(operation){
        ctx.body={
            status:0,
            data:operation
        }
    }
    else{
        throw new ApiError(ApiErrorNames.OPERATION_NOT_EXIST);
    }

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