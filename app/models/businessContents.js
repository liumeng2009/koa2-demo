const db=require('../db');
module.exports = db.defineModel('businessContents', {
    /*
    * NET 网络
    * HARDWARE 硬件
    * SOFTWARE 软件
    * SYSTEM 系统
    * OTHER 其他
    * */
    type: {
        type: db.STRING(100)
    },
    equipment:{
        type: db.STRING(100)
    },
    /*
    * SETUP 安装
    * DEBUG 调试
    * FIX 修复
    * ADVICE 咨询
    * SUPPORT 现场技术支持
    * */
    operation:{
        type:db.STRING(100)
    },
    weight:{
        type:db.INTEGER
    },
    remark:{
        type:db.STRING(200),
        allowNull:true
    },
    status:{
        type:db.INTEGER
    }
});