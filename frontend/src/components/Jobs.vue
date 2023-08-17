<template>
    <v-data-table :items="jobs" :headers="userStore.userSettings.headers" item-value="_id" items-per-page-text="Заказов на страницу" :items-per-page-options="[]">
        <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <tr>
                <template v-for="column in columns" :key="column.key">
                    <td>
                        <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{ column.title }}</span>
                        <template v-if="isSorted(column)">
                            <v-icon :icon="getSortIcon(column)"></v-icon>
                        </template>
                        <v-icon size="15" v-if="column.removable" icon="$close" @click="() => removeHeader(column.key)"></v-icon>
                    </td>
                </template>
            </tr>
        </template>
        <template v-slot:item.car="{ item }">
            {{ item.selectable.truck?.brand }} - {{ item.selectable.truck?.model }}
        </template>
        <template v-slot:item.mass="{ item }">
            <v-chip color="blue">{{ (item.selectable.cargo.mass / 1000).toFixed(2) }}</v-chip>
        </template>
        <template v-slot:item.dist="{ item }">
            <v-chip color="blue">{{ item.selectable.distance.km }} км / {{ item.selectable.distance.miles.toFixed(2) }} миль</v-chip>
        </template>
        <template v-slot:item.jobTime="{ item }">
            <v-chip color="blue">{{ getJobTime(item.selectable) }}</v-chip>
        </template>
        <template v-slot:item.money="{ item }">
            <v-chip color="green">{{ item.selectable.revenue.rub }}₽ / {{ item.selectable.revenue.euro}}€</v-chip>
        </template>
        <template v-slot:item.earnedXP="{ item }">
            <v-chip color="yellow">{{ item.selectable.earnedXP }}</v-chip>
        </template>
    </v-data-table>
</template>

<script>
import { useToast } from 'vue-toastification';
import dayjs from 'dayjs'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { useUserStore } from './../stores/user'

