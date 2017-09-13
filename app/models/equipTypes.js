const db=require('../db');
module.exports = db.defineModel('equipTypes', {
    name:{
        type:db.STRING(100),
        unique:true
    },
    code: {
        type: db.STRING(100),
        unique:true
    }
});