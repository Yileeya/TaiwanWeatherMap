import Vue from 'vue'
import App from './App.vue'
import 'jquery/src/jquery';
import 'fontawesome-4.7';
import 'bootstrap';
import 'lodash';
import "./assets/scss/app.scss";
import store from './store/store';
import './store/mixin';
import VueMeta from 'vue-meta'

import {BootstrapVue} from 'bootstrap-vue';

Vue.use(BootstrapVue);
Vue.use(VueMeta)

new Vue({
    store,
    render: h => h(App)
}).$mount('#app')

