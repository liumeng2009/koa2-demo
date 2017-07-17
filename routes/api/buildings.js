/**
 * Created by liumeng on 2017/7/7.
 */
var router = require('koa-router')();
var buildings_controller = require('../../app/controllers/building');

router.get('/list', buildings_controller.list);
router.get('/list/page/:pageid', buildings_controller.list);
router.get('/delete/:id', buildings_controller.delete);

router.post('/save',buildings_controller.save);

module.exports = router;