var router = require('koa-router')();
var operation_controller = require('../../app/controllers/operation');

router.get('/list', operation_controller.list);
router.get('/list/page/:pageid', operation_controller.list);
router.get('/:id', operation_controller.getOperation);
router.post('/save', operation_controller.add);
router.post('/edit', operation_controller.edit);


router.get('/delete/:id',operation_controller.delete);


module.exports = router;