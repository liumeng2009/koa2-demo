/**
 * Created by liumeng on 2017/7/21.
 */
const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const Sequelize = require('sequelize');
const auth=require('./authInRole');

exports.list=async(ctx,next)=>{
    console.log('有noauth吗');
    //await auth.checkAuth(ctx.query.token,'corporation','list');

    console.log('怎么会有noauth呢');
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
                    ['groupId','DESC'],
                    ['createdAt','ASC']
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
                    ['groupId','DESC'],
                    ['createdAt','ASC']
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
                ['groupId','DESC'],
                ['createdAt','ASC']
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
        await auth.checkAuth(ctx.query.token,'corporation','edit');
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
        await auth.checkAuth(ctx.query.token,'corporation','add');
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
    await auth.checkAuth(ctx.query.token,'corporation','delete');
    let id=ctx.params.id;
    let Corporation=model.corporations;

    //如果在需求表中，被使用了，则无法删除
    let OrderModel=model.orders;
    let orderResult=await OrderModel.findOne({
        where:{
            custom_corporation:id,
            status:1
        }
    });

    if(orderResult){
        throw new ApiError(ApiErrorNames.CORPORATION_CAN_NOT_DELETE)
    }

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
            message:response_config.deleteSuccess
        }
    }
    else{
        throw new ApiError(ApiErrorNames.CORPORATION_NOT_EXIST);
    }
}

exports.getData=async(ctx,next)=>{
    await auth.checkAuth(ctx.request.headers.authorization,'corporation','list');
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