/**
 * Created by liumeng on 2017/8/24.
 */
const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const db=require('../db');
const auth=require('./authInRole');

exports.list=async(ctx,next)=>{
    //let BusinessContent=model.businessContents;

    let pageid=ctx.params.pageid;
    let type=ctx.query.type;
    let equipment=ctx.query.equipment;

    //let strWhere=' where status=1 ';

    let searchObj={
        status:1
    }
    if(type&&type!=''){
        searchObj.type=type;
        //strWhere+=" and equiptypes.code='"+type+"'";
    }
    if(equipment&&equipment!=''){
        //strWhere+=" and businessContents.equipment='"+equipment+"'";
        searchObj.equipment=equipment;
    }

    let contents;
    let sequelize=db.sequelize;
/*    let strSql='select businessContents.*,equiptypes.name as equiptypesname,equipops.name as equipopsname from businessContents inner join equiptypes on businessContents.type=equiptypes.code inner join equipops on businessContents.operation=equipops.code'+strWhere;
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
    }*/

    let BusinessContent=model.businessContents;
    let EquipType=model.equipTypes;
    let EquipOps=model.equipOps;

    BusinessContent.belongsTo(EquipType,{foreignKey:'type',targetKey:'code'});
    BusinessContent.belongsTo(EquipOps,{foreignKey:'operation',targetKey:'code'});

    let count=await BusinessContent.count({
        where:searchObj
    });

    if(pageid&&pageid!=0){
        let pageidnow=parseInt(pageid);
        contents=await BusinessContent.findAll({
            where:searchObj,
            include:[{
                model:EquipType
            },{
                model:EquipOps
            }],
            order:[
                ['updatedAt','DESC']
            ],
            offset: (pageidnow-1)*sys_config.pageSize,
            limit: sys_config.pageSize
        });
    }
    else{
        contents=await BusinessContent.findAll({
            where:searchObj,
            include:[{
                model:EquipType
            },{
                model:EquipOps
            }],
            order:[
                ['updatedAt','DESC']
            ]
        });
    }
    ctx.body={
        status:0,
        data:contents,
        total:count
    }
}

exports.save=async(ctx,next)=>{
    await auth.checkAuth(ctx.request.headers.authorization,'business','add')
    let BusinessContent=model.businessContents;
    let type=ctx.request.body.type;
    let equipment=ctx.request.body.equipment;
    let OperationsDesk=ctx.request.body.operationsDesk;
    let OperationsSys=ctx.request.body.operationsSys;


    if((OperationsDesk==null||OperationsDesk.length==0)&&(OperationsSys==null||OperationsSys.length==0)){
        throw new ApiError(ApiErrorNames.BUSINESS_OPERATION_NULL);
    }
    if(equipment==null||equipment==''){
        throw new ApiError(ApiErrorNames.BUSINESS_EQUIPMENT_NULL);
    }


    let selectEquipment=await BusinessContent.findOne({
        where:{
            equipment:equipment
        }
    })

    if(selectEquipment){
        throw new ApiError(ApiErrorNames.BUSINESS_EQUIPMENT_EXIST);
    }

    let businessArray=[];

    for(let operation of OperationsDesk){
        if(operation.checked){
            let businessObj={
                type:type,
                equipment:equipment,
                operation:operation.op,
                status:1,
                weight:operation.weight,
                remark:operation.remark,
                isAdvanced:false,
                sequence:operation.sequence
            }
            businessArray.push(businessObj);
        }
    }

    for(let operation of OperationsSys){
        if(operation.checked){
            let businessObj={
                type:type,
                equipment:equipment,
                operation:operation.op,
                status:1,
                weight:operation.weight,
                remark:operation.remark,
                isAdvanced:true,
                sequence:operation.sequence
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

exports.edit=async(ctx,next)=>{
    await auth.checkAuth(ctx.request.headers.authorization,'business','edit')
    let BusinessContent=model.businessContents;
    let OperationsDesk=ctx.request.body.operationsDesk;
    let OperationsSys=ctx.request.body.operationsSys;
    let type=ctx.request.body.type;
    let equipment=ctx.request.body.equipment;

    if((OperationsDesk==null||OperationsDesk.length==0)&&(OperationsSys==null||OperationsSys.length==0)){
        throw new ApiError(ApiErrorNames.BUSINESS_OPERATION_NULL);
    }
    if(equipment==null||equipment==''){
        throw new ApiError(ApiErrorNames.BUSINESS_EQUIPMENT_NULL);
    }




    //bug，不可以全部删除啊，否则事务找不到了。
/*    let deleteBusiness=await BusinessContent.destroy({
        where:{
            type:type,
            equipment:equipment
        }
    })*/

    let businessArray=[];

    for(let operation of OperationsDesk){
        if(operation.checked){
            if(operation.id){
                //id存在就是编辑
                let bc=await BusinessContent.findOne({
                    where:{
                        id:operation.id
                    }
                })
                bc.weight=operation.weight;
                bc.remark=operation.remark;
                bc.sequence=operation.sequence;
                console.log(operation.id+'修改：'+operation.weight+'比较'+bc.id);
                let r1=await bc.save();
            }
            else{
                //id不存在，就是新增
                let businessObj={
                    type:type,
                    equipment:equipment,
                    operation:operation.op,
                    status:1,
                    weight:operation.weight,
                    remark:operation.remark,
                    isAdvanced:false,
                    sequence:operation.sequence
                }
                let r2=await BusinessContent.create(businessObj);
            }
        }
        else{
            if(operation.id){
                //原则上不允许删除
            }
        }
    }

    for(let operation of OperationsSys){
        if(operation.checked){
            if(operation.id){

                //id存在就是编辑
                let bc=await BusinessContent.findOne({
                    where:{
                        id:operation.id
                    }
                })
                bc.weight=operation.weight;
                bc.remark=operation.remark;
                bc.sequence=operation.sequence
                console.log(operation.id+'修改：'+operation.weight+'比较'+bc.id);
                let r1=await bc.save();
            }
            else{
                //id不存在，就是新增
                let businessObj={
                    type:type,
                    equipment:equipment,
                    operation:operation.op,
                    status:1,
                    weight:operation.weight,
                    remark:operation.remark,
                    isAdvanced:true,
                    sequence:operation.sequence
                }
                let r2=await BusinessContent.create(businessObj);
            }
        }
        else{
            if(operation.id){
                //原则上不允许删除
            }
        }
    }

    ctx.body={
        status:0,
        data:[],
        message:response_config.updatedSuccess
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
            attributes:['equipment',['equipment','name']],
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
            attributes:['equipment',['equipment','name']],
            group: ['equipment']
        })
        ctx.body={
            status:0,
            data:obj
        }
    }
}

exports.delete=async(ctx,next)=>{
    await auth.checkAuth(ctx.query.token,'business','delete')
    let id=ctx.params.id;
    let BusinessContent=model.businessContents;
    let Operation=model.operations;
    let busiObj=await BusinessContent.findAll({
        where: {
            id: id
        }
    })


    //如果这个业务被使用过，就不可以删除了
    let selectResult=await Operation.findOne({
        where:{
            status:1,
            op:id
        }
    })

    if(selectResult){
        throw new ApiError(ApiErrorNames.BUSINESS_USED);
    }

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



