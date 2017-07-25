const db=require('../db');
module.exports = db.defineModel('corpBuildings', {
    corporationId:{
        type:db.STRING(200),
        references:{
            model:'corporations',
            key:'id'
        }
    },
    buildingId: {
        type: db.STRING(200),
        references:{
            model:'buildings',
            key:'id'
        }
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