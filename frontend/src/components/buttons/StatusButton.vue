<template>
    <v-chip class="ml-2" :color="statusColor" :text="statusText"></v-chip>
    <!-- <v-chip v-if="status === STATUSES.ONJOB" class="ml-2" color="blue">{{ jobTimeDuration }}</v-chip> -->
</template>

<script setup>
import dayjs from 'dayjs';
import { computed } from 'vue';
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const props = defineProps(['game', 'job'])

const STATUSES = {
    PAUSED: 1,
    ONJOB: 2,
    FREE: 3,
    TOJOB: 4,
}

const jobTimeDuration = computed(() => {
    return dayjs.duration(userStore.jobTimeInSec, 's').format('HH:mm:ss')
})

const status = computed(() => {
    if (props.game?.paused) {
        return STATUSES.PAUSED
    } else {
        if (props.job?.cargo?.isLoaded) {
            return STATUSES.ONJOB
        }
        return STATUSES.FREE
    }
})

const statusColor = computed(() => {
    switch (status.value) {
        case STATUSES.PAUSED:
            return 'yellow'
        case STATUSES.ONJOB:
            return 'success'
        case STATUSES.FREE:
            return 'blue'
        default:
            return 'yellow'
    }
})

const statusText = computed(() => {
    switch (status.value) {
        case STATUSES.PAUSED:
            return 'Пауза'
        case STATUSES.ONJOB:
            return 'На заказе'
        case STATUSES.FREE:
            return 'Свободен'
        default:
            return 'Пауза'
    }
})

</script>