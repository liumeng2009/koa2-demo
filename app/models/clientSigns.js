const db=require('../db');
module.exports = db.defineModel('clientSigns', {
    signId:{
        type:db.STRING(200)
    },
    clientIp:{
        type:db.STRING(200)
    },
    start:{
        type:db.INTEGER
    },
    //1 正常 2 用户签名完毕，此记录关闭
    status:{
        type:db.INTEGER
    },
    clientSeconds:{
        type:db.INTEGER
    }
});