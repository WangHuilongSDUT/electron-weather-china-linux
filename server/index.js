const axios = require("axios").default
const fs = require("fs")

const ali_config = JSON.parse(fs.readFileSync("config.json").toString())

/****************************************************** 基本功能函数 ******************************************************************* */

// 获取万年历
async function get_lunnar_data() {
    const now = new Date()
    //使用aliyun市场的万年历接口
    try {
        const res = await axios.get("https://jisuwnl.market.alicloudapi.com/calendar/" + `query?date=`, { headers: { 'Authorization': 'APPCODE ' + ali_config["app_code"] } })
    } catch (e) {
        console.log(e)
    }
    return res.data
}

// 获取24小时天气
async function get_weather24_data(place = "闵行区") {
    try {
        const res = await axios.get("http://saweather.market.alicloudapi.com/hour24?area=" + encodeURI(place), { headers: { 'Authorization': 'APPCODE ' + ali_config["app_code"] } })
    } catch (e) {
        console.log(e)
    }
    return res.data
}

//获取每周天气
async function get_weather7_data(place = "闵行区") {
    try {
        const res = await axios.get(`https://saweather.market.alicloudapi.com/area-to-weather?area=${encodeURI(place)}&needAlarm=1&needIndex=1&needMoreDay=1`, { headers: { 'Authorization': 'APPCODE ' + ali_config["app_code"] } })
    } catch (e) {
        console.log(e)
    }
    return res.data
}


/**************************************************** 服务器内容 ************************************************************************************* */

const Koa = require('koa')
const Router = require('koa-router')

const server = new Koa()
const router = new Router()

router.get('/GetLunnarData', async (ctx, next) => {
    ctx.body = await get_lunnar_data()
}).get('/GetWeather7Data', async (ctx, next) => {
    ctx.body = await get_weather7_data(ctx.query?.place)
}).get('GetWeather24Data', async (ctx, next) => {
    ctx.body = await get_weather24_data(ctx.query?.place)
})

server
    .use(router.routes()).use(router.allowedMethods())

server.listen(8000)
console.log("Listening on 8000")