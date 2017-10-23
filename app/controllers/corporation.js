/**
 * Created by liumeng on 2017/7/21.
 */
const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const Sequelize = require('sequelize');

exports.list=async(ctx,next)=>{
    let Corporation = model.corporations;
    let Group=model.groups;

    Corporation.belongsTo(Group);

    let pageid=ctx.params.pageid;

    let groupId=ctx.query.group;

    let searchObj={
        status:1
    };

    if(groupId){
        searchObj.groupId=groupId
    }

    console.log(groupId+searchObj);


    let count=await Corporation.count({
        where:searchObj
    });

    let corporationObj;

    if(pageid&&pageid!=0){
        try{
            let pageidnow=parseInt(pageid);
            corporationObj=await Corporation.findAll({
                where:searchObj,
                include:[{
                    model:Group
                }],
                order:[
                    ['updatedAt','DESC']
                ],
                offset: (pageidnow-1)*sys_config.pageSize,
                limit: sys_config.pageSize
            });
        }
        catch(e){
            corporationObj=await Corporation.findAll({
                where:searchObj,
                include:[{
                    model:Group
                }],
                order:[
                    ['updatedAt','DESC']
                ]
            });
        }
    }
    else{
        corporationObj=await Corporation.findAll({
            where:searchObj,
            include:[{
                model:Group
            }],
            order:[
                ['updatedAt','DESC']
            ]
        });
    }
    ctx.body={
        status:0,
        data:corporationObj,
        total:count
    }
}

exports.save=async(ctx,next)=>{

    console.log(111111111111111111111);

    console.log('hehehehehe'+ctx.request.body.group);

    let name=ctx.request.body.name;
    let description=ctx.request.body.description;
    let groupId=ctx.request.body.group.id;
    let id=ctx.request.body.id;

    let Corporation=model.corporations;

    /*

    if(name!=''&description!=''&groupId){

    }
    else{
        throw new ApiError(ApiErrorNames.CORPORATION_NOT_NULL);
    }
*/

    //id存在，说明是编辑模式
    if(id){
        let corporations=await Corporation.findOne({
            where: {
                id: id
            }
        });
        console.log('found' + JSON.stringify(corporations));
        let corporationsObj=corporations;
        corporationsObj.name=name;
        corporationsObj.description=description;
        corporationsObj.groupId=groupId;


        let saveResult= await corporationsObj.save();
        console.log('update success'+JSON.stringify(saveResult));
        ctx.body={
            status:0,
            data:saveResult,
            message:response_config.updatedSuccess
        }
    }
    //id不存在，说明是新增模式
    else{
        console.log('addddddddddddd');
        let corporationObj=await Corporation.findAll({
            where:{
                name:name
            }
        })

        if(corporationObj.length>0){
            throw new ApiError(ApiErrorNames.NEED_UNIQUE_CORPORATION_NAME);
        }

        let createResult=await Corporation.create({
            name:name,
            description:description,
            groupId:groupId,
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
    let Corporation=model.corporations;
    let corporationObj=await Corporation.findOne({
        where:{
            status:1,
            id:id
        }
    })
    if(corporationObj){
        corporationObj.status=0;
        let deleteResult=await corporationObj.save();
        ctx.body={
            status:0,
            data:deleteResult,
            message:response_config.deleteSucess
        }
    }
    else{
        throw new ApiError(ApiErrorNames.CORPORATION_NOT_EXIST);
    }
}

exports.getData=async(ctx,next)=>{
    let Corporation = model.corporations;
    let Group=model.groups;

    Corporation.belongsTo(Group);
    let id=ctx.params.id;

    let corporationObj=await Corporation.findOne({
        where:{
            status:1,
            id:id
        },
        include:[{
            model:Group
        }],
    });
    if(corporationObj){
        ctx.body={
            status:0,
            data:corporationObj
        }
    }
    else{
        throw new ApiError(ApiErrorNames.CORPORATION_NOT_EXIST);
    }

}