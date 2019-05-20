const CleanWebpackPlugin = require('clean-webpack-plugin/dist/clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const remarkSubSuper = require('remark-sub-super')
const remarkSectionize = require('remark-sectionize')
const citations = require('./plugins/citations')
const pkg = require('../package.json')

const babelLoader = {
  loader: require.resolve('babel-loader'),
  options: {
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          targets: ['last 2 years'],
        },
      ],
      require.resolve('@babel/preset-react'),
    ],
    plugins: [require.resolve('@babel/plugin-syntax-dynamic-import')],
  },
}

module.exports = {
  entry: path.resolve(__dirname, './index.js'),
  output: {
    path: path.resolve(process.cwd(), './dist'),
    filename: '[name].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        // exclude: /node_modules\/(?!mdx-paper)/,
        exclude: /node_modules/,
        use: babelLoader,
      },
      {
        test: /\.mdx?$/,
        use: [
          babelLoader,
          {
            loader: require.resolve('@mdx-js/loader'),
            options: {
              remarkPlugins: [remarkSubSuper, remarkSectionize, citations],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [require.resolve('style-loader'), require.resolve('css-loader')],
      },
      {
        test: /\.ya?ml$/,
        use: require.resolve('js-yaml-loader'),
      },
      {
        test: /\.bib(tex)?$/,
        use: require.resolve('bibtex-loader'),
      },
      {
        test: /.svg$/,
        use: require.resolve('@svgr/webpack'),
      },
      {
        test: /\.(png|gif|jpe?g)$/, // images
        use: require.resolve('file-loader'),
      },
      {
        test: /\.(eot|ttf|woff2?)$/, // fonts
        use: {
          loader: require.resolve('file-loader'),
          options: {
            outputPath: 'fonts',
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      title: process.env.TITLE,
      template: __dirname + '/index.html',
      // meta: {
      //   generator: `mdx-paper v${pkg.version}`,
      // },
    }),
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
      'CITATION_STYLE',
      'CONTENTS_PATH',
      'METADATA_PATH',
      'REFERENCES_PATH',
      'THEME_PATH',
    ]),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.mdx'],
    alias: {
      // 'mdx-paper': path.resolve(__dirname, '..'),
    },
    modules: [
      // path.relative(
      //   process.cwd(),
      //   path.join(__dirname, '..', 'node_modules')
      // ),
      path.resolve(__dirname, '..', 'node_modules'),
      'node_modules',
    ],
  },
  stats: 'minimal',
}
