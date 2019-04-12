import React from 'react'
import styled from 'styled-components'

export const Main = styled.div``
export const Body = styled.div``

export const Article = styled.article`
  display: grid;
  grid-template: 'header sidebar' 'main sidebar';
  grid-auto-columns: auto min-content;
  margin-bottom: 32px;

  h1 {
    font-weight: 200;
  }

  > header {
    grid-area: header;
    font-family: ${props => props.theme.header.font};
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  ${Main} {
    grid-area: main;
    grid-row-start: 2;
    grid-row-end: -1;
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    align-items: center;

    ${Body} {
      width: 100%;
      max-width: 40em;
    }
  }

  > footer {
    grid-area: sidebar;
    padding: 16px;
    min-width: 20em;
    font-family: ${props => props.theme.footer.font};
  }

  h1 {
    font-family: ${props => props.theme.heading.font};
  }
`
