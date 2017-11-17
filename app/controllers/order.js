/**
 * Created by liumeng on 2017/8/31.
 */
const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const db=require('../db');
const workerController=require('./worker');

exports.list=async(ctx,next)=>{
    let pageid=ctx.params.pageid;
    let Order=model.orders;

    let count=await Order.count({
        where:{
            status:1
        }
    });

    let orders;


    let Corporation=model.corporations;
    let CorpBuilding=model.corpBuildings;
    let Building=model.buildings;

    Order.belongsTo(Corporation,{foreignKey:'custom_corporation'});
    Order.belongsTo(CorpBuilding,{foreignKey:'custom_position'});
    CorpBuilding.belongsTo(Building,{foreignKey:'buildingId'});

    if(pageid&&pageid!=0){
        try{
            let pageidnow=parseInt(pageid);
            orders=await Order.findAll({
                where:{
                    status:1
                },
                include:[{
                    model:Corporation
                },{
                    model:CorpBuilding,
                    include:[
                        {
                            model:Building
                        }
                    ]
                }],
                order:[
                    ['updatedAt','DESC']
                ],
                offset: (pageidnow-1)*sys_config.pageSize,
                limit: sys_config.pageSize
            });
        }
        catch(e){
            orders=await Order.findAll({
                where:{
                    status:1
                },
                include:[{
                    model:Corporation
                },{
                    model:CorpBuilding,
                    include:[
                        {
                            model:Building
                        }
                    ]
                }],
                order:[
                    ['updatedAt','DESC']
                ]
            });
        }
    }
    else{
        orders=await Order.findAll({
            where:{
                status:1
            },
            include:[{
                model:Corporation
            },{
                model:CorpBuilding,
                include:[
                    {
                        model:Building
                    }
                ]
            }],
            order:[
                ['updatedAt','DESC']
            ]
        });
    }

    ctx.body={
        status:0,
        data:orders,
        total:count
    }

}

exports.getOrder=async(ctx,next)=>{
    let id=ctx.params.id;

    let Order=model.orders;
    let Corporation=model.corporations;
    let CorpBuilding=model.corpBuildings;
    let Building=model.buildings;
    let Operation=model.operations;

    let BusinessContent=model.businessContents;
    let EquipOp=model.equipOps;

    let ActionModel=model.actions;

    Order.belongsTo(Corporation,{foreignKey:'custom_corporation'});
    Order.belongsTo(CorpBuilding,{foreignKey:'custom_position'});
    CorpBuilding.belongsTo(Building,{foreignKey:'buildingId'});
    Order.hasMany(Operation,{foreignKey:'orderId',as:'operations'})
    Operation.belongsTo(BusinessContent,{foreignKey:'op'});
    BusinessContent.belongsTo(EquipOp,{foreignKey:'operation',targetKey:'code'});
    Operation.hasMany(ActionModel,{foreignKey:'operationId',as:'actions'});

    let order=await Order.findOne({
        where:{
            status:1,
            id:id
        },
        include:[{
            model:Corporation
        },{
            model:CorpBuilding,
            include:[
                {
                    model:Building
                }
            ]
        },{
            model:Operation,
            as:'operations',
            include:[
                {
                    model:BusinessContent,
                    include:[
                        {
                            model:EquipOp
                        }
                    ]
                },{
                    model:ActionModel,
                    as:'actions'
                }
            ]
        }]
    });
    if(order){
        ctx.body={
            status:0,
            data:order
        }
    }
    else{
        throw new ApiError(ApiErrorNames.ORDER_NOT_EXIST);
    }



}

