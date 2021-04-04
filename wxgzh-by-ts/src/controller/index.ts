
// var path = require('path');
// var bodyParser = require('body-parser');
import { json } from 'body-parser';
import sha1 from 'crypto-js/sha1';


export const index = (ctx: any, next: any) => {
    ctx.body = 'Hello World!';
    next();
}

// 微信初始化
export const init = (ctx: any, next: any) => {

    const { request, response } = ctx;
    if (request.method === 'GET') {
        let token = 'ziyi3200';
        let { signature, timestamp, nonce, echostr } = request.query;
        if (echostr) {
            var tempArr = [timestamp, nonce, token];
            tempArr.sort();
            var tempStr = sha1(tempArr.join('')).toString();
            if (tempStr === signature) {
                response.type = 'application/json';
                response.body = echostr;
            } else {
                response.body = "sorry, Don't be allowed.";
            }
        } else {
            response.type = 'application/json';
            response.body = { name: 'test name' };
            // console.log(JSON.stringify(request._body));
            next();
        }
    } else if (request.method === 'POST') {
        let xmlData = request.body.xml;
        let nowTime = new Date().getTime();
        let sendXmlData = `<xml>
                                <ToUserName><![CDATA[${xmlData.FromUserName}]]></ToUserName>
                                <FromUserName><![CDATA[${xmlData.ToUserName}]]></FromUserName>
                                <CreateTime>${nowTime}</CreateTime>
                                <MsgType><![CDATA[text]]></MsgType>
                                <Content><![CDATA[Darling，谢谢你的关注呢😊 ]]></Content>
                            </xml>`;

        response.body = sendXmlData;
        next();

    } else {
        ctx.body = 'This is a test page.';
        next();

    }

}

