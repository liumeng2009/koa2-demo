const db=require('../db');
module.exports = db.defineModel('opInFuncs', {
    funcId:{
        type:db.STRING(50)
    },
    opId: {
        type: db.STRING(50)
    }
});