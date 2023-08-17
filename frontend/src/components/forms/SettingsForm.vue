<template>
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
            <v-row>
                <v-col>
                    <v-btn color="error" @click="clearStore">Очистить данные</v-btn>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-btn color="success" block @click="saveAndExit">Сохранить и закрыть</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ipcRenderer } from 'electron'
import { useToast } from 'vue-toastification';
import { useUserStore } from '@/stores/user'

const toast = useToast();
const userStore = useUserStore();
const emits = defineEmits('close')

const allHeaders = [
    { title: 'Дата', align: 'start', sortable: true, key: 'createdAt', removable: true },
    { title: 'Тягач', align: 'start', sortable: true, key: 'car', removable: true },
    { title: 'Откуда', align: 'start', sortable: false, key: 'source.city.name', removable: true },
    { title: 'Куда', align: 'start', sortable: false, key: 'destination.city.name', removable: true },
    { title: 'Груз', align: 'start', sortable: false, key: 'cargo.name', removable: true },
    { title: 'Вес', align: 'start', sortable: true, key: 'mass', removable: true },
    { title: 'Запл. дальность', align: 'start', sortable: true, key: 'plannedDistance.km', removable: true },
    { title: 'Пройд. расстояние', align: 'start', sortable: true, key: 'dist', removable: true },
    { title: 'Длительность', align: 'start', sortable: true, key: 'jobTime', removable: true },
    { title: 'Заработок', align: 'start', sortable: true, key: 'money', removable: true },
    { title: 'Опыт, XP', align: 'start', sortable: true, key: 'earnedXP', removable: true },
]

const clearStore = () => {
    ipcRenderer.invoke('clear-store').then(() => {

    })
}

const saveAndExit = () => {
    userStore.saveUserSettings()
    userStore.getUserJobs(userStore.userSettings.UUID, true)
    emits('close')
}
</script>