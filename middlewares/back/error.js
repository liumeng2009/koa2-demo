/**
 * Created by liumeng on 2017/6/1.
 */
var isLogin=async(ctx,next)=>{
    try{
        await next();
    }
    catch(e){
        console.log('显示错误页面'+JSON.stringify(e));
        let status = e.code || 500;
        let message = e.message || '服务器错误';
        e.status=status;
        e.message=message;
        await ctx.render('error',{
            error:e
        });
        //await next();
    }
}
module.exports=isLogin;