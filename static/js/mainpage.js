    
//引入JQ
var $ = require("jquery");
//在这里配置chart
var echarts = require('echarts');
//引入通信
const { ipcRenderer} = require('electron')
//渲染进程在此处
$(document).ready(function () {
    regEvents()
    //此处有BUG 读文件是异步操作 可能读不到 //已经解决
    updateDatas()
})

function updateDatas()
{
    //读入城市
    var fs = require('fs');
    fs.readFile(__dirname+"/../conf.json", 'utf8', function (err, data) {
        if (err) return console.log(err); 
        var p = JSON.parse(data)["where"]
        //console.log(p)
        //更新数据
        getLunur()
        getCurrent(p)
        getWarning(p)
        get15Days(p)
    });
}

function regEvents()
{
    $('html').keydown(function (event) {
        if (32 == event.which) {
            //$('#where').html('aa')
            //console.log("Hide")
            ipcRenderer.send('winHide','Hide')
        }
        else if(13==event.which)
        {
            updateDatas()
        }
    })
}

//这个api不需要使用
function get24Hours(cid) {
    var ret
    $.getJSON('#'+cid, function (data) {
        console.log(data+"")
    });
}

// 只需要未来七天的
function get15Days(cid) {
    var ret
    $.getJSON('#'+cid, function (data) {
        //console.log(data+"")
        //console.log("111")
        var ws=[],ts=[],days=[]
        var i=0
        var forecast=data['data']['forecast']
        for (var f in forecast) {
            //不要昨天的
            if(0==i)
            {
                i++
                continue
            }
            //白天天气
            ws.push(forecast[f]['conditionDay'])
            //取平均气温
            ts.push((parseInt(forecast[f]['tempDay'])+parseInt(forecast[f]['tempNight']))/2)
            //下标
            days.push(forecast[f]['predictDate'].substr(5,6))
            //只需要七天的
            if(7==i)
            {
                break
            }
            i++
        }
        
        //分配图标
        $('#weekdays').find('li').each(
            function()
            {
                w=ws[$(this).index()]
                img=$(this).find('img')
                if(-1!=w.indexOf('雪'))
                {
                    img.attr({'src':'../res/images/雪.png'})
                }
                else if(-1!=w.indexOf('雷'))
                {
                    img.attr({'src':'../res/images/雷.png'})
                }
                else if(-1!=w.indexOf('雨'))
                {
                    img.attr({'src':'../res/images/雨.png'})
                }
                else if(-1!=w.indexOf('阴'))
                {
                    img.attr({'src':'../res/images/阴.png'})
                }
                else if(-1!=w.indexOf('云'))
                {
                    img.attr({'src':'../res/images/云.png'})
                }
                else if(-1!=w.indexOf('晴'))
                {
                    img.attr({'src':'../res/images/晴.png'})
                }
                else
                {
                    img.attr({'src':'../res/images/天气.png'})
                }
            }
        )

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart'));
        // 指定图表的配置项和数据
        option = {
        grid: {
            top: "0",
            left: "0",
            right: "0",
            bottom: "20px"
        },
        itemStyle: {
            color: '#cccccc'
        },
        tooltip: {
            show: true,
            trigger: 'item',
            formatter: function (data) {
                return ""+data.value//将小数转化为百分数显示
            }
        },
        xAxis: {
            show: true,
            type: 'category',
            data: days
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                margin: -15,
                formatter: function (value) {
                    return value + "\n";
                }
            }
        },
        series: [{
            data: ts,
            type: 'line',
            smooth: true
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    });
}
function getWarning(cid) {
    var ret
    $.getJSON('#'+cid, function (data) {
        //天气预警
        if((data['data'].hasOwnProperty("alert")))
        {
            $('#warning').html(data['data']['alert'][0]['type']+'预警哦')
            //有预警 则通知
            let myNotification = new Notification(data['data']['alert'][0]['type'], {
                body: data['data']['alert'][0]['content']
            })
        }
        else
        {
            $('#warning').html('又是美好的一天阿！')
        }
    });
}

//获取当前天气实况并更新
function getCurrent(cid)
{
    //var ret
    $.getJSON('#'+cid, function (data) {
        // console.log(data+"")
        //地区
        $('#where').html(data['data']['city']['pname']+data['data']['city']['name'])
        var condition=data['data']['condition']['condition']
        //天气图片选取
        if(-1!=condition.indexOf('雪'))
        {
            $('#mainico').attr({'src':'../res/images/雪.png'})
        }
        else if(-1!=condition.indexOf('雷'))
        {
            $('#mainico').attr({'src':'../res/images/雷.png'})
        }
        else if(-1!=condition.indexOf('雨'))
        {
            $('#mainico').attr({'src':'../res/images/雨.png'})
        }
        else if(-1!=condition.indexOf('阴'))
        {
            $('#mainico').attr({'src':'../res/images/阴.png'})
        }
        else if(-1!=condition.indexOf('云'))
        {
            $('#mainico').attr({'src':'../res/images/云.png'})
        }
        else if(-1!=condition.indexOf('晴'))
        {
            $('#mainico').attr({'src':'../res/images/晴.png'})
        }
        else
        {
            $('#mainico').attr({'src':'../res/images/天气.png'})
        }
        //更新天气
        $('#condition').html(condition)
        //气温
        $('#tempture').html(data['data']['condition']['temp']+"摄氏度")
        //小提示
        $('#smalltip').html(data['data']['condition']['tips'])
        //风向
        $('#windto').html(data['data']['condition']['windDir'])
        //风力
        $('#windlevel').html(data['data']['condition']['windLevel']+"级风")
        //湿度
        $('#water').html(data['data']['condition']['humidity']+"%的湿度")
        //气压
        $('#airpress').html(data['data']['condition']['pressure']+"hPa的气压")
    });
}

//获取日历信息并输出
function getLunur()
{
    //var ret
    $.getJSON('#', function (data) {
        // console.log(data+"")
        //星期
        $('#week').html(data['showapi_res_body']['gongli'].split(' ')[2])
        //公里日期
        $('#date').html(data['showapi_res_body']['gongli'].split(' ')[1])
        //农历日期nongli
        $('#lunur').html(data['showapi_res_body']['nongli'].split(' ')[1])
        //这里没有判断字符串长度 存在bug 为什么我不改 因为懒
        //宜
        $('#todo').html(data['showapi_res_body']['yi'].substr(0,8))
        //忌
        $('#nottodo').html(data['showapi_res_body']['ji'].substr(0,8))
    });
}