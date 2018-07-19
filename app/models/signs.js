const db=require('../db');
module.exports = db.defineModel('signs', {
    signString:{
        type:db.TEXT
    },
    signId:{
        type:db.STRING(200)
    },
    signType:{
        type:db.STRING(50)
    }
});