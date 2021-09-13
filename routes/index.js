const express = require('express');
const router = express.Router();
const log4js = require("log4js");
const logger = log4js.getLogger();
var ffmpeg = require('fluent-ffmpeg');
const extractFrames = require('ffmpeg-extract-frames')
var cors = require('cors')
//'var' is used instead of 'let' or 'const'
// 参考：https://luneshao.github.io/2020/2020-04-07-fluent-ffmpeg-api/
// 参考：https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/blob/master/examples/
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Taiji Video'});
});

router.post('/video/process/audio', function (req, res) {
    logger.info(req.body);

    res.status(201).send()  // 设置请求成功状态码 201
});

router.get('/test/video-to-audio', (req, res) => {
    res.contentType('audio/mp3');
    res.attachment('myfile.mp3');
    // 测试视频：http://192.168.5.39:8099/storage/lizhi-GuanYuZhengZhouDeJiYi.mp4
    var pathToAudio = 'http://192.168.5.39:8099/storage/lizhi-GuanYuZhengZhouDeJiYi.mp4';
    ffmpeg(pathToAudio)
        .toFormat('mp3')
        .on('end', function (err) {
            logger.info('done!')
            console.log('done!')
        })
        .on('error', function (err) {
            console.log('an error happened: ' + err.message);
            logger.info('an error happened: ' + err.message);
        })
        .pipe(res, {end: true})
});

router.get('/test/video-to-images', (req, res) => {
    var pathToAudio = 'http://192.168.5.39:8099/storage/lizhi-GuanYuZhengZhouDeJiYi.mp4';

    // offsets 以毫秒为单位
    async function a() {
        extractFrames({
            input: pathToAudio,
            output: '/data/media/store/screenshot-%i.jpg',
            offsets: [
                1000,
                10000,
                20000,
                30000,
                40000,
                50000,
                60000,
                70000,
                80000
            ]
        }).then(r => function () {
            logger.info("finish")
        })
    }

    a().then(r => function () {
        logger.info('finished')
    });
    res.status(200).send({
        'message': 'success',
        'status': 200,
    });
});


module.exports = router;
