
var router = require('koa-router')();
var sign_controller = require('../../app/controllers/sign');

router.post('/save', sign_controller.saveSign);
router.get('')

module.exports = router;