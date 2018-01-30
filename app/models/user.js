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
        allowNull:true
    },
    phone:{
        type: db.STRING(100),
        allowNull:true
    },
    password: db.STRING(100),
    gender:{
        type:db.BOOLEAN,
        allowNull:true
    },
    token:{
        type:db.TEXT,
        allowNull:true
    },
    canLogin:{
        type:db.BOOLEAN
    },
    status:{
        type:db.INTEGER
    },
    roleId:{
        type:db.STRING(50)
    }
});