exports.save=async(ctx,next)=>{
    let custom_name=ctx.request.body.custom_name;
    let custom_phone=ctx.request.body.custom_phone;
    let incoming_date_timestamp=ctx.request.body.incoming_date_timestamp;
    let custom_position=ctx.request.body.custom_position;
    let custom_corporation=ctx.request.body.corporation;
    let business_description=ctx.request.body.business_description;
    let remark=ctx.request.body.remark;
    let important=ctx.request.body.important;
    let needs=ctx.request.body.needs;

    let id=ctx.request.body.id;

    let Order=model.orders;

    if(custom_phone!=''&incoming_date_timestamp!=''&custom_position!=''){

    }
    else{
        throw new ApiError(ApiErrorNames.ORDER_ATTRIBUTE_NOT_NULL);
    }

    console.log('表单提交成功了吗'+incoming_date_timestamp);

    let incomingDate;

    try {
        incomingDate= new Date(incoming_date_timestamp);
    }
    catch(e){
        throw new ApiError(ApiErrorNames.INPUT_DATE_ERROR_TYPE);
    }


    //id存在，说明是编辑模式
    if(id){
        let orderObj=await Order.findOne({
            where: {
                id: id
            }
        });
        console.log('found' + JSON.stringify(orderObj));

        orderObj.custom_name=custom_name;
        orderObj.custom_phone=custom_phone;
        orderObj.custom_corporation=custom_corporation;
        orderObj.incoming_time=incoming_date_timestamp;
        orderObj.custom_position=custom_position;
        orderObj.remark=remark;
        orderObj.important=important;


        let saveResult= await orderObj.save();
        console.log('update success'+JSON.stringify(saveResult));
        ctx.body={
            status:0,
            data:saveResult,
            message:response_config.updatedSuccess
        }
    }
    //id不存在，说明是新增模式
    else{
        let createResult=await Order.create({
            custom_name:custom_name,
            custom_phone:custom_phone,
            incoming_time:incoming_date_timestamp,
            custom_position:custom_position,
            custom_corporation:custom_corporation,
            remark:remark,
            no:await getOrderNoFun(incomingDate.getFullYear(),incomingDate.getMonth()+1,incomingDate.getDate()),
            status:1,
            needs:needs.toString()
        });
        console.log('created'+JSON.stringify(createResult));
        ctx.body={
            status:0,
            data:createResult,
            message:response_config.createdSuccess
        }
    }
}

exports.saveAndSaveOperation=async(ctx,next)=>{
    let custom_name=ctx.request.body.custom_name;
    let custom_phone=ctx.request.body.custom_phone;
    let incoming_date_timestamp=ctx.request.body.incoming_date_timestamp;
    let custom_position=ctx.request.body.custom_position.id;
    let custom_corporation=ctx.request.body.corporation.id;
    let remark=ctx.request.body.remark;
    let needs=ctx.request.body.needs;
    let workerOrders=ctx.request.body.workerOrders;

    let incomingDate;

    try {
        incomingDate= new Date(incoming_date_timestamp);
    }
    catch(e){
        throw new ApiError(ApiErrorNames.INPUT_DATE_ERROR_TYPE);
    }

    //验证worker合法性
    for(let i=0;i<workerOrders.length;i++){
        if(workerOrders[i].showArriveDate){
            if(workerOrders[i].worker&&workerOrders[i].worker!=''){
                let r=await workerController.get(workerOrders[i].worker);
                if(r){
                    console.log('worker存在哦，可以继续');
                }
                else{
                    throw new ApiError(ApiErrorNames.WORKER_NOT_EXIST);
                }
            }
            else{
                throw new ApiError(ApiErrorNames.WORKER_NOT_EXIST);
            }

        }
    }

    let sequelize=db.sequelize;
    let Order=model.orders;
    let Operation=model.operations;
    let Action=model.actions;

    let orderNo=await getOrderNoFun(incomingDate.getFullYear(),incomingDate.getMonth()+1,incomingDate.getDate());
    let operationNos=await getOperationNoSFun(incomingDate.getFullYear(),incomingDate.getMonth()+1,incomingDate.getDate(),workerOrders.length);

    return new Promise((resolve,reject)=>{
        sequelize.transaction(
            function(t){
                return Order.create({
                    custom_name:custom_name,
                    custom_phone:custom_phone,
                    incoming_time:incoming_date_timestamp,
                    custom_position:custom_position,
                    custom_corporation:custom_corporation,
                    remark:remark,
                    no:orderNo,
                    status:1,
                    needs:needs.toString()
                },{transaction:t}).then(function(order){

                    //保存工单
                    let workOrderArray=[];
                    for(let i=0;i<workerOrders.length;i++){
                        console.log('循环生成的no：'+operationNos[i]);
                        let workOrderObj={
                            orderId:order.id,
                            important:workerOrders[i].important,
                            op:workerOrders[i].op.id,
                            remark:workerOrders[i].remark,
                            no:operationNos[i],
                            create_time:incoming_date_timestamp,
                            status:1
                        }
                        workOrderArray.push(workOrderObj);
                    }
                    return Operation.bulkCreate(workOrderArray,{transaction:t}).then(function(operations){
                        console.log(operations);
                        //根据情况保存行为,以下逻辑的前提是orders这个结果和workOrderArray(还有workerOrders的顺序)的顺序是一致的
                        let actions=[];
                        for(let i=0;i<operations.length;i++){
                            console.log('到底有没有行为呢？'+workerOrders[i].showWorker);
                            if(workerOrders[i].showWorker){
                                let actionObj={
                                    operationId:operations[i].id,
                                    start_time:(workerOrders[i].arrive_date_timestamp&&workerOrders[i].showArriveDate)?workerOrders[i].arrive_date_timestamp:null,
                                    call_time:(workerOrders[i].call_date_timestamp&&workerOrders[i].showWorker)?workerOrders[i].call_date_timestamp:null,
                                    end_time:(workerOrders[i].finish_date_timestamp&&workerOrders[i].showFinishDate)?workerOrders[i].finish_date_timestamp:null,
                                    operationStart:workerOrders[i].showArriveDate?1:0,
                                    operationComplete:workerOrders[i].showFinishDate?1:0,
                                    status:1,
                                    worker:workerOrders[i].worker
                                }
                                actions.push(actionObj)
                            }
                        }

                        return Action.bulkCreate(actions,{transaction:t}).then(function(actionResults){
                            console.log('完成了啊啊啊啊啊啊啊啊');
                            resolve(
                                ctx.body={
                                    status:0,
                                    message:response_config.createdSuccess
                                }
                            )

                        }).catch(()=>{
                            reject(
                                ctx.body={
                                    status:0,
                                    message:response_config.createdFailed
                                }
                            )
                        })
                    }).catch(()=>{
                        reject(
                            ctx.body={
                                status:0,
                                message:response_config.createdFailed
                            }
                        )
                    });
                }).catch((error)=>{
                    reject(
                        ctx.body={
                            status:0,
                            message:response_config.createdFailed
                        }
                    )
                });
            }
        )
    })
}

