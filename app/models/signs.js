const db=require('../db');
module.exports = db.defineModel('signs', {
    signString:{
        type:db.TEXT
    },
    operationId:{
        type:db.STRING(200)
    }
});