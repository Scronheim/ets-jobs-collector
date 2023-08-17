<template>
    <v-card class="ma-2">
        <v-card-text>
            <v-row>
                <v-col cols="2">
                    <v-autocomplete label="Сотрудники" :items="userStore.userCompany.staff" item-title="name"
                        item-value="uuid" v-model="selectedStaff" @update:modelValue="requestUserInfo"></v-autocomplete>
                </v-col>
                <v-col>
                    <v-btn icon="mdi-plus" color="success" @click="addUserDialog = true"></v-btn>
                    <v-btn icon="mdi-delete" color="error" :disabled="selectedStaff === ''" @click="removeStaffFromCompany"></v-btn>
                </v-col>
            </v-row>
            <template v-if="userStore.staffJobs.length">
                <Jobs :telemetry="props.telemetry" :jobs="userStore.staffJobs"/>
            </template>
        </v-card-text>
    </v-card>

    <v-dialog width="auto" v-model="addUserDialog">
        <v-card title="Добавление нового сотрудника">
            <v-card-text>
                <v-row>
                    <v-col>
                        <v-text-field label="Отображаемое имя" v-model="newStaff.name" />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-text-field label="UUID" v-model="newStaff.uuid" />
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="success" :disabled="newStaff.name === '' || newStaff.uuid === ''"
                    @click="addNewStaff">Добавить</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import Jobs from './Jobs';

const userStore = useUserStore();

const props = defineProps(['telemetry', 'jobs'])

const addUserDialog = ref(false)
const selectedStaff = ref('')
const newStaff = ref({
    name: '',
    uuid: '',
})

const addNewStaff = () => {
    userStore.userCompany.staff.push(newStaff.value)
    userStore.saveUserCompany()
    addUserDialog.value = false
}

const requestUserInfo = (uuid) => {
    userStore.getUserJobs(uuid)
}

const removeStaffFromCompany = () => {
    userStore.userCompany.staff = userStore.userCompany.staff.filter(staff => staff.uuid !== selectedStaff.value)
    selectedStaff.value = ''
    userStore.staffJobs = []
    userStore.saveUserCompany()
}
</script>

<style scoped></style>