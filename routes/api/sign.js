
var router = require('koa-router')();
var sign_controller = require('../../app/controllers/sign');

router.post('/save', sign_controller.saveSign);
router.post('/clientsave', sign_controller.clientSaveSign);
router.post('/clientSign',sign_controller.clientSign);
router.post('/qr',sign_controller.getQRCode);
router.get('/:id',sign_controller.getSign);

module.exports = router;