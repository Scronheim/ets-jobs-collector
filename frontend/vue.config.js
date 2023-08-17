module.exports = {
    devServer: {
        proxy: {
            '/api/*': {
                target: 'http://188.225.31.66:3001/',
                ws: true,
                changeOrigin: true
            }
        }
    },
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                productName: 'ETS Jobs Collector',
                appId: 'collector.jobs.ets',
                win: {
                    icon: 'public/icon.ico',
                    target: ['portable']
                },
                nsis: {
                    installerIcon: "public/icon.ico",
                    uninstallerIcon: "public/icon.ico",
                    uninstallDisplayName: "ETS Jobs Collector",
                    oneClick: false,
                    allowToChangeInstallationDirectory: true
                }
            }
        },
        vuetify: {
            // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                "../../build/Release/scsSDKTelemetry": "../../build/Release/scsSDKTelemetry.node"
            }
        },
        module: {
            rules: [
                {
                    test: /\.node$/,
                    loader: 'node-loader',
                }
            ]
        }
    }
}
