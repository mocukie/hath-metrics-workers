module.exports = {
    entry: './src/index.js',
    target: 'web',
    mode: 'development',
    devtool: 'source-map',
    output: {
        filename: 'worker.js',
        libraryTarget: 'umd',
        sourceMapFilename: 'worker.js.map',
    },
    optimization: {
        minimize: false,
    },
}