exports.delete=async(ctx,next)=>{

}

exports.getOrderNo=async(ctx,next)=>{
    let year=ctx.params.year;
    let month=ctx.params.month;
    let day=ctx.params.day;

    let no=await getOrderNoFun(year,month,day);

    ctx.body={
        status:0,
        data:no
    }
}

var getOrderNoFun=async(_year,_month,_day)=>{
    console.log(_year+' '+_month+' '+_day);
    let date=new Date(_year,_month-1,_day);
    let year=date.getFullYear().toString();
    let month=('0'+(date.getMonth()+1)).slice(('0'+(date.getMonth()+1)).length-2,('0'+(date.getMonth()+1)).length);
    let day=('0'+date.getDate()).slice(('0'+date.getDate()).length-2,('0'+date.getDate()).length);

    date.setHours(0,0,0,0);
    let dayStartTime=Date.parse(date.toDateString());
    let dayEndTime=dayStartTime+24*60*60*1000;

    console.log(dayStartTime);
    console.log(dayEndTime);


    let Order=model.orders;
    let count=await Order.count({
        where:{
            incoming_time:{
                $gte:dayStartTime,
                $lt:dayEndTime
            }
        }
    });
    console.log('得到的结果是什么啊？？？？？'+count);
    let noLast=('000'+count).slice(('000'+count).length-3,('000'+count).length);
    return year+month+day+noLast;
}

var getOperationNoSFun=async(_year,_month,_day,requestCount)=>{
    console.log(_year+' '+_month+' '+_day);
    let date=new Date(_year,_month-1,_day);
    let year=date.getFullYear().toString();
    let month=('0'+(date.getMonth()+1)).slice(('0'+(date.getMonth()+1)).length-2,('0'+(date.getMonth()+1)).length);
    let day=('0'+date.getDate()).slice(('0'+date.getDate()).length-2,('0'+date.getDate()).length);

    date.setHours(0,0,0,0);
    let dayStartTime=Date.parse(date.toDateString());
    let dayEndTime=dayStartTime+24*60*60*1000;

    let Operation=model.operations;
    let count=await Operation.count({
        where:{
            create_time:{
                $gte:dayStartTime,
                $lt:dayEndTime
            }
        }
    });

    let noArray=[];

    for(let i=0;i<requestCount;i++){
        let noLast=('000'+(count+i)).slice(('000'+(count+i)).length-3,('000'+(count+i)).length);
        noArray.push(year+month+day+noLast);
    }

    return noArray;
}
