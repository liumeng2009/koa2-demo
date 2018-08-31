var router = require('koa-router')();
var operation_controller = require('../../app/controllers/operation');

router.get('/list', operation_controller.list);
router.get('/list/page/:pageid', operation_controller.list);
router.get('/list/time/:time', operation_controller.list_now);

router.get('/list_week/time/:time', operation_controller.list_week);
router.get('/list_month/time/:time', operation_controller.list_month);
router.get('/list_month_worker/time/:time', operation_controller.list_month_worker);
router.get('/list_month_worker_time/time/:time', operation_controller.list_month_worker_time);
router.get('/list_month_corporation_count/time/:time', operation_controller.list_month_corporation_count);

router.get('/list/page/:pageid/time/:time/corp/:corp/no/:no', operation_controller.list);
router.get('/list/time/:time/corp/:corp/no/:no', operation_controller.list);

router.get('/workingOperationList',operation_controller.workingOperationList)
router.get('/doneOperationList',operation_controller.doneOperationList)
router.get('/operationCount',operation_controller.operationCount)

router.get('/workerOpCount',operation_controller.workerOpCount)
router.get('/workerOpStamp',operation_controller.workerOpStamp)
router.get('/workerBusinessEquipment',operation_controller.workerBusinessEquipment)
router.get('/workerBusinessAdvance',operation_controller.workerBusinessAdvance)

router.get('/allOpCount',operation_controller.allOpCount)

router.post('/no_list', operation_controller.no_list);
router.get('/getaction/:id', operation_controller.getOperationAction);
router.get('/:id', operation_controller.getOperation);
router.post('/save', operation_controller.add);
router.post('/edit', operation_controller.edit);
router.post('/editSimple', operation_controller.editSimple);




router.get('/delete/:id',operation_controller.delete);


module.exports = router;