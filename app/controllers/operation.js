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
const auth=require('./authInRole');

exports.list=async(ctx,next)=>{
    let Operation=model.operations;
    let Order=model.orders;
    let Corporation=model.corporations;
    let CorpBuilding=model.corpBuildings;
    let Building=model.buildings;
    let ActionModel=model.actions;
    let User=model.user;
    let BusinessContent=model.businessContents;

    let time=ctx.params.time;
    let corp=ctx.params.corp;
    let no=ctx.params.no;

    Operation.belongsTo(Order,{foreignKey:'orderId'});
    Order.belongsTo(Corporation,{foreignKey:'custom_corporation'});
    Order.belongsTo(CorpBuilding,{foreignKey:'custom_position'});
    CorpBuilding.belongsTo(Building,{foreignKey:'buildingId'});
    Operation.hasMany(ActionModel,{foreignKey:'operationId',as:'actions'});
    Operation.belongsTo(BusinessContent,{foreignKey:'op'});
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
                model:BusinessContent
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
            limit: sys_config.pageSize,
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

    weekCount=weekCount==0?7:weekCount;

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

//time是需要查询的最后一天 传入21日，则21日前的结果是正确的，否则会不太对
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

    let lastDay=new Date(monthEndStamp-1);
    console.log(lastDay);

    for(let i=0;i<lastDay.getDate();i++){
        console.log(i);
        let thisDayStart=monthStartStamp+i*24*60*60*1000;
        let thisDayStartDate=new Date();
        thisDayStartDate.setTime(thisDayStart);
        let days=thisDayStartDate.getFullYear()+
            ((thisDayStartDate.getMonth()+1)<10?('0'+(thisDayStartDate.getMonth()+1)):(thisDayStartDate.getMonth()+1))+
            ((thisDayStartDate.getDate())<10?('0'+(thisDayStartDate.getDate())):(thisDayStartDate.getDate()));
        dayArray.push(days)
    }
    console.log('ceshi'+dayArray);

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


/*    let result=await ActionModel.findAll({
        attributes:[
            [sequelize.col('`user`.`name`'),'user'],[sequelize.fn('COUNT', sequelize.col('actions.id')), 'count']
        ],
        where:{
            status:1
        },
        include:[
            {
                model:Operation,
                attributes:[],
                where:{
                    status:1,
                    '$and':[
                        {create_time:{'$gte':monthStartStamp}},
                        {create_time:{'$lte':monthEndStamp}}
                    ]
                }
            },
            {
                model:User,
                attributes:[],
                where:{
                    status:1
                }
            }
        ],
        group:['`user`.`name`','actions.id']
    })*/



    let result=await Operation.findAll({
/*        attributes:[
            [sequelize.col('`actions.user`.`name`'),'user'],[sequelize.fn('COUNT', sequelize.col('operations.id')), 'count']
        ],*/
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
                //attributes:[],
                where:{
                    status:1
                },
                include:[
                    {
                        model:User,
                        //attributes:[],
                        where:{
                            status:1
                        }
                    }
                ]
            }

        ]
        //group:['`actions.user`.`name`','operations.id']
    })


    console.log('我想看的数据是:'+JSON.stringify(result));

    let newResult=[];
    let operationArray=[];
    for(let os of result){
        for(let as of os.actions){
            if(newResult.length==0){
                newResult.push({name:as.user.name,count:1});
                operationArray.push({opId:as.operationId,name:as.user.name})
            }
            else{
                if(checkExist(as.user.name,newResult)){
                    let r=checkExist(as.user.name,newResult);
                    if(checkOperationArray(as.user.name,as.operationId,operationArray)){

                    }
                    else{
                        r.count++;
                        operationArray.push({opId:as.operationId,name:as.user.name})
                    }
                }
                else{
                    newResult.push({name:as.user.name,count:1});
                    operationArray.push({opId:as.operationId,name:as.user.name});
                }
            }
        }
    }
    ctx.body={
        status:0,
        data:newResult
    }

}

