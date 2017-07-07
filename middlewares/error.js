/**
 * Created by liumeng on 2017/6/1.
 */
var errorPage=async(ctx,next)=>{
    try{
        await next();
        console.log('let it go'+ctx.url+ctx.method+ctx.status);
        /*
        if(ctx.status=='404'){
            let status = 404;
            let message = '页面未找到';
            let showAll=false;
            let e={};
            e.status=status;
            e.message=message;
            e.stack='url 未定义';
            e.name='page not found'
            ctx.body=e;
        }
        */
    }
    catch(e){
        let status = e.status || 500;
        let message = e.message || '服务器错误';

        console.log(e);

        e.status=status;
        e.message=message;

        //确定路径层次
        ctx.body=e;
    }
}
module.exports=errorPage;