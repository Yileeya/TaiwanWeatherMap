<template>
    <div class="row">
        <taiwan-map class="col-md-5" :current-county.sync="currentCounty"/>
        <div class="col-md-7">
            <h1>Taiwan Weather Map</h1>
            <hr>
            <h2 v-if="wx.length">
                {{currentCounty}}
                <span class="sub-title">{{ wx[0].isToday ? '今天' : '明天' }}{{ wx[0].isDaytime ? '白天' : '晚上' }}</span>
            </h2>
            <section class="weather-div">
                <weather-icon v-if="wx.length" :icon-status="wx[0].value"/>
                <div>
                    <h2 class="temperature">
                        {{ minTemperature[0] }}<span class="small">℃</span> ~
                        {{ maxTemperature[0] }}<span class="small">℃</span>
                    </h2>
                    <h4>
                        {{ poP[0]}}<span class="small">％</span>
                        <span class="text" v-if="wx.length">{{ wx[0].name }}</span>
                    </h4>
                </div>
            </section>
            <hr>
            <section class="sub-area">
                <div class="width-2" v-for="i in 2" :key="i">
                    <div v-if="wx.length" class="sub-title">
                        {{ wx[i].isToday ? '今天' : '明天' }}{{ wx[i].isDaytime ? '白天' : '晚上' }}
                    </div>
                    <div class="sub-area-content">
                        <div>
                            <h5>
                                {{ minTemperature[i] }}<span class="small">℃</span> ~
                                {{ maxTemperature[i] }}<span class="small">℃</span>
                            </h5>
                            <h5>{{ wx.length ? wx[i].name : '-'}}</h5>
                        </div>
                        <div class="pop-percent">
                            {{ poP[i]}}<span class="small">％</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    import TaiwanMap from '@/components/WeatherMap/TaiwanMap';
    import axios from 'axios';
    import _ from 'lodash';
    import WeatherIcon from '@/components/WeatherMap/WeatherIcon';

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
                let Authorization = 'CWB-0891205C-3293-4CC3-B27E-7A562DA3F9BB'
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
                            let today = this.dateFormat(new Date, 'YYYY-MM-DD');
                            this.wx = r.time.map(t => {
                                return {
                                    isToday: t.startTime.slice(0, 10) === today,
                                    isDaytime: t.startTime.slice(11, 13) === '06',
                                    name: t.parameter.parameterName,
                                    value: t.parameter.parameterValue
                                }
                            });
                        }
                    })
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
                    width:     50%;
                    min-width: 200px;
                    .sub-title{
                        margin: 5px 0;
                    }
                    .sub-area-content{
                        display:     flex;
                        align-items: flex-start;
                        .pop-percent{
                            background:      $main-green;
                            color:           #4b5358;
                            border-radius:   0.5em;
                            display:         flex;
                            align-items:     baseline;
                            margin:          0 8px;
                            width:           3em;
                            justify-content: center;
                            .small{
                                padding: 0;
                            }
                        }
                    }
                }
            }
            .weather-div{
                display:     flex;
                align-items: center;
            }
        }
    }
</style>