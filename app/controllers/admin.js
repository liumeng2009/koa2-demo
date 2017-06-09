/**
 * Created by liumeng on 2017/5/27.
 */
exports.loginIndex=async(ctx,next)=>{
    await ctx.render('./back/login', {
        title: '登录',
        staticPath:'/',
    });
}

exports.adminIndex=async(ctx,next)=>{
    await ctx.render('./back/main/main',{
        title:'欢迎',
        staticPath:'../'
    })
}