/**
 * Created by liumeng on 2017/8/24.
 */
var router = require('koa-router')();
var businessContent_controller = require('../../app/controllers/businessContent');

router.get('/list', businessContent_controller.list);
router.get('/list/page/:pageid', businessContent_controller.list);
router.get('/:id',businessContent_controller.get);

router.post('/save',businessContent_controller.save);

router.get('/getequip/get/:typename',businessContent_controller.getEquipment)
router.get('/getequip/get',businessContent_controller.getEquipment)
router.get('/delete/:id',businessContent_controller.delete)

module.exports = router;