const db=require('../db');
module.exports = db.defineModel('clientSigns', {
    signId:{
        type:db.STRING(200)
    },
    start:{
        type:db.BIGINT,
        allowNull:true
    },
    //0 没使用 1 有用户使用了 2 用户签名完毕，此记录关闭
    status:{
        type:db.INTEGER
    },
    clientSeconds:{
        type:db.INTEGER,
        allowNull:true
    }
});