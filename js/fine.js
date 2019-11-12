$(function () {

    //基础路径
    var baseUrl = './img/'

    //配置天气图标
    var weatherIcons = {
        yun: {
            title: '多云',
            icon: 'yun.png'
        },

        qing: {
            title: '晴',
            icon: 'qing.png'
        },

        lei: {
            title: '雷阵雨',
            icon: 'lei.png'
        },
        yu: {
            title: '小雨',
            icon: 'xiao.png'
        },
        yin: {
            title: '阴',
            icon: 'yin.png'
        },

        //未知天气的默认图标
        default: {
            title: '未知',
            icon: ''
        }
    }


    //获取天气数据
    function getdayData(city) {

        //判断
        var data = {
            appid: '99289619',
            appsecret: 'lKZxT1w9',
            version: 'v6',
        };

        if (city !== undefined) {
            data.city = city;
        }

        $.ajax({
            type: 'GET',
            url: 'https://www.tianqiapi.com/api',
            data: data,
            dataType: 'jsonp',
            success: function (data) {
                console.log('data ==>', data);

                //获取定位位置
                $('.location-city').text(data.city);

                //绑定实况天气

                var weatherData = ['city', 'tem', 'wea', 'air_level', 'date', 'week'];

                for (var i = 0; i < weatherData.length; i++) {
                    if (weatherData[i] === 'wea') {
                        $('.' + weatherData[i]).css({
                            backgroundImage: 'url(' + baseUrl + (weatherIcons[data.wea_img] == undefined ? weatherIcons.default : weatherIcons[data.wea_img]).icon + ')',
                        });
                    } else {
                        $('.' + weatherData[i]).text(weatherData[i] === 'tem' ? data[weatherData[i]] + '℃' : data[weatherData[i]]);
                    }
                    
                    // if (wetherData[i] === 'city') {
                    //     wetherData[i].text(data.city + '市');
                    // }
                }
                        


                $('.city').text(data.city + '市');
                // $('.tem').text(data.tem + '℃');
                // // $('.wea').
                // $('.air_level').text(data.air_level);
                // $('.date').text(data.date);
                // $('.week').text(data.week);

                //获取24消失天气和未来6天天气
                var params = {
                    appid: '99289619',
                    appsecret: 'lKZxT1w9',
                    version: 'v9',
                };

                if (city !== undefined) {
                    params.city = city;
                }

                $.ajax({

                    type: 'GET',
                    url: 'https://www.tianqiapi.com/api',
                    data: params,
                    dataType: 'jsonp',
                    success: function (result) {
                        console.log('data ==>', result);

                        //绑定24消失天气数据
                        var hoursWeatherData = result.data[0].hours;
                        console.log(hoursWeatherData)

                        $.each(hoursWeatherData, function (i, v) {
                            var li = $(` <li>
                            <div>${v.hours}</div>
                            <div class="all-day-icon" style= "background-image: url('${baseUrl + (weatherIcons[v.wea_img] == undefined ? weatherIcons.default : weatherIcons[v.wea_img]).icon}')"></div>                            
                            <div>${v.tem}</div>
                            <div>${v.win}</div>
                        </li>`);

                            $('#hoursWeather').append(li);
                            console.log(v.tem);
                        })

                        //未来6天天气
                        var tomorrowdata = result.data.slice(1);
                        console.log(tomorrowdata);

                        $.each(tomorrowdata, function (i, v) {
                            var li = $(` <li class="clearfix">
                            <span>${v.day.replace(/（星期[一二三四五六日]）/, '')}</span>
                            <span>
                                <i class="tomorrow-icon" style= "background-image: url('${baseUrl + (weatherIcons[v.wea_img] == undefined ? weatherIcons.default : weatherIcons[v.wea_img]).icon}')"></i>
                            </span>
                            <span>${v.tem2 + '℃ ~' + v.tem1 + '℃'}</span>
                            <span class="wri">${v.win[1]}</span>
                        </li>`);

                            $('#tomorrowFine').append(li);
                        })
                    }
                })

            }
        })

    }

    getdayData();

    //搜索
    $('.search-icon').on('click', function () {
        //获取搜索城市
        console.log('aaa')
        var city = $('.search-ipt').val();

        if (city == undefined || city.trim() == '') {
            return;
        }

        console.log(city);


        $('#hoursWeather,#tomorrowFine').empty();

        console.log(city);

        getdayData(city);

    })
})