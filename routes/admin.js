/**
 * Created by liumeng on 2017/5/27.
 */
var router = require('koa-router')();
var adminLoginController=require('../app/controllers/admin');
var userController=require('../app/controllers/user');

router.get('/', adminLoginController.loginIndex);
router.get('/admin', adminLoginController.adminIndex);
router.post('/login', userController.login);

module.exports = router;