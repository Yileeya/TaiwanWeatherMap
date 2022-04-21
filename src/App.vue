<template>
    <div id="app">
        <weather-map-list-page/>
        <footer-view/>
        <transition>
            <loading-view v-show="createLoading || isLoading"/>
        </transition>
    </div>
</template>

<script>
    import WeatherMapListPage from '@/components/WeatherMapListPage';
    import FooterView from '@/components/Common/FooterView';
    import LoadingView from '@/components/Common/LoadingView';
    import {mapState} from 'vuex';

    export default {
        name: 'App',
        metaInfo: {
            title: 'Taiwan Weather Map',
            meta: [{                 // set meta
                name: 'keyWords',
                content: 'My Example App'
            }]
        },
        components: {
            LoadingView,
            FooterView,
            WeatherMapListPage
        },
        computed: {
            ...mapState({
                isLoading: state => state.isLoading
            })
        },
        data() {
            return {
                createLoading: true
            }
        },
        created() {
            setTimeout(() => {
                this.createLoading = false;
            }, 1000);
        }
    }
</script>

<style>
    .v-leave{
        opacity: 1;
    }
    .v-leave-active{
        transition: opacity 1.5s;
    }
    .v-leave-to{
        opacity: 0;
    }
    .v-enter{
        opacity: 0;
    }
    .v-enter-active{
        transition: opacity 0.2s;
    }
    .v-enter-to{
        opacity: 1;
    }
</style>

