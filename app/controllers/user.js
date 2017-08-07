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

    let User=model.user;
    //加密密码
    var salt = bcrypt.genSaltSync(sys_config.saltRounds);
    var hash = bcrypt.hashSync(password, salt);
    console.log('加密密码是：'+hash);

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
            canLogin:true,
            status:1
        });

        ctx.body={
            status:0,
            data:createResult,
            message:response_config.regSuccess
        }
    }
}

exports.getUserData=async(ctx,next)=>{
    let token=ctx.query.token;

    if(token==''||token=='undefined'){
        throw new ApiError(ApiErrorNames.JWT_ERROR);
    }

    let User = model.user;
    let userObj=await User.findAll({
        where:{
            token:token
        }
    });
    console.log('user is'+userObj);
    if(userObj[0]){
        console.log(123);
        ctx.body={
            status:0,
            data:userObj[0]

        }
    }
    else{
        throw new ApiError(ApiErrorNames.USER_NOT_EXIST);
    }
}