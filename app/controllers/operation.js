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



    let searchObj={
        status:1
    }
    if(time&&time!='0'&&Date(time)){
        let startDate=new Date();
        startDate.setTime(time);
        let startDateStamp=Date.parse(startDate.toDateString());
        let endDateStamp=startDateStamp+1000*60*60*24-1;

        console.log(time);
        console.log(startDateStamp);
        console.log(endDateStamp);

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

    let total=await Operation.count({
        where:searchObj,
        include:[
            {
                model:Order,
                include:[
                    {
                        model:Corporation,
                        where:searchCorp
                    }
                ]
            }
        ]
    });

    if(pageid&&pageid!=0){
        let pageidnow=parseInt(pageid);
        operations=await Operation.findAll({
            where:searchObj,
            include:[{
                model:Order,
                required:true,
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
            },
            {
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
                ['no','ASC']
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
                ['no','ASC']
            ]
        })
    }
    ctx.body={
        status:0,
        data:operations,
        total:total
    }
}

exports.list_now=async(ctx,next)=>{
    let Operation=model.operations;
    let Action=model.actions;
    let Order=model.orders;
    let Corporation=model.corporations;
    let CorpBuilding=model.corpBuildings;
    let Building=model.buildings;
    let ActionModel=model.actions;
    let User=model.user;
    let BusinessContent=model.businessContents;


    let time=ctx.params.time;

    Operation.belongsTo(Order,{foreignKey:'orderId'});
    Order.belongsTo(Corporation,{foreignKey:'custom_corporation'});
    Order.belongsTo(CorpBuilding,{foreignKey:'custom_position'});
    CorpBuilding.belongsTo(Building,{foreignKey:'buildingId'});
    Operation.hasMany(ActionModel,{foreignKey:'operationId',as:'actions'});
    //ActionModel.belongsTo(Operation,{foreignKey:'operationId',as:'actions'})
    Operation.belongsTo(BusinessContent,{foreignKey:'op'});

    ActionModel.belongsTo(User,{foreignKey:'worker'});

    let operations;



    let searchObj={
        status:1
    }
    if(time&&time!='0'&&Date(time)){
        let startDate=new Date();
        startDate.setTime(time);
        let startDateStamp=Date.parse(startDate.toDateString());
        let endDateStamp=time;

        searchObj.$and=[
            {create_time:{'$gte':startDateStamp}},
            {create_time:{'$lte':endDateStamp}}
        ];
    }
    operations=await Operation.findAll({
        where:searchObj,
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
        },
        {
            model:BusinessContent
        },
        {
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
            ['no','ASC']
        ]
    })

    ctx.body={
        status:0,
        data:operations
    }
}

exports.list_week=async(ctx,next)=>{
    let time=ctx.params.time;
    let sequelize=db.sequelize;

    let Operation=model.operations;

/*    let result=await Operation.count({
        attributes:[
            [sequelize.fn('FROM_UNIXTIME', sequelize.col('create_time'),'%Y%m%d'), 'days']
        ],
        where:{
            status:1
        },
        group:'days'
    })*/
    //找到一周的时间起始点和结束点

    let timeOp=new Date();

    try{
        timeOp.setTime(time);
        console.log(timeOp);
        console.log(timeOp.toDateString());
    }
    catch(error){
        throw new ApiError(ApiErrorNames.INPUT_DATE_ERROR_TYPE);
    }

    let weekCount=timeOp.getDay();

    console.log(weekCount);

    let todayStart=new Date();
    todayStart.setFullYear(timeOp.getFullYear(),timeOp.getMonth(),timeOp.getDate());
    todayStart.setHours(0,0,0,0);
    console.log(todayStart.getTime());

    let weekStart=todayStart-(weekCount-1)*24*60*60*1000;
    let weekEnd=weekStart+7*24*60*60*1000;

    console.log(weekStart);
    console.log(weekEnd);



    let sql="select FROM_UNIXTIME(create_time/1000,'%Y%m%d') days,count(*) count from operations inner join actions on operations.id=actions.operationId where operations.status=1 and actions.operationComplete=1 and operations.create_time>="+weekStart+" and operations.create_time<"+weekEnd+" GROUP BY days;";

    let result=await sequelize.query(sql,{ plain : false,  raw : true,type:sequelize.QueryTypes.SELECT});

    //将一周数据补充完整

    let dayArray=[];
    for(let i=0;i<7;i++){
        let thisDayStart=weekStart+i*24*60*60*1000;
        let thisDayStartDate=new Date();
        thisDayStartDate.setTime(thisDayStart);
        let days=thisDayStartDate.getFullYear()+
            ((thisDayStartDate.getMonth()+1)<10?('0'+(thisDayStartDate.getMonth()+1)):(thisDayStartDate.getMonth()+1))+
            ((thisDayStartDate.getDate())<10?('0'+(thisDayStartDate.getDate())):(thisDayStartDate.getDate()));
        dayArray.push(days)
    }
    console.log(dayArray);

    for(let da of dayArray){
        if(result.length==0){
            result.push({days:da,count:0});
        }
        else{
            let index=0;
            for(let r of result){
                if(da===r.days){
                    break;
                }
                else{
                    if(index==result.length-1){
                        //新的
                        result.push({days:da,count:0});
                        break;
                    }
                }
                index++;
            }
        }

    }

    //最终将result进行排序
    for(let i=0;i<result.length;i++){
        for(let j=0;j<result.length-i-1;j++){
            if(result[j].days>result[j+1].days){
                let temp=result[j];
                result[j]=result[j+1];
                result[j+1]=temp;
            }
        }
    }

    //增加星期名称列
    for(let i=0;i<7;i++){
        switch(i){
            case 0:
                result[i].weekname='星期一';
                break;
            case 1:
                result[i].weekname='星期二';
                break;
            case 2:
                result[i].weekname='星期三';
                break;
            case 3:
                result[i].weekname='星期四';
                break;
            case 4:
                result[i].weekname='星期五';
                break;
            case 5:
                result[i].weekname='星期六';
                break;
            case 6:
                result[i].weekname='星期日';
                break;
            default:
                break;
        }

    }

    ctx.body={
        status:0,
        data:result
    }

}

