<template>
    <img v-if="weatherIcon" :src="weatherIcon">
</template>

<script>
    export default {
        name: "WeatherIcon",
        props: {
            weatherIconName: {
                type: String,
                default: null
            }
        },
        watch: {
            weatherIconName(newVal) {
                if(!newVal)
                    this.weatherIcon = null;
                else
                    this.weatherIcon = require(`@/assets/img/${newVal}.svg`)
            }
        },
        data() {
            return {
                weatherIcon: this.weatherIconName ? require(`@/assets/img/${this.weatherIconName}.svg`) : null
            }
        }
    }
</script>

<style scoped lang="scss">
</style>