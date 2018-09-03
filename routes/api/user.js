/**
 * Created by liumeng on 2017/5/23.
 */
var router = require('koa-router')();
var user_controller = require('../../app/controllers/user');

router.post('/login', user_controller.login);
router.post('/reg', user_controller.registerUser);
router.post('/edit', user_controller.edit);
router.get('/checktoken',user_controller.checkToken)

router.post('/editSimple',user_controller.editSimple)
router.post('/editPassword',user_controller.editPassword)

router.get('/',user_controller.getUserData);
router.get('/:id',user_controller.getUser);
router.get('/list',user_controller.list);
router.get('/list/page/:pageid',user_controller.list);
router.get('/delete/:id',user_controller.delete);

router.post('/uploadAvatar',user_controller.uploadAvatar)
router.get('/sysAvatar/list',user_controller.getSysAvatars)
router.post('/sysAvatar/set',user_controller.setSysAvatars)


router.get('/get/urltree',user_controller.getUrlTree);

module.exports = router;