const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const Sequelize = require('sequelize');


exports.list=async(ctx,next)=>{
    let AuthInRole=model.authInRoles;

    let roleId=ctx.params.roleId;

    let result=await AuthInRole.findAll({
        where:{
            roleId:roleId
        }
    })

    ctx.body={
        status:0,
        data:result
    }
}

exports.add=async(ctx,next)=>{
    let AuthInRole=model.authInRoles;
    let OpInFuncModel=model.opInFuncs;
    let FunctionModel=model.functions;
    let OperateModel=model.operates;
    let Role=model.roles;

    OpInFuncModel.belongsTo(FunctionModel,{foreignKey:'funcId'});
    OpInFuncModel.belongsTo(OperateModel,{foreignKey:'opId'});

    let roleId=ctx.request.body.roleId;
    let authId=ctx.request.body.authId;

    let authObj=await OpInFuncModel.findOne({
        where:{
            id:authId
        },
        include:[
            {
                model:FunctionModel
            },
            {
                model:OperateModel
            }
        ]
    });

    if(authObj){

    }
    else{
        throw new ApiError(ApiErrorNames.AUTH_NOT_EXIST);
    }

    let roleResult=await Role.findOne({
        where:{
            status:1,
            id:roleId
        }
    })

    if(roleResult){

    }
    else{
        throw new ApiError(ApiErrorNames.ROLE_NOT_EXIST);
    }


    AuthInRole.belongsTo(OpInFuncModel,{foreignKey:'authId'});

    let r=await AuthInRole.findOne({
        where:{
            roleId:roleId,
            authId:authId
        },
        include:[
            {
                model:OpInFuncModel,
                include:[
                    {
                        model:FunctionModel
                    },
                    {
                        model:OperateModel
                    }
                ]
            }
        ]
    });

    if(r){
        console.log('呵呵呵呵'+JSON.stringify(r));
        throw new ApiError(ApiErrorNames.ROLE_HAS_THE_AUTH,[r.opInFunc.function.name+':'+r.opInFunc.operate.name]);
    }
    else{

    }


    let result=await AuthInRole.create({
        roleId:roleId,
        authId:authId
    });



    ctx.body={
        status:0,
        data:result,
        message:response_config.createdSuccess
    }

}

exports.delete=async(ctx,next)=>{
    let AuthInRole=model.authInRoles;
    let roleId=ctx.request.body.roleId;
    let authId=ctx.request.body.authId;
    let RoleModel=model.roles;

    let deleteResult=await AuthInRole.findOne({
        where:{
            roleId:roleId,
            authId:authId
        }
    })


    //系统管理员，不允许删除权限
    let roleObj=await RoleModel.findOne({
        where:{
            status:1,
            id:roleId
        }
    })

/*    if(roleObj.name=='系统管理员'){
        throw new ApiError(ApiErrorNames.AUTH_ADMIN_NOT_DELETE);

    }*/

    let dr=await deleteResult.destroy();

    ctx.body={
        status:0,
        data:dr,
        message:response_config.deleteSuccess
    }
}

exports.checkAuth=async(token,func,op)=>{

    let AuthInRoleModel=model.authInRoles;
    let OpInFuncModel=model.opInFuncs;
    AuthInRoleModel.belongsTo(OpInFuncModel,{foreignKey:'authId'});
    let FuncModel=model.functions;
    let OperateModel=model.operates;
    OpInFuncModel.belongsTo(FuncModel,{foreignKey:'funcId'});
    OpInFuncModel.belongsTo(OperateModel,{foreignKey:'opId'});
    let RoleModel=model.roles;
    AuthInRoleModel.belongsTo(RoleModel,{foreignKey:'roleId'});
    let UserModel=model.user;
    RoleModel.hasMany(UserModel,{foreignKey:'roleId',as:'users'});



    let result=await AuthInRoleModel.findAll({
        include:[
            {
                model:OpInFuncModel,
                include:[
                    {
                        model:FuncModel,
                        where:{
                            code:func
                        }
                    },
                    {
                        model:OperateModel,
                        where:{
                            code:op
                        }
                    }
                ]
            },{
                model:RoleModel,
                include:[
                    {
                        model:UserModel,
                        as:'users',
                        where:{
                            token:token
                        }
                    }

                ]
            }
        ]
    });

    if(result.length>0){

    }
    else{
        throw new ApiError(ApiErrorNames.NO_AUTH);
    }
}

