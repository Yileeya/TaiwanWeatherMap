<template>
    <div class="row">
        <taiwan-map class="col-md-5" :current-county.sync="currentCounty"/>
        <div class="col-md-7">
            <h1>Taiwan Weather Map</h1>
            <hr>
            <h2 v-if="wx.length">{{ currentCounty }}</h2>
            <section class="weather-div">
                <weather-icon v-if="wx.length" :weather-icon-name="weatherIcon(wx[0].isDaytime, wx[0].value)"/>
                <div>
                    <h2 class="temperature">
                        {{ minTemperature[0] }}<span class="small">℃</span>
                        <span v-show="minTemperature[0] !== maxTemperature[0]"> ~ {{ maxTemperature[0] }}<span class="small">℃</span>
                        </span>
                    </h2>
                    <h4>
                        {{ poP[0]}}<span class="small">％</span>
                        <span class="text" v-if="wx.length">{{ wx[0].name }}</span>
                    </h4>
                </div>
            </section>
            <hr style="width: 90%">
            <section class="sub-area">
                <div class="width-2"
                     :class="[{'top-hr': i === 2}]"
                     v-for="i in 2"
                     :key="i">
                    <div v-if="wx.length" class="sub-title">
                        {{ wx[i].isToday ? '今天' : '明天' }}{{ wx[i].isDaytime ? '白天' : '晚上' }}
                    </div>
                    <div class="sub-area-content">
                        <div>
                            <h5>
                                {{ minTemperature[i] }}<span class="small">℃</span>
                                <span v-show="minTemperature[i] !== maxTemperature[i]"> ~ {{ maxTemperature[i] }}<span class="small">℃</span></span>
                            </h5>
                            <h5>{{ wx.length ? wx[i].name : '-'}}</h5>
                        </div>
                        <div class="pop-percent">
                            {{ poP[i]}}<span class="small">％</span>
                        </div>
                        <weather-icon v-if="wx.length" :weather-icon-name="weatherIcon(wx[i].isDaytime, wx[i].value)"/>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    import TaiwanMap from '@/components/TaiwanMap';
    import axios from 'axios';
    import _ from 'lodash';
    import WeatherIcon from '@/components/WeatherIcon';
    import moment from 'moment';

    export default {
        name: "WeatherMapListPage",
        components: {WeatherIcon, TaiwanMap},
        watch: {
            currentCounty() {
                this.getWeather()
            }
        },
        data() {
            return {
                currentCounty: '臺北市',
                minTemperature: [],
                maxTemperature: [],
                poP: [],
                wx: []
            }
        },
        created() {
            this.getWeather()
        },
        methods: {
            async getWeather() {
                this.$store.commit('UPDATE_IS_LOADING', true);
                let Authorization = 'CWB-0891205C-3293-4CC3-B27E-7A562DA3F9BB';
                let url = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${Authorization}&locationName=${this.currentCounty}`;
                let res = await axios.get(url);
                if(res.status == 200) {
                    let weatherInfos = res.data.records.location[0].weatherElement;
                    _.map(weatherInfos, (r) => {
                        if(r.elementName == 'MinT') {
                            this.minTemperature = r.time.map(t => t.parameter.parameterName);
                        } else if(r.elementName == 'MaxT') {
                            this.maxTemperature = r.time.map(t => t.parameter.parameterName);
                        } else if(r.elementName == 'PoP') {
                            this.poP = r.time.map(t => t.parameter.parameterName);
                        } else if(r.elementName == 'Wx') {
                            this.wx = r.time.map(t => {
                                const startHour = moment(t.startTime).hours();
                                return {
                                    isToday: moment(t.startTime).isSame(new Date(), "day"),
                                    isDaytime: startHour >= 6 && startHour < 18,
                                    name: t.parameter.parameterName,
                                    value: t.parameter.parameterValue
                                }
                            });
                        }
                    })
                }
                this.$store.commit('UPDATE_IS_LOADING', false);
            },
            weatherIcon(isDaytime, valueString) {
                // https://www.cwb.gov.tw/V8/C/K/Weather_Icon.html
                // https://opendata.cwb.gov.tw/opendatadoc/MFC/D0047.pdf
                let state = isDaytime ? 'day' : 'night';
                let value = Number(valueString);
                if(value === 1) { //晴天
                    return state + '-' + 'clear'
                } else if(value === 2 || value === 3) { //多雲時晴
                    return state + '-' + 'cloudy'
                } else if(value === 4 || value === 5 || value === 6 || value === 7) { //多雲
                    return 'cloudy'
                } else if(value === 8 || value === 9 || value === 10 || value === 11 || value === 12 || value === 13 || value === 14) { //下雨
                    return 'rain'
                } else if(value === 19 || value === 20 || value === 29) { //晴時有雨
                    return state + '-' + 'partially-clear-with-rain'
                } else if(value === 15 || value === 16 || value === 17 || value === 18 || value === 23) { //打雷
                    return 'thunderstorm'
                } else if(value === 21 || value === 22) { //偶陣雷雨
                    return state + '-' + 'thunderstorm'
                } else if(value === 24 || value === 25 || value === 26 || value === 27) { //晴時多雲有霧
                    return state + '-' + 'cloudy-fog'
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    $main-color: #E6EBE0;
    $main-green: #9BC1BC;
    .row{
        background-color: #4B5358;
        color:            white;
        align-items:      center;
        .col-md-7{
            margin: 30px 0;
            h1{
                font-size: 3.5rem;
            }
            h2{
                font-weight:    bold;
                letter-spacing: 3px;
                .sub-title{
                    font-size:      0.5em;
                    letter-spacing: 1px;
                }
            }
            hr{
                border-top: 3px solid $main-green;
                width:      150px;
                margin:     1rem 0;
            }
            .small{
                font-size:   0.75em;
                padding:     0 3px;
                font-weight: bold;
            }
            .text{
                margin: 0 15px;
            }
            .sub-area{
                display:   flex;
                flex-wrap: wrap;
                .width-2{
                    .sub-title{
                        margin: 5px 0;
                    }
                    .sub-area-content{
                        display:     flex;
                        align-items: flex-start;
                        .pop-percent{
                            background:      linear-gradient(0.25turn, #b6d8d3e6, #9bc1bc);
                            color:           #4b5358;
                            border-radius:   0.5em;
                            display:         flex;
                            align-items:     baseline;
                            margin:          0 8px;
                            width:           3em;
                            justify-content: center;
                            box-shadow:      1px 1px 2px #82a8a3;
                            .small{
                                padding: 0;
                            }
                        }
                        img{
                            height: 50px;
                            margin: -15px 10px;
                        }
                    }
                }
            }
            .weather-div{
                display:     flex;
                align-items: center;
                img{
                    height:       120px;
                    margin-right: 30px;
                }
            }
        }
    }
    @media (min-width: 992px){
        .width-2{
            width:     50%;
            min-width: 200px;
        }
        border-top:  3px solid #9bc1bc;
        margin-top:  10px;
        padding-top: 10px;
        width:       90%;
    }
    @media (max-width: 992px){
        .width-2{
            width: 90%;
            &.top-hr{
                border-top:  3px solid #9bc1bc;
                margin-top:  10px;
                padding-top: 10px;
            }
        }
    }
</style>