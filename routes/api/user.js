/**
 * Created by liumeng on 2017/5/23.
 */
var router = require('koa-router')();
var user_controller = require('../../app/controllers/user');

router.post('/login', user_controller.login);
router.post('/reg', user_controller.registerUser);
router.get('/',user_controller.getUserData);
router.get('/:id',user_controller.getUser);
router.get('/list',user_controller.list);
router.get('/list/page/:pageid',user_controller.list);
router.get('/delete/:id',user_controller.delete);

module.exports = router;