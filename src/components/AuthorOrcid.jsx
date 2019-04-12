import React from 'react'
import styled from 'styled-components'
import Icon from '../static/orcid.svg'

export const AuthorOrcid = ({ id }) => (
  <a href={buildOrcidURL(id)} target={'_orcid'}>
    <OrcidIcon />
  </a>
)

const buildOrcidURL = id =>
  id.startsWith('http') ? id : `https://orcid.org/${id}`

const OrcidIcon = styled(Icon)`
  height: 1em;
  margin-left: 0.25ch;
`
