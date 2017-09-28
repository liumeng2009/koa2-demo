/**
 * Created by liumeng on 2017/8/24.
 */
const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const db=require('../db');

exports.list=async(ctx,next)=>{
    let BusinessContent=model.businessContents;

    let pageid=ctx.params.pageid;
    let type=ctx.query.type;
    let equipment=ctx.query.equipment;

    let strWhere=' where status=1 ';

    let searchObj={
        status:1
    }
    if(type&&type!=''){
        searchObj.type=type;
        strWhere+=" and equiptypes.code='"+type+"'";
    }
    if(equipment&&equipment!=''){
        strWhere+=" and businessContents.equipment='"+equipment+"'";
        searchObj.equipment=equipment;
    }

    let count=await BusinessContent.count({
        where:searchObj
    });

    let contents;

    let strSql='select businessContents.*,equiptypes.name as equiptypesname,equipops.name as equipopsname from businessContents inner join equiptypes on businessContents.type=equiptypes.code inner join equipops on businessContents.operation=equipops.code'+strWhere;
    let orderStr=' order by businessContents.updatedAt desc ';

    let sequelize=db.sequelize;

    if(pageid&&pageid!=0){
        try{
            let pageidnow=parseInt(pageid);

            let limitStr='limit '+sys_config.pageSize+' offset '+(pageidnow-1)*sys_config.pageSize;

            contents=await sequelize.query(strSql+orderStr+limitStr,{ plain : false,  raw : true,type:sequelize.QueryTypes.SELECT});
        }
        catch(e){
            contents=await sequelize.query(strSql+orderStr,{ plain : false,  raw : true,type:sequelize.QueryTypes.SELECT});
        }
    }
    else{
        contents=await sequelize.query(strSql+orderStr,{ plain : false,  raw : true,type:sequelize.QueryTypes.SELECT});
    }
    ctx.body={
        status:0,
        data:contents,
        total:count
    }
}

exports.save=async(ctx,next)=>{
    let BusinessContent=model.businessContents;
    let type=ctx.request.body.type;
    let equipment=ctx.request.body.equipment;
    let operations=ctx.request.body.operations;

    if(operations==null||operations.length==0){
        throw new ApiError(ApiErrorNames.BUSINESS_OPERATION_NULL);
    }
    if(equipment==null||equipment==''){
        throw new ApiError(ApiErrorNames.BUSINESS_EQUIPMENT_NULL);
    }

    let deleteResult=await BusinessContent.destroy({
        where:{
            equipment:equipment,
            type:type
        }
    });
    console.log(deleteResult);

    let businessArray=[];

    for(let operation of operations){
        if(operation.checked){
            let businessObj={
                type:type,
                equipment:equipment,
                operation:operation.op,
                status:1,
                weight:operation.weight,
                remark:operation.remark
            }
            businessArray.push(businessObj);
        }
    }
    let saveResult=await BusinessContent.bulkCreate(businessArray,{validate:true,returning:true,individualHooks:true});

    ctx.body={
        status:0,
        data:saveResult,
        message:response_config.createdSuccess
    }
}

exports.get=async(ctx,next)=>{
    let BusinessContent=model.businessContents;
    let id=ctx.params.id;
    console.log(id);
    var busiObj=await BusinessContent.findOne({
        where:{
            id:id
        }
    });
    if(busiObj){
        let equipment=busiObj.equipment;
        let type=busiObj.type;
        var businesses=await BusinessContent.findAll({
            where:{
                equipment:equipment,
                type:type
            }
        })
        console.log('1111111111'+businesses);
        ctx.body={
            status:0,
            data:businesses
        }
    }
    else{
        throw new ApiError(ApiErrorNames.BUSINESS_NOT_EXIST);
    }
}

exports.getEquipment=async(ctx,next)=>{
    let BusinessContent=model.businessContents;
    let type=ctx.params.typename;
    if(type&&type!=''){
        let obj=await BusinessContent.findAll({
            attributes:['equipment'],
            where:{
                type:type
            },
            group: 'equipment'
        })
        ctx.body={
            status:0,
            data:obj
        }
    }
    else{
        let obj=await BusinessContent.findAll({
            attributes:['equipment'],
            group: ['equipment']
        })
        ctx.body={
            status:0,
            data:obj
        }
    }
}

exports.delete=async(ctx,next)=>{
    let id=ctx.params.id;
    let BusinessContent=model.businessContents;
    let busiObj=await BusinessContent.findAll({
        where: {
            id: id
        }
    })

    if(busiObj){
        let deleteResult=await busiObj[0].destroy();
        ctx.body={
            status:0,
            data:deleteResult,
            message:response_config.deleteSucess
        }
    }
    else{
        throw new ApiError(ApiErrorNames.BUSINESS_NOT_EXIST)
    }
}



