import { resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const distPath = resolve(process.cwd(), 'dist');

export default {
  mode: 'development',
  entry: '/index.js',
  output: {
    filename: 'main.js',
    path: distPath,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack hmmm',
      template: './index.html',
      favicon: './src/rss.png',
    }),
  ],
};
