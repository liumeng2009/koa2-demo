var router = require('koa-router')();
var function_controller = require('../../app/controllers/function');

router.get('/list', function_controller.list);
router.get('/parent_list', function_controller.parent_list);
router.post('/add',function_controller.add)

module.exports = router;