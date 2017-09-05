/**
 * Created by liumeng on 2017/9/4.
 */
var router = require('koa-router')();
var order_controller = require('../../app/controllers/order');

router.get('/list', order_controller.list);
router.get('/list/page/:pageid', order_controller.list);
router.post('/add', order_controller.save);
router.get('/delete/:userid',order_controller.delete);

module.exports = router;