exports.list_month=async(ctx,next)=>{
    let time=ctx.params.time;
    let sequelize=db.sequelize;

    let Operation=model.operations;

    /*    let result=await Operation.count({
     attributes:[
     [sequelize.fn('FROM_UNIXTIME', sequelize.col('create_time'),'%Y%m%d'), 'days']
     ],
     where:{
     status:1
     },
     group:'days'
     })*/
    //找到一周的时间起始点和结束点

    let timeOp=new Date();

    try{
        timeOp.setTime(time);
        console.log(timeOp);
        console.log(timeOp.toDateString());
    }
    catch(error){
        throw new ApiError(ApiErrorNames.INPUT_DATE_ERROR_TYPE);
    }


    let monthStart=new Date();
    monthStart.setFullYear(timeOp.getFullYear(),timeOp.getMonth(),1);
    monthStart.setHours(0,0,0,0);

    let monthEnd=new Date();
    monthEnd.setFullYear(timeOp.getFullYear(),(timeOp.getMonth()+1),1);
    monthEnd.setHours(0,0,0,0);

    console.log('开始：'+monthStart.toDateString());
    console.log('结束：'+monthEnd.toDateString());

    let monthStartStamp=monthStart.getTime();
    let monthEndStamp=monthEnd.getTime();

    console.log(monthStartStamp);
    console.log(monthEndStamp);



    let sql="select FROM_UNIXTIME(create_time/1000,'%Y%m%d') days,count(*) count from operations inner join actions on operations.id=actions.operationId where operations.status=1 and actions.operationComplete=1 and operations.create_time>="+monthStartStamp+" and operations.create_time<"+monthEndStamp+" GROUP BY days;";

    let result=await sequelize.query(sql,{ plain : false,  raw : true,type:sequelize.QueryTypes.SELECT});

    //将前面的数据补充完整

    let dayArray=[];
    for(let i=0;i<timeOp.getDate();i++){
        let thisDayStart=monthStartStamp+i*24*60*60*1000;
        let thisDayStartDate=new Date();
        thisDayStartDate.setTime(thisDayStart);
        let days=thisDayStartDate.getFullYear()+
            ((thisDayStartDate.getMonth()+1)<10?('0'+(thisDayStartDate.getMonth()+1)):(thisDayStartDate.getMonth()+1))+
            ((thisDayStartDate.getDate())<10?('0'+(thisDayStartDate.getDate())):(thisDayStartDate.getDate()));
        dayArray.push(days)
    }
    console.log(dayArray);

    for(let da of dayArray){
        if(result.length==0){
            result.push({days:da,count:0});
        }
        else{
            let index=0;
            for(let r of result){
                if(da===r.days){
                    break;
                }
                else{
                    if(index==result.length-1){
                        //新的
                        console.log('新的'+da);
                        result.push({days:da,count:0});
                        break;
                    }
                }
                index++;
            }
        }

    }

    console.log(JSON.stringify(result));

    //最终将result进行排序
    for(let i=0;i<result.length;i++){
        for(let j=0;j<result.length-i-1;j++){
            if(result[j].days>result[j+1].days){
                console.log('交换');
                let temp=result[j];
                result[j]=result[j+1];
                result[j+1]=temp;
            }
        }
    }

    for(let i=0;i<result.length;i++){
        result[i].monthname=(i+1)+'号';

    }

    ctx.body={
        status:0,
        data:result
    }
}

