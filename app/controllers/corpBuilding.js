/**
 * Created by liumeng on 2017/7/25.
 */
const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const Sequelize = require('sequelize');

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
            ['updatedAt','DESC']
        ]
    });

    ctx.body={
        status:0,
        data:corpBuildingObj,
        total:0
    }
}

exports.save=async(ctx,next)=>{
    let corporationId=ctx.request.body.corporationId;
    let buildingId=ctx.request.body.buildingId;
    let floor=ctx.request.body.floor;
    let position=ctx.request.body.position;
    let id=ctx.request.body.id;

    let CorpBuilding=model.corpBuildings;

    if(corporationId!=''&buildingId!=''&floor!=''&position!=''){

    }
    else{
        throw new ApiError(ApiErrorNames.CORPORATION_NOT_NULL);
    }


    //id存在，说明是编辑模式
    if(id){
        let corpBuildings=await CorpBuilding.findOne({
            where: {
                id: id
            }
        });
        console.log('found' + JSON.stringify(corporations));
        let corpBuildingsObj=corpBuildings;
        corpBuildingsObj.corporationId=corporationId;
        corpBuildingsObj.buildingId=buildingId;
        corpBuildingsObj.floor=floor;
        corpBuildingsObj.position=position;

        let saveResult= await corpBuildingsObj.save();
        console.log('update success'+JSON.stringify(saveResult));
        ctx.body={
            status:0,
            data:saveResult
        }
    }
    //id不存在，说明是新增模式
    else{
        let corpBuildingObj=await CorpBuilding.findAll({
            where:{
                name:name
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
            data:createResult
        }
    }
}

exports.delete=async(ctx,next)=>{
    let id=ctx.params.id;
    let CorpBuilding=model.corpBuildings;
    let corpBuildingObj=await CorpBuilding.findOne({
        where:{
            status:1,
            id:id
        }
    })
    if(corpBuildingObj){
        corpBuildingObj.status=0;
        let deleteResult=await corpBuildingObj.save();
        ctx.body={
            status:0,
            data:deleteResult
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