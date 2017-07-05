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

    //let username=ctx.query.username;
    //let password=ctx.query.password;

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
            console.log(111);
            let dateExpires=new Date();
            if(rememberme){
                dateExpires.setDate(dateExpires.getDate()+7);
            }
            else{
                dateExpires.setDate(dateExpires.getDate()+1);
            }
            //ctx.cookies.set("name",username,{signed:true,expires:dateExpires});
            //console.log(555+userObj);
            //delete userObj[0].token;
            let user={
                id:userObj[0].id,
                name:userObj[0].name,
                gender:userObj[0].gender,
                email:userObj[0].email
            }


            //console.log('加密前的user是：'+JSON.stringify(userObj[0]));
            let token=jwt.sign({
                data:user
            },sys_config.jwtSecret,{expiresIn:'1 days'});
            userObj[0].token=token;
            console.log('jwt:'+token+userObj[0]);
            await userObj[0].save();

            ctx.body={
                status:0,
                data:userObj[0]
            }
        }
        else{
            /*
            ctx.body={
                success:true,
                data: {},
                message:response_config.password_error
            }
            */
            console.log('heheheheh');
            throw new ApiError(ApiErrorNames.USER_PSW_ERROR);
        }
    }
    else{
        /*
        ctx.body= {
            success: true,
            data: {},
            message:response_config.user_not_exist
        }
        */
        throw new ApiError(ApiErrorNames.USER_NOT_EXIST);
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

exports.getUserData=async(ctx,next)=>{
    let token=ctx.params.token;

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
        return new Promise((resolve, reject) => {
            jwt.verify(token,sys_config.jwtSecret,function(error,decoded){
                if(error){
                    console.log(888888888888);
                    //return reject(function(){

                    //})
                    reject(new ApiError(ApiErrorNames.JWT_ERROR));

                }
                else{
                    ctx.body={
                        status:0,
                        data:userObj[0]

                    }
                    resolve();
                }
            })
        });


        /*
        ctx.body = {
            status: 0,
            data: userObj[0]
        }
*/
        /*
        await jwt.verify(token,sys_config.jwtSecret,function(error,decoded){
            return new Promise(function(resolve,reject){
                if(error){
                    console.log(888888888888);
                    return resolve(function(){
                        throw new ApiError(ApiErrorNames.JWT_ERROR);
                    })
                }
                else{
                    console.log(777777777+userObj[0]+decoded);
                    ctx.body={
                        status:0,
                        data:userObj[0]

                    }
                    resolve();

                    return resolve({

                        }
                    )

                }
            })
        });

*/
        /*

        */

    }
    else{
        throw new ApiError(ApiErrorNames.USER_NOT_EXIST);
    }
}