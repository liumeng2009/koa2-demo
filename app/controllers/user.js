/**
 * Created by liumeng on 2017/5/23.
 */
const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const response_config=require('../../config/response_config');
const bcrypt=require('bcrypt');

exports.login=async(ctx,next)=>{
    let username=ctx.request.body.username;
    let password=ctx.request.body.password;
    let rememberme=ctx.request.body.rememberme;

    let User = model.user;

    let userObj=await User.findAll({
        where:{
            name:username
        }
    });

    if(userObj[0]&&userObj[0].password){
        let isRealPassword=bcrypt.compareSync(password, userObj[0].password);
        console.log('密码对比结果是：'+isRealPassword);
        if(isRealPassword){
            let dateExpires=new Date();
            if(rememberme){
                dateExpires.setDate(dateExpires.getDate()+7);
            }
            else{
                dateExpires.setDate(dateExpires.getDate()+1);
            }
            ctx.cookies.set("name",username,{signed:true,expires:dateExpires});
            ctx.body={
                success:true,
                user:userObj[0]
            }
        }
        else{
            ctx.body={
                success:true,
                user:[],
                message:response_config.password_error
            }
        }
    }
    else{
        ctx.body= {
            success: true,
            user: [],
            message:response_config.user_not_exist
        }
    }
}

exports.registerUser=async(ctx,next)=>{
    let User = model.user;
    User.create({
        name:'admin',
        email:'378338627@qq.com',
        password:'123456',
        gender:true
    }).then(function(p){
        console.log('created'+JSON.stringify(p)+'test the password');
    }).catch(function(err){
        console.log('failed:'+err);
    });
    console.log('registerUser',ctx.request.body);
}