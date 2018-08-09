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
const auth=require('./authInRole');
const fs=require('fs');
const path=require('path');


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
                name:userObj.name
            }
            let token=jwt.sign({
                data:user
            },sys_config.jwtSecret,{expiresIn:'7 days'});
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
        await auth.checkAuth(ctx.request.headers.authorization,'user','edit')
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
        await auth.checkAuth(ctx.request.headers.authorization,'user','add')
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
    let token=ctx.request.headers.authorization;
    console.log(token);
    let simple=ctx.query.simple;

    if(token==''||token=='undefined'){
        throw new ApiError(ApiErrorNames.JWT_ERROR);
    }
    let User = model.user;
    let RoleModel=model.roles;
    User.belongsTo(RoleModel,{foreignKey:'roleId'});
    let AuthInRoleModel=model.authInRoles;
    RoleModel.hasMany(AuthInRoleModel,{foreignKey:'roleId',as:'auths'});
    let OpInFuncModel=model.opInFuncs;
    AuthInRoleModel.belongsTo(OpInFuncModel,{foreignKey:'authId'});
    let FunctionModel=model.functions;
    let OperateModel=model.operates;
    OpInFuncModel.belongsTo(FunctionModel,{foreignKey:'funcId'});
    OpInFuncModel.belongsTo(OperateModel,{foreignKey:'opId'});

    let userObj;

    if(simple&&simple=='true'){
        //简单返回数据即可
        userObj=await User.findOne({
            where:{
                status:1,
                token:token
            }
        })
    }
    else{
        userObj=await User.findOne({
            where:{
                token:token
            },
            include:[
                {
                    model:RoleModel,
                    include:[
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
                    ]
                }
            ]
        });
    }

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

exports.checkToken=async(token)=>{



    let UserModel=model.user;

    let user=await UserModel.findOne({
        where:{
            token:token,
            status:1
        }
    });

    if(user){

    }
    else{
        throw new ApiError(ApiErrorNames.JWT_ERROR);
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
    await auth.checkAuth(ctx.request.headers.authrization,'user','delete');
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

    let ActionModel=model.actions;
    let actionResult=await ActionModel.findOne({
        where:{
            worker:id,
            status:1
        }
    })
    if(actionResult){
        throw new ApiError(ApiErrorNames.USER_CAN_NOT_DELETE);
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

exports.edit=async(ctx,next)=>{
    let token=ctx.request.headers.authorization;
    let name=ctx.request.body.name;
    let phone=ctx.request.body.phone;
    let email=ctx.request.body.email;


    if(token==''||token==undefined){
        throw new ApiError(ApiErrorNames.JWT_ERROR);
    }
    if(name==''||name==undefined){
        throw new ApiError(ApiErrorNames.INPUT_FIELD_NULL,['用户名']);
    }

    let user=model.user;





    let userObj=await user.findOne({
        where:{
            status:1,
            token:token
        }
    })

    let nameIsExist=await user.findOne({
        where:{
            name:name,
            id:{
                $ne:userObj.id
            }
        }
    })

    if(nameIsExist){
        throw new ApiError(ApiErrorNames.USER_NAME_EXIST);
    }

    if(userObj){
        userObj.name=name;
        userObj.phone=phone;
        userObj.email=email;
        let saveResult=await userObj.save();
        ctx.body={
            status:0,
            data:saveResult,
            message:response_config.updatedSuccess
        }
    }
    else{
        throw new ApiError(ApiErrorNames.USER_NOT_EXIST);
    }
}

exports.uploadAvatar=async(ctx,next)=>{
    let file=ctx.request.body.files.files;
    let filename=file.name;
    let tmpPath=file.path;
    let tmp=fs.createReadStream(tmpPath)
    let basePath='/public/uploads/';
    //建立日期文件夹
    let date=new Date();
    let folderName=(date.getFullYear())+((date.getMonth()+1)>9?(date.getMonth()+1):('0'+(date.getMonth()+1)))
        +(date.getDate()>9?date.getDate():('0'+date.getDate()));

    console.log(path.resolve(__dirname,'../../')+basePath+folderName);
    let folder=path.resolve(__dirname,'../../')+basePath+folderName;

    if(fs.existsSync(folder)){
        console.log('文件夹已存在');
    }
    else{
        console.log(123);
        let result=fs.mkdirSync(folder)
        console.log(result);
    }
    console.log(456);
    let dateNow=new Date();
    let timeStamp=dateNow.getTime();
    let targetPath=folder+'/'+timeStamp+'-'+filename;
    let target=fs.createWriteStream(targetPath);
    tmp.pipe(target);
    return new Promise((resolve,reject)=>{
        tmp.on('end', async()=>{
            console.log('end');
            //将图片路径数据写入数据库
            let UserModel=model.user;
            let token=ctx.request.headers.authorization;
            let userObj=await UserModel.findOne({
                where:{
                    status:1,
                    token:token
                }
            })

            if(userObj){
                userObj.avatar=folderName+'/'+timeStamp+'-'+filename;
                userObj.avatarUseImg=1;
                let saveObj=await userObj.save();
                resolve(
                    ctx.body={
                        status:0,
                        data:saveObj
                    }
                )
            }
            else{
                reject(
                    new ApiError(ApiErrorNames.JWT_ERROR)
                )
            }
        })
        tmp.on('error', (error)=>{
            console.log('error');
            reject(
                new ApiError(ApiErrorNames.UPLOAD_ERROR)
            )

        })
    })
}

exports.getSysAvatars=async(ctx,next)=>{
    let sysAvatarFolder=path.resolve(__dirname,'../../')+'/public/uploads/avatar';
    let avatarArray=[];
    let folders=fs.readdirSync(sysAvatarFolder);
    for(let f of folders){
        console.log(f);
        let perFolder=sysAvatarFolder+'/'+f;
        let files=fs.readdirSync(perFolder);

        for(let i=0;i<files.length;i++){
            files[i]='/uploads/avatar/'+f+'/'+files[i];
        }

        let fObj={};
        fObj.name=f;
        fObj.imgs=files;
        avatarArray.push(fObj)
    }
    ctx.body={
        status:0,
        data:avatarArray
    }
}

exports.setSysAvatars=async(ctx,next)=>{
    let token=ctx.request.headers.authorization;
    let img=ctx.request.body.img;
    let UserModel=model.user;
    let userObj=await UserModel.findOne({
        where:{
            status:1,
            token:token
        }
    })

    if(userObj){
        userObj.avatarUseImg=0;
        userObj.avatar=img;
        let saveResult=await userObj.save();
        ctx.body={
            status:0,
            data:saveResult,
            message:response_config.updatedSuccess
        }
    }
    else{
        throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
    }
}