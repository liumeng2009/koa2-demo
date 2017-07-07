/**
 * Created by liumeng on 2017/7/7.
 */
const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');

exports.list=async(ctx,next)=>{

    console.log(111);

    let Building = model.buildings;

    console.log(Building);

    let buildingObj=await Building.findAll({

    });
    ctx.body={
        status:0,
        data:buildingObj
    }
}

exports.save=async(ctx,next)=>{
    let name=ctx.request.body.name;
    let address=ctx.request.body.address;
    let minfloor=ctx.request.body.minfloor;
    let maxfloor=ctx.request.body.maxfloor;
    let id=ctx.request.body.id;

    let Buildings=model.buildings;

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
        //promise
        let createResult=await Operation.create({
            name:name,
            address:code,
            minfloor:minfloor,
            maxfloor:maxfloor
        });
        console.log('created'+JSON.stringify(createResult)+'test the password');
        ctx.body={
            status:0,
            data:createResult
        }
    }
}