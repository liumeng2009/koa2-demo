/**
 * Created by liumeng on 2017/5/27.
 */
var router = require('koa-router')();
var adminLoginController=require('../app/controllers/admin');
var userController=require('../app/controllers/user');
var operationController=require('../app/controllers/operation');

router.get('/', adminLoginController.loginIndex);
router.get('/main', adminLoginController.adminIndex);
router.post('/login/:username/:password', userController.login);
router.get('/reg',userController.registerUser);

router.get('/operation/list',operationController.list);
router.get('/operation',operationController.addIndex);
router.post('/operation/add',operationController.save);
router.get('/operation/edit/:id',operationController.editIndex);
router.get('/operation/delete/:id',operationController.delete);

module.exports = router;