/**
 * Created by liumeng on 2017/5/23.
 */
var router = require('koa-router')();
var user_controller = require('../app/controllers/user');

router.get('/getUser', user_controller.getUser);
router.post('/registerUser', user_controller.registerUser);

module.exports = router;