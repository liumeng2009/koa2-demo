/**
 * Created by liumeng on 2017/6/5.
 */
const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const orderController=require('./order');
const db=require('../db');

exports.list=async(ctx,next)=>{
    let Operation=model.operations;
    let Action=model.actions;
    let Order=model.orders;
    let Corporation=model.corporations;
    let CorpBuilding=model.corpBuildings;
    let Building=model.buildings;
    let ActionModel=model.actions;
    let User=model.user;

    let time=ctx.params.time;
    let corp=ctx.params.corp;
    let no=ctx.params.no;

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

    let searchObj={
        status:1
    }
    if(time&&time!='0'&&Date(time)){
        let startDate=new Date();
        startDate.setTime(time);
        let startDateStamp=Date.parse(startDate.toDateString());
        let endDateStamp=startDateStamp+1000*60*60*24-1;

        searchObj.$and=[
            {create_time:{'$gte':startDateStamp}},
            {create_time:{'$lte':endDateStamp}}
        ];
    }

    let searchCorp={
        status:1
    }
    if(corp&&corp!='0'&&corp!=''){
        searchCorp.id=corp;
    }

    if(no&&no!='0'&&no!=''){
        searchObj.no={'$like':no+'%'};
    }

    if(pageid&&pageid!=0){
        let pageidnow=parseInt(pageid);
        operations=await Operation.findAll({
            where:searchObj,
            include:[{
                model:Order,
                include:[
                    {
                        model:Corporation,
                        where:searchCorp
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
            where:searchObj,
            include:[{
                model:Order,
                include:[
                    {
                        model:Corporation,
                        where:searchCorp
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
            [{model: ActionModel, as: 'actions'},'createdAt','ASC']
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


exports.add=async(ctx,next)=>{
    let Operation=model.operations;
    let Order=model.orders;

    let orderId=ctx.request.body.order.id;
    let op=ctx.request.body.businessContent.id;
    let remark=ctx.request.body.remark;
    let important=ctx.request.body.important;
    let create_time=ctx.request.body.incoming_date_timestamp;

    console.log(create_time);

    let orderIncomingDate=new Date();
    orderIncomingDate.setTime(create_time);


    //验证op存在性
    let BusinessContent=model.businessContents;

    let businessContentObj=await BusinessContent.findOne({
        where:{
            status:1,
            id:op
        }
    });

    if(businessContentObj){

    }
    else{
        throw new ApiError(ApiErrorNames.BUSINESS_NOT_EXIST);
    }

    //验证订单存在性
    let orderObj=await Order.findOne({
        where:{
            status:1,
            id:orderId
        }
    })

    if(orderObj){
        let operationNoArray=await orderController.getOperationNoSFun(orderIncomingDate.getFullYear(),orderIncomingDate.getMonth()+1,orderIncomingDate.getDate(),1);
        let saveResult=await Operation.create({
            orderId:orderId,
            important:important,
            op:op,
            no:operationNoArray[0],
            create_time:create_time,
            remark:remark,
            status:1
        })
        ctx.body={
            status:0,
            data:saveResult,
            message:response_config.createdSuccess
        }
    }
    else{
        console.log('错误发生了');
        throw new ApiError(ApiErrorNames.ORDER_NOT_EXIST);
    }


}
exports.edit=async(ctx,next)=>{

    let Operation=model.operations;
    let ActionModel=model.actions;
    let operationId=ctx.request.body.id;
    let op=ctx.request.body.businessContent.id;
    let remark=ctx.request.body.remark;
    let important=ctx.request.important;

    let operation=await Operation.findOne({
        where:{
            status:1,
            id:operationId
        }
    })

    if(operation){
        let actionObj=await ActionModel.findOne({
            where:{
                status:1,
                operationId:operationId
            }
        });
        if(actionObj){
            throw new ApiError(ApiErrorNames.OPERATION_CAN_NOT_EDIT);
        }
        else{
            //存在这个信息，并且没有工程师进行工作和指派，才可以进行编辑
            operation.op=op;
            operation.remark=remark;
            operation.imporant=important;

            let saveResult=await operation.save();

            ctx.body={
                status:0,
                data:saveResult,
                message:response_config.updatedSuccess
            }

        }

    }
    else{
        throw new ApiError(ApiErrorNames.OPERATION_NOT_EXIST);
    }
}

//废弃，没用
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

    let sequelize=db.sequelize;

    let Operation=model.operations;
    let ActionModel=model.actions;

    let operation=await Operation.findOne({
        where: {
            id: id,
            status:1
        }
    })
    if(operation){

        return new Promise((resolve,reject)=>{
            console.log('trans start');
            sequelize.transaction(
                function(t){
                    return ActionModel.update({
                        status:0
                    },{transaction:t,where:{operationId:id}}).then(function(act){
                        console.log('trans start 2');
                        return Operation.update({
                            status:0
                        },{transaction:t,where:{id:id}}).then(function(op){
                            console.log(op);
                            resolve(
                                ctx.body={
                                    status:0,
                                    data:op,
                                    message:response_config.deleteSuccess
                                }
                            )
                        }).catch((error)=>{
                            console.log(error);
                            reject(
                                ctx.body={
                                    status:0,
                                    message:response_config.deleteFailed
                                }
                            )
                        })
                    }).catch((error)=>{
                        console.log(error);
                        ctx.body={
                            status:0,
                            message:response_config.deleteFailed
                        }
                    })
                }
            )
        });
    }
    else{
        throw new ApiError(ApiErrorNames.OPERATION_NOT_EXIST);
    }
}