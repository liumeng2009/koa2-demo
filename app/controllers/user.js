/**
 * Created by liumeng on 2017/5/23.
 */
const ApiError=require('../error/ApiError');
const ApiErrorNames=require('../error/ApiErrorNames');
const model = require('../model');

exports.login=async(ctx,next)=>{
    let username=ctx.request.body.username;
    let password=ctx.request.body.password;
    let rememberme=ctx.request.body.rememberme;

    let User = model.user;

    var user=await User.findAll({
        where:{
            name:username,
            password:password
        }
    }).then(function (p) {
        //console.log('found.' + JSON.stringify(p));
        if(p.length>0){
            //console.log('db has');
            let dateExpires=new Date();
            if(rememberme){
                dateExpires.setDate(dateExpires.getDate()+7);
            }
            else{
                dateExpires.setDate(dateExpires.getDate()+1);
            }
            ctx.cookies.set("name",username,{signed:true,expires:dateExpires});
            ctx.redirect('/admin/admin');
        }
        else{
            console.log('db not exist')
            throw new ApiError(ApiErrorNames.USER_NOT_EXIST);
        }
    }).catch(function (err) {
        throw new ApiError(err.name);
    });
}

exports.registerUser=async(ctx,next)=>{
    console.log('registerUser',ctx.request.body);
}