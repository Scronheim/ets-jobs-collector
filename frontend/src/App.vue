<template>
    <v-titlebar theme="dark" platform="win32" :show-title="true" :on-close="closeWindow" :on-minimize="minimizeWindow"
        :on-maximize="maximizeWindow">
        <template v-slot:icon>
            <img src="/icon.ico" />
        </template>

        <template v-slot:title>
            ETS Job Collector
        </template>
    </v-titlebar>
    <v-app>
        <v-app-bar density="compact" class="mt-7">
            <v-btn link to="/">Мои заказы</v-btn>
            <v-btn link to="/company" class="ml-3">Моя компания</v-btn>
            <template v-slot:append>
                <v-chip :color="sdkActive ? 'success' : 'error'">Подключен к игре</v-chip>
                <StatusButton :game="game" :job="job"/>
                <v-btn icon="mdi-cog" @click="settingsDialog = true"></v-btn>
            </template>
        </v-app-bar>
        <v-main class="mt-3">
            <router-view :telemetry="telemetry" :jobs="userStore.jobs" />
        </v-main>

        <v-dialog width="600" v-model="settingsDialog">
            <v-card title="Настройки">
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-select chips multiple label="Заголовки таблицы" v-model="userStore.userSettings.headers"
                                :items="allHeaders" item-name="title" item-value="key" return-object />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field label="User UUID" v-model="userStore.userSettings.UUID"></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="success" block @click="saveAndExit">Сохранить и закрыть</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script>
import { ipcRenderer } from 'electron'
import { v4 } from 'uuid'
import truckSimTelemetry from 'trucksim-telemetry'
import { useToast } from 'vue-toastification';
import Jobs from '@/components/Jobs'
import { useUserStore } from './stores/user'
import StatusButton from './components/buttons/StatusButton';

export default {
    setup() {
        const toast = useToast();
        const userStore = useUserStore();
        return { toast, userStore }
    },
    name: 'App',
    components: {
        Jobs,
        StatusButton
    },
    mounted() {
        ipcRenderer.invoke('get-user-settings').then((config) => {
            if (config) {
                this.userStore.userSettings = JSON.parse(config)
            } else {
                this.userStore.userSettings.UUID = v4()
            }
            this.userStore.saveUserSettings()
            this.userStore.getUserJobs(this.userStore.userSettings.UUID, true)
        })
        ipcRenderer.invoke('get-user-company').then((config) => {
            if (config) {
                this.userStore.userCompany = JSON.parse(config)
            }
        })
        this.telemetry.watch({ interval: 10 }, this.update)
    },
    data: () => ({
        game: {},
        truck: {},
        job: {},
        settingsDialog: false,
        allHeaders: [
            { title: 'Дата', align: 'start', sortable: true, key: 'createdAt', removable: true },
            { title: 'Тягач', align: 'start', sortable: true, key: 'car', removable: true },
            { title: 'Откуда', align: 'start', sortable: false, key: 'source.city.name', removable: true },
            { title: 'Куда', align: 'start', sortable: false, key: 'destination.city.name', removable: true },
            { title: 'Груз', align: 'start', sortable: false, key: 'cargo.name', removable: true },
            { title: 'Вес, т', align: 'start', sortable: true, key: 'mass', removable: true },
            { title: 'Запл. дальность', align: 'start', sortable: true, key: 'plannedDistance.km', removable: true },
            { title: 'Пройд. расстояние', align: 'start', sortable: true, key: 'dist', removable: true },
            { title: 'Длительность', align: 'start', sortable: true, key: 'jobTime', removable: true },
            { title: 'Заработок', align: 'start', sortable: true, key: 'money', removable: true },
            { title: 'Опыт, XP', align: 'start', sortable: true, key: 'earnedXP', removable: true },
        ],
        platform: process.platform,
        theme: 'dark',
        isMaximizable: true,
        isMinimizable: true,
        isClosable: true,
        showTitle: true,
        showIcon: true,
    }),
    // watch: {
    //     game(value) {
    //         if(value.paused) {
    //             this.userStore.userStatus = 'paused'
    //         } else {
    //             this.userStore.userStatus = 'unpaused'
    //         }
    //     }
    // },
    computed: {
        telemetry() {
            return truckSimTelemetry()
        },
        sdkActive() {
            return this.telemetry.getGame().sdkActive
        }
    },
    methods: {
        maximizeWindow() {
            ipcRenderer.invoke('maximize-window')
        },
        minimizeWindow() {
            ipcRenderer.invoke('minimize-window')
        },
        closeWindow() {
            ipcRenderer.invoke('close-window')
        },
        saveAndExit() {
            this.userStore.saveUserSettings()
            this.userStore.getUserJobs(this.userStore.userSettings.UUID, true)
            this.settingsDialog = false
        },
        update(data) {
            for (const key of Object.keys(data)) {
                this[key] = data[key]
            }
        }
    },
    unmounted() {
        this.telemetry.stop()
    }
}
</script>

<style>
html {
    overflow-y: hidden !important;
}
</style>
