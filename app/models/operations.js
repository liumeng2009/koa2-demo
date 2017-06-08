/**
 * Created by liumeng on 2017/6/5.
 */
const db=require('../db');
module.exports = db.defineModel('operations', {
    name:{
        type:db.STRING(100),
        unique:true
    },
    code: {
        type: db.STRING(100),
        unique: true
    },
    discription:{
        type:db.TEXT,
        allowNull:true
    }
});