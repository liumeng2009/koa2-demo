/**
 * Created by liumeng on 2017/5/23.
 */
var router = require('koa-router')();
var user_controller = require('../../app/controllers/user');

router.post('/login', user_controller.login);
router.post('/registerUser', user_controller.registerUser);
router.get('/',user_controller.getUserData);

module.exports = router;