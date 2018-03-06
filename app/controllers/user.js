/**
 * Created by liumeng on 2017/5/23.
 */
const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

exports.login=async(ctx,next)=>{
    let username=ctx.request.body.username;
    let password=ctx.request.body.password;
    let rememberme=ctx.request.body.rememberme;

    let User = model.user;

    let userObj=await User.findOne({
        where:{
            name:username
        }
    });

    if(userObj&&userObj.password){
        let isRealPassword=bcrypt.compareSync(password, userObj.password);
        console.log('密码对比结果是：'+isRealPassword);
        if(isRealPassword){
            console.log(111);
            let dateExpires=new Date();
            if(rememberme){
                dateExpires.setDate(dateExpires.getDate()+7);
            }
            else{
                dateExpires.setDate(dateExpires.getDate()+1);
            }
            let user={
                id:userObj.id,
                name:userObj.name,
                gender:userObj.gender,
                email:userObj.email
            }
            let token=jwt.sign({
                data:user
            },sys_config.jwtSecret,{expiresIn:'1 days'});
            userObj.token=token;
            console.log('jwt:'+token+userObj);
            await userObj.save();

            ctx.body={
                status:0,
                data:userObj,
                message:response_config.loginSuccess
            }
        }
        else{
            throw new ApiError(ApiErrorNames.USER_PSW_ERROR);
        }
    }
    else{
        throw new ApiError(ApiErrorNames.USER_NOT_EXIST);
    }
}

exports.registerUser=async(ctx,next)=>{
    let username=ctx.request.body.username;
    let password=ctx.request.body.password;
    let phone=ctx.request.body.phone;
    let email=ctx.request.body.email;
    let gender=ctx.request.body.gender;
    let canLogin=ctx.request.body.canLogin;
    let userid=ctx.request.body.id;
    let roleId=ctx.request.body.roleId;

    let User=model.user;
    //加密密码
    var salt = bcrypt.genSaltSync(sys_config.saltRounds);
    var hash = bcrypt.hashSync(password, salt);
    console.log('加密密码是：'+hash);

    if(userid){
        let userObj=await User.findOne({
            where:{
                id:userid
            }
        });
        if(userObj){

            if(userObj.password==password){
                //说明客户端传过来的是加密的密码，这时候密码保持不变。
            }
            else{
                userObj.password=hash;
            }
            userObj.phone=phone;
            userObj.email=email;
            userObj.gender=gender;
            userObj.canLogin=canLogin?canLogin:false;
            userObj.roleId=roleId

            let saveResult= await userObj.save();
            console.log('update success'+JSON.stringify(saveResult));
            ctx.body={
                status:0,
                data:saveResult,
                message:response_config.updatedSuccess
            }
        }
        else{
            throw new ApiError(ApiErrorNames.USER_NAME_NOT_EXIST);
        }
    }
    else{
        //新增
        let userObj=await User.findOne({
            where:{
                name:username
            }
        });
        if(userObj){
            //说明重复
            throw new ApiError(ApiErrorNames.USER_NAME_EXIST);
        }
        else{
            let createResult=await User.create({
                name:username,
                password:hash,
                gender:gender,
                phone:phone,
                email:email,
                canLogin:canLogin?canLogin:false,
                status:1,
                roleId:roleId
            });

            ctx.body={
                status:0,
                data:createResult,
                message:response_config.regSuccess
            }
        }
    }
}

