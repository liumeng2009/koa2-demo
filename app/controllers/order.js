/**
 * Created by liumeng on 2017/8/31.
 */
const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const db=require('../db');

exports.list=async(ctx,next)=>{
    let pageid=ctx.params.pageid;
    let Order=model.orders;

    let count=await Order.count({
        where:{
            status:1
        }
    });

    let sequelize=db.sequelize;
    let sqlStr=`select
    orders.id as id,
    corporations.name as corporationname,
    corpbuildings.floor as floor,
    corpbuildings.position as corpostion,
    buildings.name as buildingname,
    orders.custom_phone,
    orders.important,
    orders.no
    from orders inner join corpbuildings on orders.custom_position=corpbuildings.id INNER JOIN corporations on corporationId=corporations.id inner join Buildings on corpbuildings.buildingId=buildings.id
    where orders.status=1 order by orders.updatedAt desc `
    let orders;

    if(pageid&&pageid!=0){
        try{
            let pageidnow=parseInt(pageid);
            let limit1=(pageidnow-1)*sys_config.pageSize;
            let limit2=(pageidnow)*sys_config.pageSize;
            sqlStr=sqlStr+'limit '+limit1+','+limit2;
        }
        catch(e){

        }
    }
    else{

    }
    sqlStr=sqlStr+';';

    orders=await sequelize.query(sqlStr,{ plain : false,  raw : true,type:sequelize.QueryTypes.SELECT});

    ctx.body={
        status:0,
        data:orders,
        total:count
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
            business_description:business_description,
            no:await getOrderNoFun(incomingDate.getFullYear(),incomingDate.getMonth()+1,incomingDate.getDate()),
            status:1,
            important:important,
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
    console.log(year+'年'+month+'月'+day+'日');
    let dayStartTime=Date.parse(new Date(date.getYear(),date.getMonth(),date.getDay(),0,0,0).toString());
    let dayEndTime=new Date(dayStartTime+24*60*60*1000);
    let Order=model.orders;
    let count=await Order.findAll({
        where:{
            incoming_time:{
                $gte:dayStartTime,
                $lt:dayEndTime
            }
        }
    });
    let noLast=('000'+count).slice(('000'+count).length-3,('000'+count).length);
    return year+month+day+noLast;

}
