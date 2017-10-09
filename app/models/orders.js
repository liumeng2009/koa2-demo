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
        type: db.BIGINT
    },
    custom_corporation:{
        type:db.STRING(100)
    },
    custom_position:{
        type:db.STRING(100)
    },
    important:{
        type:db.BOOLEAN
    },
    business_description:{
        type:db.STRING(1000),
        allowNull:true
    },
    remark:{
        type:db.STRING(100),
        allowNull:true
    },
    status:{
        type:db.INTEGER
    },
    needs:{
        type:db.TEXT,
        allowNull:true
    }
});