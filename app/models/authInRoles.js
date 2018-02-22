const db=require('../db');
module.exports = db.defineModel('authInRoles', {
    authId:{
        type:db.STRING(50)
    },
    roleId: {
        type: db.STRING(50)
    }
});