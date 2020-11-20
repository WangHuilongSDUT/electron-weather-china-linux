const axios = require("axios").default
const fs=require("fs")

const ali_config=JSON.parse(fs.readFileSync("config.json").toString())

// 万年历接口
const wnl_api="https://jisuwnl.market.alicloudapi.com/calendar/"
// 天气接口
const weather_api="https://saweather.market.alicloudapi.com/area-to-weather"


async function get_lunnar_data(api=wnl_api) {
    const now=new Date()
    const res=await axios.get(api+`query?date=`,{headers: {'Authorization': 'APPCODE '+ali_config["app_code"]}})
    return res.data
}
