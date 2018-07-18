/**
 * Created by liumeng on 2017/6/1.
 */
const ApiError=require('../../app/error/ApiError');
const ApiErrorNames=require('../../app/error/ApiErrorNames');

const sys_config=require('../../config/sys_config');

const jwt=require('jsonwebtoken');

const noAuthArray=require('../../config/noAuth_url')
const needAuthArray=require('../../config/needAuth_url')

var isLogin=async(ctx,next)=>{
    console.log('要访问的url是:'+ctx.path);
    if(ctx.url.indexOf('api')>-1){
        if(!existInNeedAuthArray(ctx.path)&&existInNoAuthArray(ctx.path)){
            console.log('在白名单');
            await next()
        }
        else{
            console.log('不在白名单');
            //根据token参数，确定是否登录状态
            var token=ctx.request.headers.authorization;
            console.log(token);
            return new Promise((resolve, reject) => {
                jwt.verify(token, sys_config.jwtSecret, function (error, decoded) {
                    if (error) {
                        console.log(error);
                        reject(
                            new ApiError(ApiErrorNames.JWT_ERROR)
                        );
                    }
                    else {
                        resolve(next());
                    }
                })
            });
        }
    }
    else{
        await next();
    }
}

var existInNoAuthArray=function(url){
    for(let na of noAuthArray){
        if(na==url||url.indexOf(na)>=0){
            return true;
        }
    }
    return false;
}

var existInNeedAuthArray=function(url){
    for(let na of needAuthArray){
        if(na==url){
            return true;
        }
    }
    return false;
}

module.exports=isLogin;