var checkExist=(name,array)=>{
    if(array.length==0){
        return false;
    }
    else{
        for(let a of array){
            if(a.name==name){
                return a;
            }
        }
    }
    return false;
}
var checkOperationArray=(name,opId,opArray)=>{
    for(let oa of opArray){
        console.log(oa.name+name+oa.opId+' '+opId);
        if(oa.name==name&&oa.opId==opId){
            return true;
        }
    }
    return false;
}


//查询时间段内每天某个人的工作时长
//SELECT `user`.`name` AS `user`,FROM_UNIXTIME(start_time/1000,'%Y%m%d') days, SUM(`end_time`-`start_time`)/60000 AS `分钟` FROM `actions` AS `actions` LEFT OUTER JOIN `users` AS `user` ON `actions`.`worker` = `user`.`id` WHERE `actions`.`status` = 1 AND (`actions`.`start_time` >= 1519833600000 AND `actions`.`end_time` <= 1521820800000) and `user`.name='朱亚亮' GROUP BY `user`.`name`,days;

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

exports.list_month_corporation_count=async(ctx,next)=>{

    let sequelize=db.sequelize;

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

    let Operation=model.operations;
    let Order=model.orders;
    Operation.belongsTo(Order,{foreignKey:'orderId'});
    let Corporation=model.corporations;
    Order.belongsTo(Corporation,{foreignKey:'custom_corporation'});
    let ActionModel=model.actions;
    Operation.hasMany(ActionModel,{foreignKey:'operationId',as:'actions'});

    Corporation.hasMany(Order,{foreignKey:'custom_corporation',as:'orders'});
    Order.hasMany(Operation,{foreignKey:'orderId',as:'operations'});

    let result=await Corporation.findAll({
        attributes:[
            'name',
            [sequelize.fn('COUNT', sequelize.col('orders.operations.id')), 'count']
        ],
        where:{
            status:1,
        },
        include:[
            {
                model:Order,
                as:'orders',
                attributes:[],
                where:{
                    status:1
                },
                include:[
                    {
                        model:Operation,
                        as:'operations',
                        where:{
                            status:1,
                            '$and':[
                                {create_time:{'$gte':monthStartStamp}},
                                {create_time:{'$lte':monthEndStamp}}
                            ]
                        },
                        attributes:[],
                        include:[
                            {
                                model:ActionModel,
                                attributes:[],
                                as:'actions',
                                where:{
                                    operationComplete:1
                                }
                            }
                        ]
                    }
                ]
            }
        ],
        group:['name','id']
    })



/*    let result=await Operation.findAll({
        attributes: [
            [sequelize.col('`order.corporation`.`name`'), 'corporation'],
            [sequelize.fn('COUNT', sequelize.col('operations.id')), 'count']
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
                model:Order,
                attributes:[],
                include:[
                    {
                        model:Corporation,
                        attributes:[]
                    }
                ]
            },
            {
                model:ActionModel,
                as:'actions',
                attributes:[],
                where:{
                    operationComplete:1
                }
            }
        ],
        group:['`order.corporation`.`name`']
    });*/

    ctx.body={
        status:0,
        data:result
    }

}

exports.getOperation=async(ctx,next)=>{
    let id=ctx.params.id;
    let Operation=model.operations;
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
    await auth.checkAuth(ctx.request.headers.authorization,'op','add');
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
    await auth.checkAuth(ctx.request.headers.authorization,'op','edit');
    let Operation=model.operations;
    let operationId=ctx.request.body.id;
    let op=ctx.request.body.businessContent.id;
    let remark=ctx.request.body.remark;
    let important=ctx.request.body.important;

    let operation=await Operation.findOne({
        where:{
            status:1,
            id:operationId
        }
    })

    if(operation){
        operation.op=op;
        operation.remark=remark;
        operation.important=important;

        let saveResult=await operation.save();

        ctx.body={
            status:0,
            data:saveResult,
            message:response_config.updatedSuccess
        }
    }
    else{
        throw new ApiError(ApiErrorNames.OPERATION_NOT_EXIST);
    }
}

