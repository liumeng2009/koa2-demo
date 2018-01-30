/**
 * Created by liumeng on 2017/5/24.
 */
var router = require('koa-router')();
var user_router = require('./user');
var buildings_router = require('./buildings');
var groups_router = require('./groups');
var corporations_router = require('./corporation');
var corpBuildings_router = require('./corpBuilding');
var workers_router = require('./workers');
var businessContent_router=require('./businessContent');
var order_router=require('./order');
var equipType_router=require('./equipType');
var equipOp_router=require('./equipOp');
var operation_router=require('./operation');
var action_router=require('./actions');
var function_router=require('./functions');
var operate_router=require('./operate');
var role_router=require('./role');

router.use('/user', user_router.routes(), user_router.allowedMethods());
router.use('/buildings', buildings_router.routes(), buildings_router.allowedMethods());
router.use('/groups', groups_router.routes(), groups_router.allowedMethods());
router.use('/corporations', corporations_router.routes(), corporations_router.allowedMethods());
router.use('/corpbuildings', corpBuildings_router.routes(), corpBuildings_router.allowedMethods());
router.use('/workers', workers_router.routes(), workers_router.allowedMethods());
router.use('/business', businessContent_router.routes(), businessContent_router.allowedMethods());
router.use('/order', order_router.routes(), order_router.allowedMethods());
router.use('/equipType', equipType_router.routes(), equipType_router.allowedMethods());
router.use('/equipOp', equipOp_router.routes(), equipOp_router.allowedMethods());
router.use('/operation', operation_router.routes(), operation_router.allowedMethods());
router.use('/action', action_router.routes(), action_router.allowedMethods());
router.use('/function', function_router.routes(), function_router.allowedMethods());
router.use('/operate', operate_router.routes(), operate_router.allowedMethods());
router.use('/role', role_router.routes(), role_router.allowedMethods());

module.exports = router;