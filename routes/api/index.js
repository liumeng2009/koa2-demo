/**
 * Created by liumeng on 2017/5/24.
 */
var router = require('koa-router')();
var user_router = require('./user');

router.use('/user', user_router.routes(), user_router.allowedMethods());

module.exports = router;