var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var https = require('https');
// var sha1 = require('crypto-js/sha1');
var app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set('view engine', 'pug');
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) =>
  res.render('index', { title: 'Hey', message: 'Darling' })
);

var tokenData = {};
var tokenError = false;
var timer = null;
function sleepRefresh(expireTime) {
  let seconed = (expireTime - 60) * 1000; // 提前1分钟刷新token
  if (timer) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      requestToken();
    }, seconed);
  } else {
    timer = setTimeout(() => {
      requestToken();
    }, seconed);
  }
}
// 请示token
function requestToken(req, res, next) {
  var appID = 'wxa54648785fd7e534';
  var appsecret = '2eae5b35fdebcf76cc1ab98c23020e49';
  var optionUrl = {
    hostname: 'api.weixin.qq.com',
    port: 443,
    path: `/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`,
  };
  const request = https.request(optionUrl, response => {
    console.log(`状态码: ${res.statusCode}`);
    // console.log(`请求头: ${JSON.stringify(res.headers)}`);
    response.setEncoding('utf8');
    response.on('data', d => {
      let dataParse = JSON.parse(d);
      tokenData = dataParse;
      sleepRefresh(dataParse.expires_in);
      next();
    });
  });
  request.on('error', e => {
    console.error(e);
    tokenError = true;
    next();
  });
  request.end();
}
app.get('/getToken', requestToken, (req, res) => {
  if (tokenError) {
    res.json({
      errorCode: '0001',
      errorMessage: '获取token失败！',
    });
  } else {
    res.json({
      access_token: tokenData.access_token,
    });
  }
});

app.get('/refreshToken', (req, res) => {
  if (tokenError) {
    res.json({
      errorCode: '0002',
      errorMessage: '刷新token失败！',
    });
  } else {
    res.json({
      access_token: tokenData.access_token,
    });
  }
});

app.listen(3031, () => console.log('Listening on port 3031'));
