/**
 * Created by liumeng on 2017/6/2.
 */
const db=require('../db');
module.exports = db.defineModel('functions', {
    name:{
        type:db.STRING(100),
        unique:true
    },
    code: {
        type: db.STRING(100),
        unique: true
    },
    //属于第几层
    class:{
        type:db.INTEGER
    },
    belong:{
        type: db.STRING(50),
        allowNull:true
    },
    status:{
        type:db.INTEGER
    }
});