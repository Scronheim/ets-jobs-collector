// Styles
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'
export default createVuetify({
    theme: {
        defaultTheme: 'dark'
    },
    defaults: {
        VTable: {
            density: 'compact',
        },
        VDataTable: {
            density: 'compact',
        },
        VExpansionPanels: {
            variant: 'accordion',
        },
        VList: {
            density: 'compact',
        },
        VBtn: {
            variant: 'text',
        },
        VTextarea: {
            density: 'compact',
            variant: 'outlined',
            hideDetails: 'auto',
        },
        VAutocomplete: {
            density: 'compact',
            variant: 'outlined',
            hideDetails: 'auto',
        },
        VSelect: {
            density: 'compact',
            variant: 'outlined',
            hideDetails: 'auto',
        },
        VTextField: {
            density: 'compact',
            variant: 'outlined',
            hideDetails: 'auto',
        },
    },
})
