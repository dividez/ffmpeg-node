var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var log4js = require('log4js');
log4js.configure({
  appenders: {
    infoLogs: {
      type: 'file',
      filename: 'logs/info/file.log',
      maxLogSize: 104857600, // 100mb,日志文件大小,超过该size则自动创建新的日志文件
      backups: 40,  // 仅保留最新的40个日志文件
      compress: true    //  超过maxLogSize,压缩代码
    },
    errorLogs: {
      type: 'file',
      filename: 'logs/error/file.log',
      maxLogSize: 10485760,
      backups: 20,
      compress: true
    },
    justErrors: {
      type: 'logLevelFilter', // 过滤指定level的文件
      appender: 'errorLogs',  // appender
      level: 'error'  // 过滤得到error以上的日志
    },
    console: {type: 'console'}
  },
  categories: {
    default: { appenders: ['console', 'justErrors', 'infoLogs'], level: 'info' },
    err: { appenders: ['errorLogs'], level: 'error' },
  }
});
var logger = log4js.getLogger();
app.use(log4js.connectLogger(logger , { level: 'info' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({
    'message' : err.message,
    'status' : err.status,
  });
});

module.exports = app;
