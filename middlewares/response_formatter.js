/**
 * Created by liumeng on 2017/5/23.
 */

var ApiError = require('../app/error/ApiError');

var response_formatter =  (ctx) => {
    //如果有返回数据，将返回数据添加到data中
    if (ctx.body) {
        ctx.body = {
            success:true,
            data: ctx.body
        }
    } else {
        ctx.body = {
            success: true
        }
    }
}

var url_filter = function(pattern){
    return async function(ctx, next){
        var reg = new RegExp(pattern);
        try{
            await next();
        }
        catch(error){
            console.log('i am error object'+error+JSON.stringify(ApiError));
            //如果异常类型是API异常并且通过正则验证的url，将错误信息添加到响应体中返回。
            if(error instanceof ApiError && reg.test(ctx.originalUrl)){
                console.log('error url');
                ctx.status = 200;
                ctx.body = {
                    code: error.code,
                    message: error.message
                }
            }
            throw error;
        }
        //通过正则的url进行格式化处理
        if(reg.test(ctx.originalUrl)){
            console.log('888888888888888');
            response_formatter(ctx);
        }
    }
}
module.exports = url_filter;