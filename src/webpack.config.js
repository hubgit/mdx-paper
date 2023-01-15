import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import remarkSubSuper from 'remark-sub-super'
import remarkSectionize from 'remark-sectionize'
import citations from './plugins/citations.js'
import { pathToFileURL } from 'node:url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

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
  },
}

export default {
  entry: new URL('./index.js', import.meta.url).pathname,
  output: {
    path: new URL('./dist', pathToFileURL(process.cwd())).pathname,
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
      template: new URL('./index.html', import.meta.url).pathname,
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
      // 'mdx-paper': new URL('..', import.meta.url).pathname
    },
    modules: [
      new URL('../node_modules', import.meta.url).pathname,
      'node_modules',
    ],
  },
  stats: 'minimal',
}
