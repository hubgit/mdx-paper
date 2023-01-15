#!/usr/bin/env node
import path from 'path'
import yargs from 'yargs'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import pkg from '../package.json' assert { type: 'json' }

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
  process.env.REFERENCES_PATH = argv.references ? path.resolve(argv.references) : ''
  process.env.THEME_PATH = argv.theme ? path.resolve(argv.theme) : ''

}

const findWebpackConfig = () => {
  // TODO: global? require.resolve?
  // console.log(require.resolve('mdx-paper'))
  // const path = require.resolve('mdx-paper/dist/webpack.config.js')
  const path = process.cwd() + '/node_modules/mdx-paper/dist/webpack.config.js'

  return import(path).then(m => m.default)
}

yargs((process.argv.slice(2)))
  .scriptName('npx mdx-paper')
  .version(pkg.version)
  .usage('$0 <cmd> [args]')
  .command(
    ['$0 [file]', 'dev [file]'], // default
    'start dev server',
    builder,
    async argv => {
      console.log('starting dev server…')
      console.log(argv)

      setEnvironmentVariables(argv)

      process.env.NODE_ENV = 'development'

      const webpackConfig = await findWebpackConfig()
      webpackConfig.mode = 'development'
      webpackConfig.devtool = 'eval-cheap-source-map'
      const compiler = webpack(webpackConfig)

      const host = 'localhost'
      const port = process.env.PORT || 8080

      const devServer = new WebpackDevServer( {
        hot: true,
        historyApiFallback: true,
        port,
        host,
      }, compiler)

      devServer.startCallback(() => {
        console.log(`Listening at http://${host}:${port}`)
      })
    }
  )
  .command(['build [file]'], 'build the paper', builder, async argv => {
    console.log('building…')
    console.log(argv)

    setEnvironmentVariables(argv)

    process.env.NODE_ENV = 'production'

    const webpackConfig = await findWebpackConfig()
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