//修改工单的某一个属性，为了APP设计
exports.editSimple=async(ctx,next)=>{
    await auth.checkAuth(ctx.request.headers.authorization,'op','edit');
    let action=ctx.request.body.action;
    let operationId=ctx.request.body.operationId;
    console.log(action);
    console.log(operationId);
    switch (action){
        case 'corporation':
            let corporationId=ctx.request.body.corporationId;
            let saveResult1=await editOperationCorporation(operationId,corporationId);
            ctx.body={
                status:0,
                data:saveResult1,
                message:response_config.updatedSuccess
            }
            break;
        case 'phone':
            let phone=ctx.request.body.inputValue;
            let saveResult2=await editOperationPhone(operationId,phone);
            ctx.body={
                status:0,
                data:saveResult2,
                message:response_config.updatedSuccess
            }
            break;
        case 'customname':
            let customname=ctx.request.body.inputValue;
            let saveResult3=await editOperationUser(operationId,customname);
            ctx.body={
                status:0,
                data:saveResult3,
                message:response_config.updatedSuccess
            }
            break;
        case 'op':
            console.log(333333333+operationId);
            let businessId=ctx.request.body.business;
            let saveResult4=await editOperationOp(operationId,businessId);
            ctx.body={
                status:0,
                data:saveResult4,
                message:response_config.updatedSuccess
            }
            break;
        case 'important':
            console.log(333333333+operationId);
            let important=ctx.request.body.inputValue;
            console.log(important);
            let saveResult5=await editOperationImportant(operationId,important);
            ctx.body={
                status:0,
                data:saveResult5,
                message:response_config.updatedSuccess
            }
            break;
        case 'mark':
            let remark=ctx.request.body.inputValue;
            let saveResult6=await editOperationMark(operationId,remark);
            ctx.body={
                status:0,
                data:saveResult6,
                message:response_config.updatedSuccess
            }
            break;
        default:
            throw new ApiError(ApiErrorNames.INPUT_FIELD_NULL,['编辑项']);
            break;
    }
}

var editOperationCorporation=async function(operationId,corporationId){
    let OperationModel=model.operations;
    let OrderModel=model.orders;
    let CorporationModel=model.corporations;
    let CorpBuildingModel=model.corpBuildings;
    OperationModel.belongsTo(OrderModel,{foreignKey:'orderId'});
    OrderModel.hasMany(OperationModel,{foreignKey:'orderId',as:'operations'});
    CorporationModel.hasMany(CorpBuildingModel,{foreignKey:'corporationId',as:'buildings'});

    let operationExist=await OperationModel.findOne({
        where:{
            status:1,
            id:operationId
        }
    })
    if(operationExist){

    }
    else{
        throw new ApiError(ApiErrorNames.OPERATION_NOT_EXIST);
    }

    let corporationExist=await CorporationModel.findOne({
        where:{
            status:1,
            id:corporationId
        },
        include:[
            {
                model:CorpBuildingModel,
                as:'buildings'
            }
        ]
    })
    let buildingId;
    if(corporationExist){
        if(corporationExist.buildings&&corporationExist.buildings.length>0){
            buildingId=corporationExist.buildings[0].id;
            console.log(buildingId);
        }
    }
    else{
        throw new ApiError(ApiErrorNames.CORPORATION_NOT_EXIST);
    }

    let orderObj=await OrderModel.findOne({
        where:{
            status:1
        },
        include:[
            {
                model:OperationModel,
                as:'operations',
                where:{
                    id:operationId,
                    status:1
                }
            }
        ]
    })

    console.log(corporationId+'   '+buildingId);

    orderObj.custom_corporation=corporationId;
    orderObj.custom_position=buildingId;

    let saveObj=await orderObj.save();

    return saveObj;

}

