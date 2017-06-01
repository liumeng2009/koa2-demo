/**
 * Created by liumeng on 2017/5/27.
 */
exports.index=async(ctx,next)=>{
    await ctx.render('index', {
        title: 'koa2 title',
        name:'liumeng'
    });
}