var router = require('koa-router')();
var indexController=require('../app/controllers/index');

router.get('/', indexController.index);

module.exports = router;
