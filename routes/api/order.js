/**
 * Created by liumeng on 2017/9/4.
 */
var router = require('koa-router')();
var order_controller = require('../../app/controllers/order');

router.get('/list', order_controller.list);
router.get('/list/page/:pageid', order_controller.list);
router.get('/list/page/:pageid/time/:time', order_controller.list);
router.get('/list/time/:time', order_controller.list);
router.get('/:id', order_controller.getOrder);
router.get('/simple/:id', order_controller.getOrderSimple);
router.post('/save', order_controller.save);

router.post('/saveOrder', order_controller.saveAndSaveOperation);
router.post('/saveOperation', order_controller.saveOperation);

router.get('/delete/:id',order_controller.delete);
router.get('/getorderno/get/:year/:month/:day',order_controller.getOrderNo)

module.exports = router;