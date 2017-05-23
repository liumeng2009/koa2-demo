/**
 * Created by liumeng on 2017/5/23.
 */
exports.getUser=async(ctx,next)=>{
    ctx.body={
        username:'阿西吧',
        age:30
    }
}

exports.registerUser=async(ctx,next)=>{
    console.log('registerUser',ctx.request.body);
}