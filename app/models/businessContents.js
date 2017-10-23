const db=require('../db');
module.exports = db.defineModel('businessContents', {
    type: {
        type:db.STRING(100),
        references:{
            model:'equipTypes',
            key:'code'
        }
    },
    equipment:{
        type: db.STRING(100)
    },
    operation:{
        type:db.STRING(100),
        references:{
            model:'equipOps',
            key:'code'
        }
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