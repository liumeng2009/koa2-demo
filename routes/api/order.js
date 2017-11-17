/**
 * Created by liumeng on 2017/9/4.
 */
var router = require('koa-router')();
var order_controller = require('../../app/controllers/order');

router.get('/list', order_controller.list);
router.get('/list/page/:pageid', order_controller.list);
router.get('/:id', order_controller.getOrder);
router.post('/save', order_controller.save);

router.post('/saveOrder', order_controller.saveAndSaveOperation);

router.get('/delete/:userid',order_controller.delete);
router.get('/getorderno/get/:year/:month/:day',order_controller.getOrderNo)

module.exports = router;