var router = require('koa-router')();
var authInRole_controller = require('../../app/controllers/authInRole');

router.get('/list/:roleId', authInRole_controller.list);
router.post('/add', authInRole_controller.add);
router.post('/delete', authInRole_controller.delete);
router.post('/check', authInRole_controller.checkAuthApi)

module.exports = router;