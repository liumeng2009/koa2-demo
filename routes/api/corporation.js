var router = require('koa-router')();
var corporations_controller = require('../../app/controllers/corporation');

router.get('/list', corporations_controller.list);
router.get('/list/page/:pageid', corporations_controller.list);
router.get('/delete/:id', corporations_controller.delete);
router.get('/:id', corporations_controller.getData);

router.post('/save',corporations_controller.save);

module.exports = router;