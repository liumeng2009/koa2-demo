var router = require('koa-router')();
var function_controller = require('../../app/controllers/function');

router.get('/list', function_controller.list);

module.exports = router;