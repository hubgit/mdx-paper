import React, { useContext } from 'react'
import styled from 'styled-components'
import { BibliographyContext } from './BibliographyProvider'

export const Bibliography = () => {
  const { bibliographyItems } = useContext(BibliographyContext)

  return (
    <Container className={'csl-bib-body'}>
      {bibliographyItems &&
        Object.entries(bibliographyItems).map(([key, bibliographyItem]) => (
          <BibliographyItem
            key={key}
            dangerouslySetInnerHTML={{ __html: bibliographyItem }}
          />
        ))}
    </Container>
  )
}

const Container = styled.div`
  display: table;
`

export const BibliographyItem = styled.div`
  .csl-entry {
    display: table-row;
  }

  .csl-left-margin {
    display: table-cell;
    text-align: right;
  }

  .csl-right-inline {
    display: table-cell;
    padding-left: 8px;
  }
`
