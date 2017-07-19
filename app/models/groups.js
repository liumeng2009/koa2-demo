const db=require('../db');
module.exports = db.defineModel('groups', {
    name:{
        type:db.STRING(100),
        unique:true
    },
    description: {
        type: db.STRING(200)
    },
    status:{
        type:db.INTEGER
    }
});