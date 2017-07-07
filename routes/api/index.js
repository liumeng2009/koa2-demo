/**
 * Created by liumeng on 2017/5/24.
 */
var router = require('koa-router')();
var user_router = require('./user');
var buildings_router = require('./buildings');

router.use('/user', user_router.routes(), user_router.allowedMethods());
router.use('/buildings', buildings_router.routes(), buildings_router.allowedMethods());

module.exports = router;