var editOperationPhone=async function(operationId,phone){
    let OperationModel=model.operations;
    let OrderModel=model.orders;
    OperationModel.belongsTo(OrderModel,{foreignKey:'orderId'});
    OrderModel.hasMany(OperationModel,{foreignKey:'orderId',as:'operations'});


    let operationExist=await OperationModel.findOne({
        where:{
            status:1,
            id:operationId
        }
    })
    if(operationExist){

    }
    else{
        throw new ApiError(ApiErrorNames.OPERATION_NOT_EXIST);
    }


    let orderObj=await OrderModel.findOne({
        where:{
            status:1
        },
        include:[
            {
                model:OperationModel,
                as:'operations',
                where:{
                    id:operationId,
                    status:1
                }
            }
        ]
    })

    orderObj.custom_phone=phone;

    let saveObj=await orderObj.save();

    return saveObj;

}

var editOperationUser=async function(operationId,customname){
    let OperationModel=model.operations;
    let OrderModel=model.orders;
    OperationModel.belongsTo(OrderModel,{foreignKey:'orderId'});
    OrderModel.hasMany(OperationModel,{foreignKey:'orderId',as:'operations'});


    let operationExist=await OperationModel.findOne({
        where:{
            status:1,
            id:operationId
        }
    })
    if(operationExist){

    }
    else{
        throw new ApiError(ApiErrorNames.OPERATION_NOT_EXIST);
    }


    let orderObj=await OrderModel.findOne({
        where:{
            status:1
        },
        include:[
            {
                model:OperationModel,
                as:'operations',
                where:{
                    id:operationId,
                    status:1
                }
            }
        ]
    })


    orderObj.custom_name=customname;

    let saveObj=await orderObj.save();

    return saveObj;

}

var editOperationOp=async function(operationId,opId){
    console.log('222222'+operationId);
    let OperationModel=model.operations;
    let BusinessContentModel=model.businessContents;

    let opExist=await BusinessContentModel.findOne({
        where:{
            status:1,
            id:opId
        }
    })
    if(opExist){

    }
    else{
        throw new ApiError(ApiErrorNames.BUSINESS_NOT_EXIST);
    }

    let operationExist=await OperationModel.findOne({
        where:{
            status:1,
            id:operationId
        }
    })
    if(operationExist){
        operationExist.op=opId;
        let saveObj=await operationExist.save();
        return saveObj;
    }
    else{
        throw new ApiError(ApiErrorNames.OPERATION_NOT_EXIST);
    }






}

var editOperationImportant=async function(operationId,important){
    let OperationModel=model.operations;
    let operationExist=await OperationModel.findOne({
        where:{
            status:1,
            id:operationId
        }
    })
    if(operationExist){
        operationExist.important=important;
        let saveObj=await operationExist.save();
        return saveObj;
    }
    else{
        throw new ApiError(ApiErrorNames.OPERATION_NOT_EXIST);
    }
}

