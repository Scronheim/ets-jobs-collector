import { defineStore } from 'pinia'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import { ipcRenderer } from 'electron'

const toast = useToast()

export const useUserStore = defineStore({
    id: 'userStore',
    state: () => ({
        jobs: [],
        staffJobs: [],
        userSettings: {
            UUID: null,
            headers: [
                { title: 'Дата', align: 'start', sortable: true, key: 'createdAt', removable: true },
                { title: 'Тягач', align: 'start', sortable: true, key: 'car', removable: true },
                { title: 'Откуда', align: 'start', sortable: false, key: 'source.city.name', removable: true },
                { title: 'Куда', align: 'start', sortable: false, key: 'destination.city.name', removable: true },
                { title: 'Груз', align: 'start', sortable: false, key: 'cargo.name', removable: true },
                { title: 'Вес груза, т', align: 'start', sortable: true, key: 'mass', removable: true },
                { title: 'Расстояние', align: 'start', sortable: true, key: 'dist', removable: true },
                { title: 'Длительность', align: 'start', sortable: true, key: 'jobTime', removable: true },
                { title: 'Заработок', align: 'start', sortable: true, key: 'money', removable: true },
                { title: 'Опыт, XP', align: 'start', sortable: true, key: 'earnedXP', removable: true },
            ],
        },
        userCompany: {
            staff: [],
        },
    }),
    actions: {
        saveUserCompany() {
            ipcRenderer.send('save-user-company', JSON.stringify(this.userCompany))
            // toast.success('Настройки компании сохранены')
        },
        saveUserSettings() {
            ipcRenderer.send('save-user-settings', JSON.stringify(this.userSettings))
            // toast.success('Настройки сохранены')
        },
        async getUserJobs(uuid, isMe = false) {
            const response = await axios.get(`http://188.225.31.66:3001/api/jobs?uuid=${uuid}`)
            if (isMe) {
                this.jobs = response.data.data
            } else {
                this.staffJobs = response.data.data
            }
            // toast.success('Список поездок загружен')
        },
        async sendJob(job) {
            try {
                await axios.post('http://188.225.31.66:3001/api/jobs', job)
                toast.success('Заказ успешно сохранён')
                await this.getUserJobs(this.userSettings.UUID, true)
            } catch (e) {
                console.log(e);
            }
        },
    },
    getters: {
        
    }
})