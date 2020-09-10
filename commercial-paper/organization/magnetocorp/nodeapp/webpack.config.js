const path = require('path');
const {
  NODE_ENV = 'production',
} = process.env;
module.exports = {
  entry: './app.ts',
  mode: NODE_ENV,
  target: 'node',
  externals: [/node_modules/],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'server.js'
  },
  resolve: {
    mainFields: ['browser', 'main', 'module'],
    extensions: ['.ts', '.js', '.jsx'],
  },
    module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'ts-loader',
        ]
      }
    ]
  }
}