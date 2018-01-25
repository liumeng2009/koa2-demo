const db=require('../db');
module.exports = db.defineModel('corpBuildings', {
    corporationId:{
        type:db.STRING(50)
    },
    buildingId: {
        type: db.STRING(50)
    },
    floor:{
        type:db.INTEGER
    },
    position:{
        type:db.STRING(100)
    },
    status:{
        type:db.INTEGER
    }
});