exports.list_month_worker=async(ctx,next)=>{
    let time=ctx.params.time;
    let timeOp=new Date();

    try{
        timeOp.setTime(time);
        console.log(timeOp);
        console.log(timeOp.toDateString());
    }
    catch(error){
        throw new ApiError(ApiErrorNames.INPUT_DATE_ERROR_TYPE);
    }


    let monthStart=new Date();
    monthStart.setFullYear(timeOp.getFullYear(),timeOp.getMonth(),1);
    monthStart.setHours(0,0,0,0);

    let monthEnd=new Date();
    monthEnd.setFullYear(timeOp.getFullYear(),(timeOp.getMonth()+1),0);
    monthEnd.setHours(0,0,0,0);

    console.log(monthStart.toDateString());
    console.log(monthEnd.toDateString());

    let monthStartStamp=monthStart.getTime();
    let monthEndStamp=time;

    let User=model.user;
    let ActionModel=model.actions;
    User.hasMany(ActionModel,{foreignKey:'worker',as:'actions'});
    ActionModel.belongsTo(User,{foreignKey:'worker'})
    let Operation=model.operations;
    ActionModel.belongsTo(Operation,{foreignKey:'operationId'});
    Operation.hasMany(ActionModel,{foreignKey:'operationId',as:'actions'})

    let sequelize=db.sequelize;


    let result=await Operation.findAll({
        attributes:[
            [sequelize.col('`actions.user`.`name`'),'user'],[sequelize.fn('COUNT', sequelize.col('operations.id')), 'count']
        ],
        where:{
            status:1,
            '$and':[
                {create_time:{'$gte':monthStartStamp}},
                {create_time:{'$lte':monthEndStamp}}
            ]
        },
        include:[
            {
                model:ActionModel,
                as:'actions',
                attributes:[],
                where:{
                    status:1
                },
                include:[
                    {
                        model:User,
                        attributes:[],
                        where:{
                            status:1
                        }
                    }
                ]
            }

        ],
        group:['`actions.user`.`name`','operations.id']
    })

    console.log(JSON.stringify(result));

    ctx.body={
        status:0,
        data:result
    }

}

exports.list_month_worker_time=async(ctx,next)=>{
    let time=ctx.params.time;
    let timeOp=new Date();

    try{
        timeOp.setTime(time);
        console.log(timeOp);
        console.log(timeOp.toDateString());
    }
    catch(error){
        throw new ApiError(ApiErrorNames.INPUT_DATE_ERROR_TYPE);
    }


    let monthStart=new Date();
    monthStart.setFullYear(timeOp.getFullYear(),timeOp.getMonth(),1);
    monthStart.setHours(0,0,0,0);

    let monthEnd=new Date();
    monthEnd.setFullYear(timeOp.getFullYear(),(timeOp.getMonth()+1),0);
    monthEnd.setHours(0,0,0,0);

    console.log(monthStart.toDateString());
    console.log(monthEnd.toDateString());

    let monthStartStamp=monthStart.getTime();
    let monthEndStamp=time;

    let ActionModel=model.actions;
    let User=model.user;
    ActionModel.belongsTo(User,{foreignKey:'worker'});

    let sequelize=db.sequelize;

/*    let result=await ActionModel.findAll({
        attributes:{
            include:[ [sequelize.col('`user`.`name`'),'user'],[sequelize.fn('SUM', sequelize.col('start_time')-sequelize.col('start_time')), 'count']],
            exclude: ['operationId','call_time','start_time','end_time','worker','operationStart','operationComplete','status','id','createdAt','updatedAt','version']
        },
        where:{
            status:1,
            '$and':[
                {start_time:{'$gte':monthStartStamp}},
                {end_time:{'$lte':monthEndStamp}}
            ]
        },
        include:[
            {
                model:User,
                attributes:[]
            }
        ],
        group:['`user`.`name`']
    });*/
    let sql='SELECT `user`.`name` AS `user`, SUM(`end_time`-`start_time`) AS `count` FROM `actions` AS `actions` LEFT OUTER JOIN `users` AS `user` ON `actions`.`worker` = `user`.`id` WHERE `actions`.`status` = 1 AND (`actions`.`start_time` >= '+monthStartStamp+' AND `actions`.`end_time` <= '+monthEndStamp+') GROUP BY `user`.`name`;';

    let result=await sequelize.query(sql,{ plain : false,  raw : true,type:sequelize.QueryTypes.SELECT});

    ctx.body={
        status:0,
        data:result
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

    let orderId=ctx.request.body.order;
    let noSubmit=ctx.request.body.no;
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
        let no='';
        if(noSubmit&&noSubmit!=''){
            no=noSubmit;
        }
        else{
            let operationNoArray=await orderController.getOperationNoSFun(orderIncomingDate.getFullYear(),orderIncomingDate.getMonth()+1,orderIncomingDate.getDate(),1);
            no=operationNoArray[0];
        }

        let saveResult=await Operation.create({
            orderId:orderId,
            important:important,
            op:op,
            no:no,
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
        if(1==0){
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