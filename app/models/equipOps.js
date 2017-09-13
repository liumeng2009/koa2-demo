/**
 * Created by liumeng on 2017/9/13.
 */
const db=require('../db');
module.exports = db.defineModel('equipOps', {
    name:{
        type:db.STRING(100),
        unique:true
    },
    code: {
        type: db.STRING(100),
        unique:true
    }
});