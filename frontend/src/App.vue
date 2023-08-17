<template>
    <v-titlebar theme="dark" platform="win32" :show-title="true" :on-close="closeWindow" :on-minimize="minimizeWindow"
        :on-maximize="maximizeWindow">
        <template v-slot:icon>
            <img src="/icon.ico" />
        </template>

        <template v-slot:title>ETS Job Collector</template>
    </v-titlebar>
    <v-app>
        <v-app-bar density="compact" class="mt-7">
            <v-btn link to="/">Мои заказы</v-btn>
            <v-btn link to="/company" class="ml-3">Моя компания</v-btn>
            <template v-slot:append>
                <v-chip :color="sdkActive ? 'success' : 'error'">{{ sdkActive ? 'Подключен к игре': 'Нет подключения' }}</v-chip>
                <StatusButton v-if="sdkActive" :game="game" :job="job"/>
                <v-btn icon="mdi-cog" @click="settingsDialog = true"></v-btn>
            </template>
        </v-app-bar>
        <v-main class="mt-3">
            <router-view :telemetry="telemetry" :jobs="userStore.jobs" />
        </v-main>

        <v-dialog width="600" v-model="settingsDialog">
            <SettingsForm @close="settingsDialog = false"/>
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
import SettingsForm from './components/forms/SettingsForm.vue';

export default {
    setup() {
        const toast = useToast();
        const userStore = useUserStore();
        return { toast, userStore }
    },
    name: 'App',
    components: {
    Jobs,
    StatusButton,
    SettingsForm
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
            return this.telemetry.getGame()?.sdkActive
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
