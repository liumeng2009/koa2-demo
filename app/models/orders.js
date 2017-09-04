/**
 * Created by liumeng on 2017/8/30.
 */
const db=require('../db');
module.exports = db.defineModel('orders', {
    no:{
        type:db.STRING(50)
    },
    custom_name:{
        type:db.STRING(100),
        allowNull:true
    },
    custom_phone: {
        type: db.STRING(100),
        allowNull:true
    },
    incoming_time:{
        type: db.INTEGER
    },
    custom_position:{
        type:db.BOOLEAN
    },
    business_description:{
        type:db.STRING(1000)
    },
    remark:{
        type:db.STRING(100),
        allowNull:true
    },
    status:{
        type:db.INTEGER
    }
});