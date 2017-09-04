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

    let count=Order.count({
        where:{
            status:1
        }
    });

    let sequelize:db.sequelize;
    let sqlStr='select orders.id as id,corporations.name as corporationname,corpBuildings.floor as floor,corpBuildings.position as corpostion,buildings.name as buildingname' +
        ' from orders inner join corpBuildings on orders.custom_position=corpBuildings.id,corpBuildings inner join corporations on.corporationId=corporation.id,corpBuildings inner join Buildings on corpBuildings.buildingId=buildings.id ' +
        'where orders.status=1 ';
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
    sqlStr=sqlStr+' order by updatedAt desc;';

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
    let incoming_time=ctx.request.body.incoming_time;
    let custom_position=ctx.request.body.custom_position;
    let business_description=ctx.request.body.business_description;
    let remark=ctx.request.body.remark;

    let id=ctx.request.body.id;

    let Order=model.orders;

    if(custom_phone!=''&incoming_time!=''&custom_position!=''&business_description!=''){

    }
    else{
        throw new ApiError(ApiErrorNames.ORDER_ATTRIBUTE_NOT_NULL);
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
        orderObj.incoming_time=incoming_time;
        orderObj.custom_position=custom_position;
        orderObj.remark=remark;


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
            incoming_time:incoming_time,
            custom_position:custom_position,
            remark:remark,
            business_description:business_description,
            no:getOrderNo(incoming_time),
            status:1
        });
        console.log('created'+JSON.stringify(createResult));
        ctx.body={
            status:0,
            data:createResult,
            message:response_config.createdSuccess
        }
    }
}

exports.getOrderNo=async(ctx,next)=>{
    let incoming_time=ctx.params.intime;
    return getOrderNo(incoming_time);
}

var getOrderNo=async(incoming_time:number)=>{
    let date=new Date(incoming_time);
    let year=date.getYear().toString();
    let month=('0'+(date.getMonth()+1)).slice(2);
    let day=('0'+date.getDay()).slice(2);
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
    let noLast=('000'+count).slice(3);
    return year+month+day+noLast;

}
