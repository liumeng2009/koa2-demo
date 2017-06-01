/**
 * Created by liumeng on 2017/5/25.
 */
const db=require('../db');
module.exports = db.defineModel('users', {
    name:{
        type:db.STRING(100),
        unique:true
    },
    email: {
        type: db.STRING(100),
        unique: true
    },
    password: db.STRING(100),
    gender: db.BOOLEAN
});