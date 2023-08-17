import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { createPinia } from 'pinia'
import VueTitleBar from '@wuild/vue-titlebar'
import dayjs from 'dayjs'

import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

dayjs.extend(require('dayjs/plugin/duration'))

const pinia = createPinia()
createApp(App)
  .use(vuetify)
  .use(pinia)
  .use(router)
  .use(VueTitleBar)
  .use(Toast, {
    transition: 'Vue-Toastification__bounce',
    maxToasts: 3,
    newestOnTop: true,
    position: POSITION.BOTTOM_CENTER,
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
    draggable: true,
    draggablePercent: 0.7,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: 'button',
    icon: true,
    rtl: false,
  })
  .mount('#app')
