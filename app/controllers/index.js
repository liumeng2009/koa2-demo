/**
 * Created by liumeng on 2017/5/27.
 */
exports.index=async(ctx,next)=>{
    await ctx.render('index', {
        title: '运维工单数据管理',
        name:'liumeng'
    });
}

exports.operation=async(ctx,next)=>{
    await ctx.render('back/operation/print', {
        title: '工单'
    });
}