/**
 * Created by liumeng on 2017/5/23.
 */
const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');
const sys_config=require('../../config/sys_config');
const bcrypt=require('bcrypt');

exports.login=async(ctx,next)=>{
    let username=ctx.request.body.username;
    let password=ctx.request.body.password;
    let rememberme=ctx.request.body.rememberme;

    let User = model.user;


    var user=await User.findAll({
        where:{
            name:username
        }
    }).then(function (p) {
        console.log('found.' + JSON.stringify(p));
        if(p.length>0){
            let isRealPassword=bcrypt.compareSync(password, p[0].password);
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
                ctx.redirect('/admin/main');
            }
            else{
                throw new ApiError(ApiErrorNames.NAME_PSW_ERROR);
            }

        }
        else{
            //console.log('db not exist')
            throw new ApiError(ApiErrorNames.USER_NOT_EXIST);
        }
    }).catch(function (err) {
        //console.log('hahahahahahahah'+JSON.stringify(err));
        throw new ApiError(err);
    });
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