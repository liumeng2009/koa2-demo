const db=require('../db');
module.exports = db.defineModel('workers', {
    userId:{
        type:db.STRING(200)
    }
});