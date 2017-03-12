const webpack = require('webpack')

module.exports = {
    entry: 'app.js',
    module: {
        rules: [
            {
                test: /\.json$/,
                use: {
                    loader: 'json-loader'
                }
            }
        ]
    }
}
