const db=require('../db');
module.exports = db.defineModel('roles', {
    name:{
        type:db.STRING(100),
        unique:true
    },
    remark:{
        type:db.STRING(200)
    },
    status:{
        type:db.INTEGER
    }
});