export default {
    setup() {
        const toast = useToast();
        const userStore = useUserStore();

        return { toast, userStore }
    },
    name: "Jobs",
    props: {
        telemetry: {
            type: Object,
            required: true,
        },
        jobs: {
            type: Array,
            required: true,
        }
    },
    components: {
        VDataTable,
    },
    computed: {
        
    },
    data: () => ({
        
    }),
    methods: {
        removeHeader(key) {
            this.userStore.userSettings.headers = this.userStore.userSettings.headers.filter(header => header.key !== key)
            this.userStore.saveUserSettings()
        },
        getJobTime(job) {
            return dayjs.duration(job.deliveredTimestamp.value - job.startedTimestamp.value, 's').format('HH [ч.] mm [м.] ss [сек.]')
        },
        async sendJob(job) {
            const truck = {
                brand: this.telemetry.data.truck.brand.name,
                model: this.telemetry.data.truck.model.name,
            }
            const rubRatio = 95.5595567867036
            const revenueInRub = Math.ceil(rubRatio * job.revenue)
            const sendingJob = {
                ...job,
                revenue: {
                    rub: revenueInRub,
                    euro: job.revenue,
                },
                truck,
                userAdded: this.userStore.userSettings.UUID
            }
            try {
                this.userStore.sendJob(sendingJob)
            } catch (e) {
                this.toast.error(e)
            }
        }
    },

    mounted() {
        // Game events
        // this.telemetry.game.on(
        //   "connected",
        //   () => this.logIt("game", "Connected")
        // )

        // this.telemetry.game.on(
        //   "disconnected",
        //   () => this.logIt("game", "Disconnected")
        // )

        // this.telemetry.game.on(
        //   "pause",
        //   (isPaused) => this.logIt("game", isPaused ? "Paused" : "Unpaused")
        // )

        // this.telemetry.game.on(
        //   "fine",
        //   (fine) => this.logIt("game", `${fine.offence.name}, ${this.currency}${fine.amount.toLocaleString()} fine`)
        // )

        // this.telemetry.game.on(
        //   "tollgate",
        //   (tollgate) => this.logIt("game", `Toll paid ${this.currency}${tollgate.amount.toLocaleString()}`)
        // )

        // this.telemetry.game.on(
        //   "ferry",
        //   (ferry) => this.logIt("game", `Ferry (${ferry.source.name} -> ${ferry.destination.name})`)
        // )

        // this.telemetry.game.on(
        //   "train",
        //   (train) => this.logIt("game", `Train (${train.source.name} -> ${train.destination.name})`)
        // )

        // this.telemetry.game.on(
        //   "refuel-paid",
        //   (data) => this.logIt("game", `Refuel paid, ${data.amount.toLocaleString()} liters`)
        // )

        // Job events
        // this.telemetry.job.on(
        //   "cancelled",
        //   (data) => this.logIt("job", `Job cancelled, Penalty: ${this.currency}${data.penalty.toLocaleString()}`)
        // )

        this.telemetry.job.on("delivered", (data) => {
            this.sendJob(data)
        })

        // this.telemetry.job.on(
        //   "finished",
        //   (data) => this.logIt("job", "Job finished")
        // )

        // this.telemetry.job.on(
        //   "started",
        //   (data) => this.logIt("job", `New job started, est Income: ${this.currency}${data.income.toLocaleString()}`)
        // )

        // // Truck events
        // this.telemetry.truck.on(
        //   "cruise-control",
        //   (data) => this.logIt("truck", `Cruise control ${data.enabled ? "Enabled" : "Disabled"}`)
        // )

        // this.telemetry.truck.on(
        //   "cruise-control-increase",
        //   (data) => this.logIt("truck", `Cruise control increased to ${data.cruiseControlSpeed.kph}kph / ${data.cruiseControlSpeed.mph}mph`)
        // )

        // this.telemetry.truck.on(
        //   "cruise-control-decrease",
        //   (data) => this.logIt("truck", `Cruise control decreased to ${data.cruiseControlSpeed.kph}kph / ${data.cruiseControlSpeed.mph}mph`)
        // )

        // this.telemetry.truck.on(
        //   "warning",
        //   (warning, enabled) => this.logIt("truck", enabled ? `Warning: ${warning}` : `${warning} warning disabled`)
        // )

        // this.telemetry.truck.on(
        //   "emergency",
        //   (emergency, enabled) => this.logIt("truck", enabled ? `Emergency: ${emergency}` : `${emergency} emergency disabled`)
        // )

        // this.telemetry.truck.on(
        //   "electric",
        //   (enabled) => this.logIt("truck", `Truck electrical ${enabled ? "ON" : "OFF"}`)
        // )

        // this.telemetry.truck.on(
        //   "engine",
        //   (enabled) => this.logIt("truck", `Truck engine ${enabled ? "ON" : "OFF"}`)
        // )

        // this.telemetry.truck.on(
        //   "park",
        //   (enabled) => this.logIt("truck", `Parking brake ${enabled ? "ON" : "OFF"}`)
        // )

        // this.telemetry.truck.on(
        //   "damage",
        //   (data) => this.logIt("truck", `Truck damage increased ${(100 * data.total).toFixed()}%`)
        // )

        // this.telemetry.truck.on(
        //   "refuel-started",
        //   (data) => this.logIt("truck", `Truck refuel started, current: ${data.value} liters`)
        // )

        // this.telemetry.truck.on(
        //   "refuel-stopped",
        //   (data) => this.logIt("truck", `Truck refuel stopped, current: ${data.value} liters`)
        // )

        // // Trailer events
        // this.telemetry.trailers.on(
        //   "coupling",
        //   (id, enabled) => this.logIt("trailers", `Trailer #${id+1} coupling ${enabled ? "connected" : "disconnected"}`)
        // )

        // this.telemetry.trailers.on(
        //   "damage",
        //   (id, data) => this.logIt("trailers", `Trailer #${id+1} damage increased ${(100 * data.total).toFixed()}%`)
        // )

        // // Navigation events
        // this.telemetry.navigation.on(
        //   "speed-limit",
        //   (data) => this.logIt("navigation", `Speed limit changed to ${data.kph}kph / ${data.mph}mph`)
        // )
    }
}
</script>