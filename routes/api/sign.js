
var router = require('koa-router')();
var sign_controller = require('../../app/controllers/sign');

router.post('/save', sign_controller.saveSign);
router.get('/:signtype/:id',sign_controller.getSign);

module.exports = router;