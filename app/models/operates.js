const db=require('../db');
module.exports = db.defineModel('operates', {
    name:{
        type:db.STRING(100),
        unique:true
    },
    code: {
        type: db.STRING(100),
        unique: true
    },
    status:{
        type:db.INTEGER
    }
});