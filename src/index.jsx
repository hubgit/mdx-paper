import { createGlobalStyle, ThemeProvider } from 'styled-components'
import React, { lazy, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { MDXProvider } from '@mdx-js/react'
import * as components from '@aeaton/react-paper'

const {
  Article,
  BibliographyProvider,
  Body,
  Cite,
  Footer,
  Header,
  Main,
} = components

const Contents = lazy(() => import(process.env.CONTENTS_PATH))

const citationStyle = process.env.CITATION_STYLE

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background: ${props => props.theme.background};
    color: ${props => props.theme.color};
    font-family: ${props => props.theme.font};
  }
`

const App = () => {

  const [metadata, setMetadata] = useState()
  const [references, setReferences] = useState()
  const [theme, setTheme] = useState()

  useEffect(() => {
    if (process.env.METADATA_PATH) {
      import(process.env.METADATA_PATH).then(m => setMetadata(m.default))
    }

    if (process.env.REFERENCES_PATH) {
      import(process.env.REFERENCES_PATH).then(m => setReferences(m.default))
    }

    import(process.env.THEME_PATH || './theme.js').then(m => setTheme(m.default))
  }, [])

  return <ThemeProvider theme={theme}>
    <MDXProvider
      components={{
        ...components,
        cite: Cite,
      }}
    >
      <BibliographyProvider
        references={references}
        citationStyle={citationStyle}
      >
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
    </MDXProvider>
  </ThemeProvider>
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
)
