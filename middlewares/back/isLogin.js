/**
 * Created by liumeng on 2017/6/1.
 */
const ApiError=require('../../app/error/ApiError');
const ApiErrorNames=require('../../app/error/ApiErrorNames');

const sys_config=require('../../config/sys_config');

const jwt=require('jsonwebtoken');

const noAuthArray=require('../../config/noAuth_url')

var isLogin=async(ctx,next)=>{
    if(ctx.url.indexOf('api')>-1){
        console.log(ctx.url);
        if(existInNoAuthArray(ctx.url)){
            await next()
        }
        else{
            //根据token参数，确定是否登录状态
            var token=ctx.query.token;
            return new Promise((resolve, reject) => {
                jwt.verify(token, sys_config.jwtSecret, function (error, decoded) {
                    if (error) {
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

module.exports=isLogin;