/**
 * Created by liumeng on 2017/6/5.
 */
const db=require('../db');
module.exports = db.defineModel('operations', {
    orderId:{
        type:db.STRING(100)
    },
    important:{
        type:db.BOOLEAN
    },
    op:{
        type:db.STRING(100)
    },
    no:{
        type:db.STRING(100),
        unique:true
    },

    create_time:{
        type: db.BIGINT
    },

    remark:{
        type:db.TEXT,
        allowNull:true
    },
    status:{
        type:db.INTEGER
    }
});