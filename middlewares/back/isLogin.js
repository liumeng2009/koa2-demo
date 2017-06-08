/**
 * Created by liumeng on 2017/6/1.
 */
var isLogin=async(ctx,next)=>{
    console.log(ctx.url+ctx.cookies.get('name',{signed:true}));
    if(ctx.url=='/admin'||ctx.url=='/admin/login'){
        await next()
    }
    else{
        if(ctx.cookies.get('name',{signed:true})){
            await next();
        }
        else{
            ctx.redirect('/admin');
            await next();
        }
    }
}
module.exports=isLogin;