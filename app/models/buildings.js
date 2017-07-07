/**
 * Created by liumeng on 2017/7/07.
 */
const db=require('../db');
module.exports = db.defineModel('buildings', {
    name:{
        type:db.STRING(100),
        unique:true
    },
    address: {
        type: db.STRING(200)
    },
    minflooor:{
        type:db.INTEGER
    },
    maxfloor:{
        type:db.INTEGER
    }
});