/**
 * Created by liumeng on 2017/6/5.
 */
const db=require('../db');
module.exports=db.defineModel('opInFuns',{
    funId:{
        type:db.STRING(50)
    },
    opId:{
        type:db.STRING(50)
    }
});