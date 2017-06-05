/**
 * Created by liumeng on 2017/6/2.
 */
const db=require('../db');
module.exports = db.defineModel('functions', {
    name:{
        type:db.STRING(100),
        unique:true
    },
    code: {
        type: db.STRING(100),
        unique: true
    },
    parentId: db.STRING(100),
    url: db.BOOLEAN
});