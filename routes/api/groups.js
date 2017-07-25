var router = require('koa-router')();
var groups_controller = require('../../app/controllers/group');

router.get('/list', groups_controller.list);
router.get('/list/page/:pageid', groups_controller.list);
router.get('/delete/:id', groups_controller.delete);
router.get('/:id', groups_controller.getData);

router.post('/save',groups_controller.save);

module.exports = router;