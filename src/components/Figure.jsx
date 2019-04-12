import React from 'react'
import styled from 'styled-components'

export const Figure = props => (
  <Container id={props.id}>
    {props.children}
    <Caption>
      {props.label && <Label>{props.label}: </Label>}
      {props.title && <Title>{props.title}. </Title>}
      {props.caption}
    </Caption>
  </Container>
)

const Container = styled.figure`
  display: flex;
  flex-direction: column;
  align-items: center;

  > img {
    max-width: 90%;
    max-height: 400px;
    margin: 16px;
  }
`

const Label = styled.span`
  font-weight: bold;
`

const Title = styled.span`
  font-weight: bold;
`

const Caption = styled.figcaption`
  font-family: ${props => props.theme.figure.font};
`
