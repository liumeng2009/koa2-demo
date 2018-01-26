var router = require('koa-router')();
var operate_controller = require('../../app/controllers/operate');

router.get('/list', operate_controller.list);

module.exports = router;