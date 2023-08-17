import { createRouter, createWebHashHistory } from 'vue-router'
import Jobs from '../components/Jobs'
import Company from '../components/Company'

const routes = [
    {
        path: '/',
        name: 'My Jobs',
        component: Jobs,
    },
    {
        path: '/company',
        name: 'My company',
        component: Company,
    },
]

const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
})

export default router