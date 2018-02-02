const db=require('../db');
module.exports = db.defineModel('businessContents', {
    type: {
        type:db.STRING(100)
    },
    equipment:{
        type: db.STRING(100)
    },
    operation:{
        type:db.STRING(100)
    },
    isAdvanced:{
        type:db.BOOLEAN,
        allowNull:true
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