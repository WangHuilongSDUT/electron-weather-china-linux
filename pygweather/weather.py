# -*-coding:utf-8 -*-
import requests
import gi
import json
gi.require_version('Notify', '0.7')

from gi.repository import Notify

weatehrApi='https://www.tianqiapi.com/api/'
cityNumber='101120301'
apiVersion='v1'
cityName='淄博'

def getWeatherJson():
    res=requests.get(weatehrApi,{'version':apiVersion,'cityid':cityNumber,'city':cityName})
    res.encoding='utf-8'
#    print(res.encoding)
    return res.text
#    pass

if '__main__' == __name__:
#    print(getWeatherJson())
    wjson=json.loads(getWeatherJson())
#    print(wjson)
    Notify.init("App Name")
    Notify.Notification.new("天气预报：",(wjson["city"]+":"+wjson["data"][0]["wea"]+
    " 空气指数："+str(wjson["data"][0]["air"])+wjson["data"][0]["air_level"]+
    " 温度："+wjson["data"][0]["tem"]+" "+wjson["data"][0]["tem1"]+"/"+wjson["data"][0]["tem2"]+
    " 提示："+wjson["data"][0]["air_tips"]
    )
    ).show()
#    getWeatherJson()
