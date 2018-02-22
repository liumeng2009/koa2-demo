var router = require('koa-router')();
var opInFunc_controller = require('../../app/controllers/opInFunc');


router.post('/add', opInFunc_controller.authCreate);
router.post('/delete', opInFunc_controller.authDelete);

module.exports = router;