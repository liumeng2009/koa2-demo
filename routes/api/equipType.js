/**
 * Created by liumeng on 2017/9/13.
 */
var router = require('koa-router')();
var equipType_controller = require('../../app/controllers/equipType');

router.get('/list', equipType_controller.list);

router.get('/delete/:id', equipType_controller.delete);

router.post('/save',equipType_controller.save);

module.exports = router;