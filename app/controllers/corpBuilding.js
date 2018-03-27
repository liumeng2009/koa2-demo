/**
 * Created by liumeng on 2017/7/25.
 */
const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const Sequelize = require('sequelize');
const auth=require('./authInRole');


exports.list=async(ctx,next)=>{
    let CorpBuilding = model.corpBuildings;
    let Building=model.buildings;

    CorpBuilding.belongsTo(Building);

    let corpid=ctx.params.corpid;

    let corpBuildingObj;

    corpBuildingObj=await CorpBuilding.findAll({
        where:{
            corporationId:corpid,
            status:1
        },
        include:[{
            model:Building
        }],
        order:[
            ['createdAt','DESC']
        ]
    });

    ctx.body={
        status:0,
        data:corpBuildingObj,
        total:0
    }
}

exports.save=async(ctx,next)=>{

    await auth.checkAuth(ctx.query.token,'corporation','edit');

    let corporationId=ctx.request.body.corporationId;
    let buildingId=ctx.request.body.buildingId.id;
    let floor=ctx.request.body.floor.value;
    let position=ctx.request.body.position.value;
    let id=ctx.request.body.id;


    let CorpBuilding=model.corpBuildings;

    if(corporationId!=''&buildingId!=''&position!=''){

    }
    else{
        throw new ApiError(ApiErrorNames.CORPBUILDING_NOT_NULL);
    }

    try{
        parseInt(floor);
    }
    catch(e){
        throw new ApiError(ApiErrorNames.INPUT_ERROR_TYPE);
    }


    //id存在，说明是编辑模式
    if(id){
        let corpBuildings=await CorpBuilding.findOne({
            where: {
                id: id
            }
        });
        console.log('found' + JSON.stringify(corpBuildings));
        if(corpBuildings){
            let corpBuildingsObj=corpBuildings;
            corpBuildingsObj.corporationId=corporationId;
            corpBuildingsObj.buildingId=buildingId;
            corpBuildingsObj.floor=floor;
            corpBuildingsObj.position=position;

            let saveResult= await corpBuildingsObj.save();
            console.log('update success'+JSON.stringify(saveResult));
            ctx.body={
                status:0,
                data:saveResult,
                message:response_config.updatedSuccess
            }
        }
        else{
            throw new ApiError(ApiErrorNames.CORP_BUILDING_NOT_EXIST);
        }

    }
    //id不存在，说明是新增模式
    else{
        console.log(corporationId+'和'+buildingId+'和'+JSON.stringify(floor)+'和'+position);
        let corpBuildingObj=await CorpBuilding.findAll({
            where:{
                corporationId:corporationId,
                buildingId:buildingId,
                floor:floor,
                position:position
            }
        })

        if(corpBuildingObj.length>0){
            throw new ApiError(ApiErrorNames.NEED_UNIQUE_CORP_BUILDING);
        }

        let createResult=await CorpBuilding.create({
            corporationId:corporationId,
            buildingId:buildingId,
            floor:floor,
            position:position,
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

exports.delete=async(ctx,next)=>{

    await auth.checkAuth(ctx.query.token,'corporation','delete');

    let id=ctx.params.id;
    let CorpBuilding=model.corpBuildings;
    let corpBuildingObj=await CorpBuilding.findOne({
        where:{
            status:1,
            id:id
        }
    })
    let OrderModel=model.orders;
    let orderResult=await OrderModel.findOne({
        where:{
            status:1,
            custom_position:id
        }
    })
    if(orderResult){
        throw new ApiError(ApiErrorNames.CORP_BUILDING_CAN_NOT_DELETE)
    }




    if(corpBuildingObj){
        corpBuildingObj.status=0;
        let deleteResult=await corpBuildingObj.save();
        ctx.body={
            status:0,
            data:deleteResult,
            message:response_config.deleteSucess
        }
    }
    else{
        throw new ApiError(ApiErrorNames.CORP_BUILDING_NOT_EXIST);
    }
}

exports.getData=async(ctx,next)=>{
    let CorpBuilding = model.corpBuildings;

    let id=ctx.params.id;

    let corpBuildingObj=await CorpBuilding.findOne({
        where:{
            status:1,
            id:id
        }
    });
    if(corpBuildingObj){
        ctx.body={
            status:0,
            data:corpBuildingObj
        }
    }
    else{
        throw new ApiError(ApiErrorNames.CORP_BUILDING_NOT_EXIST);
    }
}