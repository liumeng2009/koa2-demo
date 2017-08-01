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
    let Group = model.groups;

    let pageid=ctx.params.pageid;


    let count=await Group.count({
        where:{
            status:1
        }
    });
    //let count=buildingCountObj.get('count');

    let groupObj;

    if(pageid&&pageid!=0){
        try{
            let pageidnow=parseInt(pageid);
            groupObj=await Group.findAll({
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
            groupObj=await Group.findAll({
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
        groupObj=await Group.findAll({
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
        data:groupObj,
        total:count
    }
}

exports.save=async(ctx,next)=>{
    let name=ctx.request.body.name;
    let description=ctx.request.body.description;
    let id=ctx.request.body.id;

    let Groups=model.groups;

    if(name!=''&description!=''){

    }
    else{
        throw new ApiError(ApiErrorNames.GROUP_NOT_NULL);
    }


    //id存在，说明是编辑模式
    if(id){
        let groups=await Groups.findOne({
            where: {
                id: id
            }
        });
        console.log('found' + JSON.stringify(groups));
        let groupsObj=groups;
        groupsObj.name=name;
        groupsObj.description=description;


        let saveResult= await groupsObj.save();
        console.log('update success'+JSON.stringify(saveResult));
        ctx.body={
            status:0,
            data:saveResult,
            message:response_config.updatedSuccess
        }
    }
    //id不存在，说明是新增模式
    else{
        let groupObj=await Groups.findAll({
            where:{
                name:name
            }
        })

        if(groupObj.length>0){
            throw new ApiError(ApiErrorNames.NEED_UNIQUE_GROUP_NAME);
        }

        let createResult=await Groups.create({
            name:name,
            description:description,
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
    let id=ctx.params.id;
    let Group=model.groups;
    let groupObj=await Group.findOne({
        where:{
            status:1,
            id:id
        }
    })
    if(groupObj){
        groupObj.status=0;
        let deleteResult=await groupObj.save();
        ctx.body={
            status:0,
            data:deleteResult,
            message:response_config.deleteSucess
        }
    }
    else{
        throw new ApiError(ApiErrorNames.GROUP_NOT_EXIST);
    }
}

exports.getData=async(ctx,next)=>{
    let Group = model.groups;

    let id=ctx.params.id;

    let groupObj=await Group.findOne({
        where:{
            status:1,
            id:id
        }
    });
    if(groupObj){
        ctx.body={
            status:0,
            data:groupObj
        }
    }
    else{
        throw new ApiError(ApiErrorNames.GROUP_NOT_EXIST);
    }

}