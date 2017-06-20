/**
 * Created by liumeng on 2017/6/1.
 */
//如果返回success:false说明，服务器级别的错误，没有返回正常的值
var errorPage=async(ctx,next)=>{
    try{
        await next();
        console.log('let it go'+ctx.url+ctx.method+ctx.status);
        if(ctx.status=='404'){
            let status = 404;
            let message = '页面未找到';
            let showAll=false;
            let e={};
            e.status=status;
            e.message=message;
            e.stack='url 未定义';
            ctx.body= {
                success:false,
                error: e
            };
        }
    }
    catch(e){
        let status = e.code || 500;
        let message = e.message || '服务器错误';

        e.status=status;
        e.message=message;

        //确定路径层次
        ctx.body={
            success:false,
            error:e
        };
    }
}
module.exports=errorPage;