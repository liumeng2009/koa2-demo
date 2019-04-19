var router = require('koa-router')();
var pageController=require('../app/controllers/page');

router.get('/order/:id', pageController.order);
router.get('/operation/:id',pageController.operation);
router.get('/yearsheet',pageController.yearSheet);

module.exports = router;