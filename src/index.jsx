import { createGlobalStyle, ThemeProvider } from 'styled-components'
import React from 'react'
import ReactDOM from 'react-dom'
import { Article, Body, Main } from './components/Article'
import { BibliographyProvider } from './components/BibliographyProvider'
import Footer from './components/Footer'
import Header from './components/Header'

const Contents = require(process.env.CONTENTS_PATH).default

const metadata = process.env.METADATA_PATH
  ? require(process.env.METADATA_PATH)
  : {}

const references = process.env.REFERENCES_PATH
  ? require(process.env.REFERENCES_PATH)
  : []

// const theme = process.env.THEME_PATH
//   ? require(process.env.THEME_PATH)
//   : require('./theme')

const theme = require('./theme')

const citationStyle = process.env.CITATION_STYLE

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background: ${props => props.theme.background};
    color: ${props => props.theme.color};
    font-family: ${props => props.theme.font};
  }
`

const rootContainer = document.body.appendChild(document.createElement('div'))
export const popperContainer = document.body.appendChild(
  document.createElement('div')
)

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <BibliographyProvider references={references} citationStyle={citationStyle}>
      <GlobalStyle />
      <Article>
        <Header metadata={metadata} />
        <Main>
          <Body>
            <Contents />
          </Body>
        </Main>
        <Footer metadata={metadata} />
      </Article>
    </BibliographyProvider>
  </ThemeProvider>,
  rootContainer
)