exports.getUserData=async(ctx,next)=>{
    let token=ctx.query.token;

    if(token==''||token=='undefined'){
        throw new ApiError(ApiErrorNames.JWT_ERROR);
    }

    let User = model.user;
    let RoleModel=model.roles;
    User.belongsTo(RoleModel,{foreignKey:'roleId'});
/*    let AuthInRoleModel=model.authInRoles;
    RoleModel.hasMany(AuthInRoleModel,{foreignKey:'roleId',as:'auths'});
    let OpInFuncModel=model.opInFuncs;
    AuthInRoleModel.belongsTo(OpInFuncModel,{foreignKey:'authId'});
    let FunctionModel=model.functions;
    let OperateModel=model.operates;
    OpInFuncModel.belongsTo(FunctionModel,{foreignKey:'funcId'});
    OpInFuncModel.belongsTo(OperateModel,{foreignKey:'opId'});*/


    let userObj=await User.findOne({
        where:{
            token:token
        },
        include:[
            {
                model:RoleModel
/*                include:[
                    {
                        model:AuthInRoleModel,
                        as:'auths',
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
                    }
                ]*/
            }
        ]
    });
    if(userObj){
        ctx.body={
            status:0,
            data:userObj

        }
    }
    else{
        throw new ApiError(ApiErrorNames.USER_NOT_EXIST);
    }
}

exports.getUser=async(ctx,next)=>{
    let User = model.user;

    let id=ctx.params.id;

    let userObj=await User.findOne({
        where:{
            status:1,
            id:id
        }
    });
    if(userObj){
        ctx.body={
            status:0,
            data:userObj
        }
    }
    else{
        throw new ApiError(ApiErrorNames.USER_NAME_NOT_EXIST);
    }
}

exports.list=async(ctx,next)=>{
    let User = model.user;
    let Role=model.roles;
    User.belongsTo(Role,{foreignKey:'roleId'})

    let pageid=ctx.params.pageid;


    let count=await User.count({
        where:{
            status:1
        }
    });

    let page=0;

    try{
        page=parseInt(pageid);
    }catch(e){

    }

    let userObj;

    if(page==0){

        userObj=await User.findAll({
            where:{
                status:1
            },
            include:[
                {
                    model:Role,
                    required:false
                }
            ],
            order:[
                ['createdAt','ASC']
            ]
        });
    }
    else{
        let pageidnow=parseInt(pageid);
        userObj=await User.findAll({
            where:{
                status:1
            },
            include:[
                {
                    model:Role,
                    required:false
                }
            ],
            order:[
                ['createdAt','ASC']
            ],
            offset: (pageidnow-1)*sys_config.pageSize,
            limit: sys_config.pageSize
        });
    }
    ctx.body={
        status:0,
        data:userObj,
        total:count
    }
}

exports.delete=async(ctx,next)=>{
    let id=ctx.params.id;
    let User=model.user;
    let userObj=await User.findOne({
        where:{
            status:1,
            id:id
        }
    })
    if(userObj.name=='admin'){
        throw new ApiError(ApiErrorNames.ADMIN_CAN_NOT_DELETE);
    }
    if(userObj){
        userObj.status=0;
        let deleteResult=await userObj.save();
        ctx.body={
            status:0,
            data:deleteResult,
            message:response_config.deleteSucess
        }
    }
    else{
        throw new ApiError(ApiErrorNames.USER_NAME_NOT_EXIST);
    }
}

exports.getUrlTree=async(ctx,next)=>{
    /*
    *
    *     {path:'basic',component:BasicSettingsComponent,data:{name:'基本设置'},children:[
     { path: 'address' ,component: AddressComponent,data:{name:'地址设置'},children:[
     {path:'list',component:AddressListComponent,data:{name:'列表'}},
     {path:'add',component:AddressAddComponent,data:{name:'新增'}},
     {path:':id',component:AddressEditComponent,data:{name:'编辑'}}
     ] },
    *
    *
    * **/
    let obj1={
        path:'list',
        component:'AddressListComponent',
        data:{
            name:'列表'
        }
    }
    let obj2={
        path:'list',
        component:'AddressAddComponent',
        data:{
            name:'新增'
        }
    }
    let obj3={
        path:'list',
        component:'AddressEditComponent',
        data:{
            name:'编辑'
        }
    }

    let objParent={
        path:'address',
        component:'AddressComponent',
        data:{
            name:'地址设置'
        },
        children:[
            obj1,
            obj2,
            obj3
        ]
    }
    let basic={
        path:'basic',
        component:'BasicSettingsComponent',
        data:'基本设置',
        children:[
            objParent
        ]
    }
    ctx.body={
        status:0,
        data:basic
    }
}