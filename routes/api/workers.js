var router = require('koa-router')();
var worker_controller = require('../../app/controllers/worker');

router.get('/list', worker_controller.list);
router.get('/add/:userid', worker_controller.save);
router.get('/delete/:id',worker_controller.delete);
router.get('/usernotin',worker_controller.userNotInWorkerList)

module.exports = router;