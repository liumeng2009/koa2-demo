/**
 * Created by liumeng on 2017/7/21.
 */
const db=require('../db');
module.exports = db.defineModel('corporations', {
    name:{
        type:db.STRING(100),
        unique:true
    },
    description: {
        type: db.STRING(200)
    },
    status:{
        type:db.INTEGER
    },
    groupId:{
        type:db.STRING(50)
    }
});