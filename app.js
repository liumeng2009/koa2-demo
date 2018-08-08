const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
//const bodyparser = require('koa-bodyparser')();
const koaBody = require('koa-body');
const Keygrip = require("keygrip");
const cors=require('koa-cors');
const index = require('./routes/index');
const page = require('./routes/page');
const users = require('./routes/users');
const api=require('./routes/api/index');
const admin=require('./routes/admin');




// middlewares
//app.use(convert(bodyparser));
app.use(koaBody({ multipart: true }));
app.use(convert(json()));
//app.use(convert(logger()));
app.use(convert(require('koa-static')(__dirname + '/public')));

app.use(views(__dirname + '/views', {
  extension: 'jade'
}));

// app.use(views(__dirname + '/views-ejs', {
//   extension: 'ejs'
// }));

//log工具
const logUtil=require('./util/log_util');

// logger
app.use(async (ctx, next) => {
  //响应开始时间
  const start = new Date();
  //响应间隔时间
  var ms;
  try {
    //开始进入到下一个中间件
    await next();
    ms = new Date() - start;
    //记录响应日志
    logUtil.logResponse(ctx, ms);

  } catch (error) {
    ms = new Date() - start;
    //记录异常日志
    logUtil.logError(ctx, error, ms);
  }
});


// logger
//app.use(async (ctx, next) => {
//  const start = new Date();
//  await next();
//  const ms = new Date() - start;
//  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
//});

//middlewares
const response_formatter=require('./middlewares/response_formatter');
const logger_add=require('./middlewares/logger');
const isLogin=require('./middlewares/back/isLogin');
const errorApi=require('./middlewares/error');

app.keys = ['im a newer secret', 'i like turtle'];
app.keys = new Keygrip(['im a newer secret', 'i like turtle'], 'sha256');

//app.use(response_formatter);
app.use(logger_add);
//app.use(response_formatter('^/api'));
app.use(errorApi);

var corsOptions = {
  origin: '*'
};
app.use(cors(corsOptions));

app.use(isLogin);


router.use('/', index.routes(), index.allowedMethods());
router.use('/page', page.routes(), page.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());
router.use('/api', api.routes(), api.allowedMethods());
router.use('/admin', admin.routes(), admin.allowedMethods());

app.use(router.routes(), router.allowedMethods());



// response

app.on('error', function(err, ctx){
  console.log(err)
  log.error('server error', err, ctx);
});

module.exports = app;