/**
 * Created by liumeng on 2017/6/1.
 */
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
            e.stack='routes 未定义';
            if(process.env.NODE_ENV=='development'){
                showAll=true;
            }
            await ctx.render('error',{
                error:e,
                showAll:showAll,
                directTo:'/admin',
                staticPath:'../../'
            });
        }
    }
    catch(e){
        console.log('显示错误页面'+JSON.stringify(e));
        let status = e.code || 500;
        let message = e.message || '服务器错误';
        let showAll=false;
        e.status=status;
        e.message=message;
        if(process.env.NODE_ENV=='development'){
            showAll=true;
        }

        //确定路径层次

        let url=ctx.url;
        let regTest=new RegExp('/','g');
        let result=url.match(regTest);
        console.log(url+'的层次是：'+result.length);
        let staticPath='';
        for(var i=0;i<result.length;i++){
            staticPath=staticPath+'../';
        }
        console.log(staticPath);

        await ctx.render('error',{
            error:e,
            showAll:showAll,
            staticPath:staticPath
        });
    }
}
module.exports=errorPage;