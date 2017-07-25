/**
 * Created by liumeng on 2017/5/24.
 */
var router = require('koa-router')();
var user_router = require('./user');
var buildings_router = require('./buildings');
var groups_router = require('./groups');
var corporations_router = require('./corporation');
var corpBuildings_router = require('./corpBuilding');

router.use('/user', user_router.routes(), user_router.allowedMethods());
router.use('/buildings', buildings_router.routes(), buildings_router.allowedMethods());
router.use('/groups', groups_router.routes(), groups_router.allowedMethods());
router.use('/corporations', corporations_router.routes(), corporations_router.allowedMethods());
router.use('/corpbuildings', corpBuildings_router.routes(), corpBuildings_router.allowedMethods());

module.exports = router;