const db=require('../db');
module.exports = db.defineModel('actions', {
    operationId:{
        type:db.STRING(100)
    },

    //指派时间
    call_time:{
        type:db.BIGINT
    },
    //开始工作时间
    start_time:{
        type:db.BIGINT,
        allowNull:true
    },
    //工作结束时间
    end_time:{
        type:db.BIGINT,
        allowNull:true
    },
    worker:{
        type:db.STRING(100)
    },

    //工单开始处理的标志位
    operationStart:{
        type:db.INTEGER,
        allowNull:true
    },

    //工单结束处理的标志位
    operationComplete:{
        type:db.INTEGER,
        allowNull:true
    },
    status:{
        type:db.INTEGER
    }
});