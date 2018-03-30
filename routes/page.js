var router = require('koa-router')();
var pageController=require('../app/controllers/page');

router.get('/order/:id', pageController.order);
router.get('/operation/:id',pageController.operation);

module.exports = router;