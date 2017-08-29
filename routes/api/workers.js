var router = require('koa-router')();
var worker_controller = require('../../app/controllers/worker');

router.get('/list', worker_controller.list);
router.post('/add', worker_controller.save);
router.get('/delete/:userid',worker_controller.delete);

module.exports = router;