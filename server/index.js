const axios = require("axios").default
const fs=require("fs")

const ali_config=JSON.parse(fs.readFileSync("config.json").toString())

// 万年历接口
const wnl_api="https://jisuwnl.market.alicloudapi.com/calendar/"
// 天气接口
const weather_api="https://saweather.market.alicloudapi.com/area-to-weather"


async function get_lunnar_data(api) {
    const res=axios({
        method: 'get',
        url: wnl_api,
        data: {
            headers: {'Authorization': 'XMLHttpRequest'},
        }
      })
}