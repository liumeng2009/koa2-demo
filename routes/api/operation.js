var router = require('koa-router')();
var operation_controller = require('../../app/controllers/operation');

router.get('/list', operation_controller.list);
router.get('/list/page/:pageid', operation_controller.list);
router.get('/list/time/:time', operation_controller.list_now);

router.get('/list_week/time/:time', operation_controller.list_week);
router.get('/list_month/time/:time', operation_controller.list_month);
router.get('/list_month_worker/time/:time', operation_controller.list_month_worker);
router.get('/list_month_worker_time/time/:time', operation_controller.list_month_worker_time);

router.get('/list/page/:pageid/time/:time/corp/:corp/no/:no', operation_controller.list);
router.get('/list/time/:time/corp/:corp/no/:no', operation_controller.list);
router.get('/:id', operation_controller.getOperation);
router.post('/save', operation_controller.add);
router.post('/edit', operation_controller.edit);


router.get('/delete/:id',operation_controller.delete);


module.exports = router;