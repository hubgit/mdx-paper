#!/usr/bin/env node

const path = require('path')
const yargs = require('yargs')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const pkg = require('../package.json')

const builder = yargs => {
  yargs
    .positional('file', {
      type: 'string',
      describe: 'the source MDX file',
      default: 'article.mdx',
    })
    .option('citation-style', {
      describe: 'the CSL style to use for citations',
      default: 'nature',
    })
    .option('metadata', {
      describe: 'the path to the metadata file (JSON or YAML)',
      default: 'metadata.yml',
    })
    .option('references', {
      describe: 'the path to the metadata file (BibTex, CSL JSON or CSL YAML)',
      // default: 'references.bib',
    })
    .option('theme', {
      describe: 'Path to the theme file (JSON or YAML)',
      // default: 'theme.js',
    })
    .option('title', {
      describe: 'Title of the paper',
      default: 'Paper',
    })
}

const setEnvironmentVariables = argv => {
  process.env.CITATION_STYLE = argv.citationStyle
  process.env.TITLE = argv.title || 'Paper'
  process.env.CONTENTS_PATH = path.resolve(argv.file)
  process.env.METADATA_PATH = path.resolve(argv.metadata)

  if (argv.references) {
    process.env.REFERENCES_PATH = path.resolve(argv.references)
  }

  if (argv.theme) {
    process.env.THEME_PATH = path.resolve(argv.theme)
  }
}

const findWebpackConfig = () => {
  // TODO: global? require.resolve?
  // console.log(require.resolve('mdx-paper'))
  // const path = require.resolve('mdx-paper/dist/webpack.config.js')

  const path = process.cwd() + '/node_modules/mdx-paper/dist/webpack.config.js'

  return require(path)
}

// noinspection BadExpressionStatementJS
yargs
  .scriptName('npx mdx-paper')
  .version(pkg.version)
  .usage('$0 <cmd> [args]')
  .command(
    ['$0 [file]', 'dev [file]'], // default
    'start dev server',
    builder,
    argv => {
      console.log('starting dev server…')
      console.log(argv)

      setEnvironmentVariables(argv)

      process.env.NODE_ENV = 'development'

      const webpackConfig = findWebpackConfig()
      webpackConfig.mode = 'development'
      webpackConfig.devtool = 'cheap-eval-source-map'
      const compiler = webpack(webpackConfig)

      const devServer = new WebpackDevServer(compiler, {
        hot: true,
        historyApiFallback: true,
        inline: false,
      })

      const hostname = 'localhost'
      const port = process.env.PORT || 8080

      devServer.listen(port, hostname, () => {
        console.log(`Listening at http://${hostname}:${port}`)
      })
    }
  )
  .command(['build [file]'], 'build the paper', builder, argv => {
    console.log('building…')
    console.log(argv)

    setEnvironmentVariables(argv)

    process.env.NODE_ENV = 'production'

    const webpackConfig = findWebpackConfig()
    webpackConfig.mode = 'production'
    const compiler = webpack(webpackConfig)

    compiler.run((err, stats) => {
      stats.compilation.errors.forEach(error => {
        console.error(error)
      })

      if (err) {
        console.log(err)
        throw err
      }
      console.log('built')
    })
  })
  .help().argv
