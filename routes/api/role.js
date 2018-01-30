var router = require('koa-router')();
var role_controller = require('../../app/controllers/role');

router.get('/list',role_controller.list);
router.get('/delete/:id',role_controller.delete);
router.post('/add',role_controller.add);


module.exports = router;