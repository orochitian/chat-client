module.exports = {
    devServer: {
        disableHostCheck: true,
    },
    configureWebpack: {
        externals: {
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'iview': 'iview',
        }
    }
}