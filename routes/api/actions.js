var router = require('koa-router')();
var action_controller = require('../../app/controllers/action');


router.post('/add/:id', action_controller.save);
router.post('/add', action_controller.save);

module.exports = router;