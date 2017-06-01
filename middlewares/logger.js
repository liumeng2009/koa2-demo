/**
 * Created by liumeng on 2017/5/24.
 */
var logger_add=async(ctx,next)=>{
    const startDate = new Date();
    await next();
    console.log(`method: ${ctx.method} code: ${ctx.status} time:${new Date() -startDate}ms`);
}

module.exports=logger_add;