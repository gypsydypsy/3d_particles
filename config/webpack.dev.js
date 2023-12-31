const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common,
    {
        mode: 'development',
        devServer : {
            open: true, 
            https: true, 
            watchFiles: ['../src/**', '../static/**'],
            static:
            {
                watch: true,
                directory: path.resolve(__dirname, '../static')
            },
        }, 
    }
)