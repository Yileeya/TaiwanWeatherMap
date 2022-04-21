import moment from 'moment';
import Vue from 'vue';

const methods = {
    dateFormat(date, format) {
        if(!date)
            return null;

        if(date instanceof Date) {
            return moment(date).format(format);
        } else {
            date = date.replace(/-/g, '/');
            return moment(date).format(format);
        }
    }
};
Vue.mixin({
    methods: methods
});

export default methods;
