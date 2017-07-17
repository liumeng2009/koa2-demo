/**
 * Created by liumeng on 2017/7/7.
 */
const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const Sequelize = require('sequelize');

exports.list=async(ctx,next)=>{
    let Building = model.buildings;

    let pageid=ctx.params.pageid;


    let count=await Building.count({
        where:{
            status:1
        }
    });
    //let count=buildingCountObj.get('count');

    let buildingObj;

    if(pageid&&pageid!=0){
        try{
            let pageidnow=parseInt(pageid);
            buildingObj=await Building.findAll({
                where:{
                    status:1
                },
                order:[
                    ['updatedAt','DESC']
                ],
                offset: (pageidnow-1)*sys_config.pageSize,
                limit: sys_config.pageSize
            });
        }
        catch(e){
            buildingObj=await Building.findAll({
                where:{
                    status:1
                },
                order:[
                    ['updatedAt','DESC']
                ]
            });
        }
    }
    else{
        buildingObj=await Building.findAll({
            where:{
                status:1
            },
            order:[
                ['updatedAt','DESC']
            ]
        });
    }
    ctx.body={
        status:0,
        data:buildingObj,
        total:count
    }
}

exports.save=async(ctx,next)=>{
    let name=ctx.request.body.name;
    let address=ctx.request.body.address;
    let minfloor=ctx.request.body.minfloor;
    let maxfloor=ctx.request.body.maxfloor;
    let id=ctx.request.body.id;

    let Buildings=model.buildings;

    if(name!=''&address!=''&minfloor!=''&minfloor!=0&maxfloor!=''&maxfloor!=0){

    }
    else{
        throw new ApiError(ApiErrorNames.BUILDING_NOT_NULL);
    }

    try{
        let testMinFloor=parseInt(minfloor);
        let testMaxFloor=parseInt(maxfloor);
    }
    catch(e){
        throw new ApiError(ApiErrorNames.INPUT_ERROR_TYPE)
    }

    if(parseInt(minfloor)>parseInt(maxfloor)){
        throw new ApiError(ApiErrorNames.MAX_AND_MIN)
    }

    //id存在，说明是编辑模式
    if(id){
        let buildings=await Buildings.findAll({
            where: {
                id: id
            }
        });
        console.log('found' + JSON.stringify(operation));
        let buildingsObj=buildings[0];
        buildingsObj.name=name;
        buildingsObj.address=address;
        buildingsObj.minfloor=minfloor;
        buildingsObj.maxfloor=maxfloor;

        let saveResult= await buildingsObj.save();
        console.log('update success'+JSON.stringify(saveResult));
        ctx.body={
            status:0,
            data:saveResult
        }
    }
    //id不存在，说明是新增模式
    else{
        let buildingObj=await Buildings.findAll({
            where:{
                name:name
            }
        })

        if(buildingObj.length>0){
            throw new ApiError(ApiErrorNames.NEED_UNIQUE_BUILDING_NAME);
        }

        let createResult=await Buildings.create({
            name:name,
            address:address,
            minfloor:minfloor,
            maxfloor:maxfloor,
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
    let Building=model.buildings;
    let buildingObj=await Building.findOne({
        where:{
            status:1,
            id:id
        }
    })
    if(buildingObj){
        buildingObj.status=0;
        let deleteResult=await buildingObj.save();
        ctx.body={
            status:0,
            data:deleteResult
        }
    }
    else{
        throw new ApiError(ApiErrorNames.BUILDING_NOT_EXIST);
    }
}