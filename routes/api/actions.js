var router = require('koa-router')();
var action_controller = require('../../app/controllers/action');

router.get('/list/time/:time', action_controller.list);
router.post('/edit', action_controller.edit);
router.post('/add', action_controller.save);
router.get('/delete/:id',action_controller.delete);

module.exports = router;