var editOperationMark=async function(operationId,mark){
    let OperationModel=model.operations;
    let operationExist=await OperationModel.findOne({
        where:{
            status:1,
            id:operationId
        }
    })
    console.log(mark);
    if(operationExist){
        operationExist.remark=mark;
        let saveObj=await operationExist.save();
        return saveObj;
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
    await auth.checkAuth(ctx.query.token,'op','delete');
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


//一些sql语句
//某时间段内，各公司的工单数
//select COUNT(operations.id),FROM_UNIXTIME(operations.create_time/1000,'%Y%m') days,corporations.name from operations INNER JOIN orders on operations.orderId=orders.id INNER JOIN corporations on orders.custom_corporation=corporations.id where operations.status=1  and operations.create_time>='1496246400000' and operations.create_time<'1530374400000' GROUP BY days,corporations.name order by corporations.name;
//某时间段内，各公司的工时数
//SELECT `user`.`name` AS `user`,FROM_UNIXTIME(start_time/1000,'%Y%m') days, SUM(`end_time`-`start_time`)/60000 AS `分钟` FROM `actions` AS `actions` LEFT OUTER JOIN `users` AS `user` ON `actions`.`worker` = `user`.`id` WHERE `actions`.`status` = 1 AND (`actions`.`start_time` >= 1519833600000 AND `actions`.`end_time` <= 1521820800000) and `user`.name='朱亚亮' GROUP BY `user`.`name`,days;

//select COUNT(operations.id),FROM_UNIXTIME(operations.create_time/1000,'%Y%m') days,corporations.name from operations INNER JOIN orders on operations.orderId=orders.id INNER JOIN corporations on orders.custom_corporation=corporations.id where operations.status=1  and operations.create_time>='1496246400000' and operations.create_time<'1530374400000' GROUP BY days,corporations.name order by days;

//select FROM_UNIXTIME(start_time/1000,'%Y%m') days, SUM(`end_time`-`start_time`)/60000 AS `分钟`,corporations.name from actions INNER JOIN operations on actions.operationId=operations.id INNER JOIN orders on operations.orderId=orders.id INNER JOIN corporations on orders.custom_corporation=corporations.id where actions.`status`=1 and operations.status=1 group by days,corporations.name order by days;

//select FROM_UNIXTIME(operations.create_time/1000,'%Y%m') days,corporations.name,COUNT(businesscontents.equipment),businesscontents.equipment from businesscontents INNER JOIN operations on businesscontents.id=operations.op inner join orders on operations.orderId=orders.id INNER JOIN corporations on orders.custom_corporation=corporations.id where operations.status=1 and corporations.name='建设公司' group by days,corporations.name,businesscontents.equipment order by days;

//时间段内，某人工时数
//select SUM(`end_time`-`start_time`)/3600000 AS `分钟` from actions INNER JOIN operations on actions.operationId=operations.id INNER JOIN users on actions.worker=users.id INNER JOIN orders on operations.orderId=orders.id INNER JOIN corporations on orders.custom_corporation=corporations.id where actions.`status`=1 and operations.status=1 and operations.create_time>='1514736000000' and operations.create_time<'1530374400000' and users.name='朱亚亮';
//时间段内，某人工单数
//select count(Operations.id) from Operations INNER JOIN Actions on actions.operationId=operations.id INNER JOIN users on actions.worker=users.id where operations.status=1 and operations.create_time>='1514736000000' and operations.create_time<'1530374400000' and users.name='朱亚亮';

//带一个时间参数，查询当天的未完成工单，没有参数的话，就默认当天的
exports.workingOperationList=async(ctx,next)=>{
    let userid=ctx.query.userid;
    let selectStamp=ctx.query.stamp;

    let startDate;
    let endDate;
    if(selectStamp&&selectStamp!=''){
        let dateQuery=new Date(selectStamp*1000);
        startDate=new Date(dateQuery.getFullYear(),dateQuery.getMonth(),dateQuery.getDate(),0,0,0);
        endDate=new Date(dateQuery.getFullYear(),dateQuery.getMonth(),dateQuery.getDate(),23,59,59);
    }
    else{
        let dateQuery=new Date();
        startDate=new Date(dateQuery.getFullYear(),dateQuery.getMonth(),dateQuery.getDate(),0,0,0);
        endDate=new Date(dateQuery.getFullYear(),dateQuery.getMonth(),dateQuery.getDate(),23,59,59);
    }

    let OperationModel=model.operations;
    let ActionModel=model.actions;
    let OrderModel=model.orders;
    let UserModel=model.user;
    let BusinessContent=model.businessContents;
    let CorporationModel=model.corporations;
    let EquipOpModel=model.equipOps;

    OperationModel.hasMany(ActionModel,{foreignKey:'operationId',as:'actions'});
    OperationModel.belongsTo(OrderModel,{foreignKey:'orderId'});
    OrderModel.belongsTo(CorporationModel,{foreignKey:'custom_corporation'});
    ActionModel.belongsTo(UserModel,{foreignKey:'worker'});
    OperationModel.belongsTo(BusinessContent,{foreignKey:'op'});
    BusinessContent.belongsTo(EquipOpModel,{foreignKey:'operation',targetKey:'code'});
    OrderModel.hasMany(OperationModel,{foreignKey:'orderId',as:'operations'});


    let result=await OperationModel.findAll({
        where:{
            status:1,
            $and:[
                {create_time:{'$gte':startDate.getTime()}},
                {create_time:{'$lte':endDate.getTime()}}
            ]
        },
        include:[
            {
                model:ActionModel,
                as:'actions',
                where:{
                    operationComplete:1,
                    status:1
                }
            }
        ]
    })

    console.log(result);
    let otherArray=['1'];
    for(let r of result){
        console.log(r);
        otherArray.push(r.id);
    }


    let orderObj=await OrderModel.findAll({
        where:{
            status:1
        },
        include:[
            {
                model:OperationModel,
                where:{
                    status:1,
                    id:{
                        $notIn:otherArray
                    },
                    $and:[
                        {create_time:{'$gte':startDate.getTime()}},
                        {create_time:{'$lte':endDate.getTime()}}
                    ]
                },
                as:'operations',
                include:[
                    {
                        model:BusinessContent,
                        include:[
                            {
                                model:EquipOpModel
                            }
                        ]
                    },
                    {
                        model:ActionModel,
                        as:'actions',
                        where:{
                            status:1
                        },
                        include:[
                            {
                                model:UserModel,
                                where:{
                                    id:userid
                                }
                            }
                        ]
                    }
                ]
            },
            {
                model:CorporationModel
            }
        ],
        order:[
            ['incoming_time','ASC']
        ]
    })

    ctx.body={
        status:0,
        data:orderObj,
        total:orderObj.length
    }

}

exports.doneOperationList=async(ctx,next)=>{
    let userid=ctx.query.userid;
    let selectStamp=ctx.query.stamp;

    let startDate;
    let endDate;
    if(selectStamp&&selectStamp!=''){
        let dateQuery=new Date(selectStamp*1000);
        startDate=new Date(dateQuery.getFullYear(),dateQuery.getMonth(),dateQuery.getDate(),0,0,0);
        endDate=new Date(dateQuery.getFullYear(),dateQuery.getMonth(),dateQuery.getDate(),23,59,59);
    }
    else{
        let dateQuery=new Date();
        startDate=new Date(dateQuery.getFullYear(),dateQuery.getMonth(),dateQuery.getDate(),0,0,0);
        endDate=new Date(dateQuery.getFullYear(),dateQuery.getMonth(),dateQuery.getDate(),23,59,59);
    }

    let OperationModel=model.operations;
    let ActionModel=model.actions;
    let OrderModel=model.orders;
    let CorporationModel=model.corporations;
    let UserModel=model.user;
    let BusinessContent=model.businessContents;
    let EquipOpModel=model.equipOps;

    OperationModel.hasMany(ActionModel,{foreignKey:'operationId',as:'actions'});
    OperationModel.belongsTo(OrderModel,{foreignKey:'orderId'});
    OrderModel.belongsTo(CorporationModel,{foreignKey:'custom_corporation'});
    ActionModel.belongsTo(UserModel,{foreignKey:'worker'})
    OperationModel.belongsTo(BusinessContent,{foreignKey:'op'});
    BusinessContent.belongsTo(EquipOpModel,{foreignKey:'operation',targetKey:'code'});


    let result=await OperationModel.findAll({
        where:{
            status:1,
            $and:[
                {create_time:{'$gte':startDate.getTime()}},
                {create_time:{'$lte':endDate.getTime()}}
            ]
        },
        include:[
            {
                model:ActionModel,
                as:'actions',
                where:{
                    operationComplete:1,
                    status:1
                }
            }
        ]
    })

    console.log(result);
    let otherArray=['1'];
    for(let r of result){
        console.log(r);
        otherArray.push(r.id);
    }

    let orderObj=await OrderModel.findAll({
        where:{
            status:1
        },
        include:[
            {
                model:OperationModel,
                where:{
                    status:1,
                    id:{
                        $in:otherArray
                    },
                    $and:[
                        {create_time:{'$gte':startDate.getTime()}},
                        {create_time:{'$lte':endDate.getTime()}}
                    ]
                },
                as:'operations',
                include:[
                    {
                        model:BusinessContent,
                        include:[
                            {
                                model:EquipOpModel
                            }
                        ]
                    },
                    {
                        model:ActionModel,
                        as:'actions',
                        where:{
                            status:1
                        },
                        include:[
                            {
                                model:UserModel,
                                where:{
                                    id:userid
                                }
                            }
                        ]
                    }
                ]
            },
            {
                model:CorporationModel
            }
        ],
        order:[
            ['incoming_time','ASC']
        ]
    })

    ctx.body={
        status:0,
        data:orderObj,
        total:orderObj.length
    }
}


exports.operationCount=async(ctx,next)=>{
    let userid=ctx.query.userid;
    let selectStamp=ctx.query.stamp;

    let startDate;
    let endDate;
    if(selectStamp&&selectStamp!=''){
        let dateQuery=new Date(selectStamp*1000);
        startDate=new Date(dateQuery.getFullYear(),dateQuery.getMonth(),dateQuery.getDate(),0,0,0);
        endDate=new Date(dateQuery.getFullYear(),dateQuery.getMonth(),dateQuery.getDate(),23,59,59);
    }
    else{
        let dateQuery=new Date();
        startDate=new Date(dateQuery.getFullYear(),dateQuery.getMonth(),dateQuery.getDate(),0,0,0);
        endDate=new Date(dateQuery.getFullYear(),dateQuery.getMonth(),dateQuery.getDate(),23,59,59);
    }

    let OperationModel=model.operations;
    let ActionModel=model.actions;
    let OrderModel=model.orders;
    let CorporationModel=model.corporations;
    let UserModel=model.user;

    OperationModel.hasMany(ActionModel,{foreignKey:'operationId',as:'actions'});
    OperationModel.belongsTo(OrderModel,{foreignKey:'orderId'});
    OrderModel.belongsTo(CorporationModel,{foreignKey:'custom_corporation'});
    ActionModel.belongsTo(UserModel,{foreignKey:'worker'})


    let result=await OperationModel.findAll({
        where:{
            status:1,
            $and:[
                {create_time:{'$gte':startDate.getTime()}},
                {create_time:{'$lte':endDate.getTime()}}
            ]
        },
        include:[
            {
                model:ActionModel,
                as:'actions',
                where:{
                    operationComplete:1,
                    status:1
                }
            }
        ]
    })

    console.log(result);
    let otherArray=['1'];
    for(let r of result){
        console.log(r);
        otherArray.push(r.id);
    }

    let operationCountDone=await OperationModel.count({
        where:{
            status:1,
            id:{
                $in:otherArray
            },
            $and:[
                {create_time:{'$gte':startDate.getTime()}},
                {create_time:{'$lte':endDate.getTime()}}
            ]
        },
        include:[
            {
                model:ActionModel,
                as:'actions',
                where:{
                    status:1
                },
                include:[
                    {
                        model:UserModel,
                        where:{
                            id:userid
                        }
                    }
                ]
            }

        ]
    });

    let operationCountWorking=await OperationModel.count({
        where:{
            status:1,
            id:{
                $notIn:otherArray
            },
            $and:[
                {create_time:{'$gte':startDate.getTime()}},
                {create_time:{'$lte':endDate.getTime()}}
            ]
        },
        include:[
            {
                model:ActionModel,
                as:'actions',
                where:{
                    status:1
                },
                include:[
                    {
                        model:UserModel,
                        where:{
                            id:userid
                        }
                    }
                ]
            }

        ]
    });

    ctx.body={
        status:0,
        data:{
            working:operationCountWorking,
            done:operationCountDone,
            all:operationCountWorking+operationCountDone
        }
    }
}