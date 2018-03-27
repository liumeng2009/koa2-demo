var router = require('koa-router')();
var indexController=require('../app/controllers/index');

router.get('/', indexController.index);
router.get('/operation/:id',indexController.operation)

module.exports = router;
