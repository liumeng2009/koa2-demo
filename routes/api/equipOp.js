/**
 * Created by liumeng on 2017/9/13.
 */
var router = require('koa-router')();
var equipOp_controller = require('../../app/controllers/equipOp');

router.get('/list', equipOp_controller.list);

router.get('/delete/:id', equipOp_controller.delete);

router.post('/save',equipOp_controller.save);

module.exports = router;