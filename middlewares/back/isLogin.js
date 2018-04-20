/**
 * Created by liumeng on 2017/6/1.
 */
const ApiError=require('../../app/error/ApiError');
const ApiErrorNames=require('../../app/error/ApiErrorNames');

const sys_config=require('../../config/sys_config');

const jwt=require('jsonwebtoken');

var isLogin=async(ctx,next)=>{
    //console.log(ctx.url+ctx.cookies.get('name',{signed:true}));
    if(ctx.url.indexOf('api')>-1){
        console.log(ctx.url);
        if(ctx.url.indexOf('/api/user/login')>-1||ctx.url.indexOf('/api/user/reg')>-1){
            await next()
        }
        else{
            console.log('验证接口合法性');
            //根据token参数，确定是否登录状态
            var token=ctx.query.token;
            return new Promise((resolve, reject) => {
                jwt.verify(token, sys_config.jwtSecret, function (error, decoded) {
                    if (error) {
                        console.log('验证接口合法性：失败'+token);
                        reject(
                            new ApiError(ApiErrorNames.JWT_ERROR)
                        );
                    }
                    else {
                        console.log('验证接口合法性：成功');
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
module.exports=isLogin;