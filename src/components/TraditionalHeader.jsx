import React from 'react'
import styled from 'styled-components'

export default ({ metadata }) => {
  const authorsAffiliations = metadata.authors.map(author => {
    return metadata.affiliations.filter(affiliation => {
      // return affiliation.members.includes(author)

      for (const member of affiliation.members) {
        if (member.id === author.id) {
          return true
        }
      }
    })
  })

  const sortedAffiliations = []

  authorsAffiliations.forEach(affiliations => {
    affiliations.forEach(affiliation => {
      sortedAffiliations.push(affiliation)
    })
  })

  const AuthorAffiliation = ({ affiliation }) => {
    const index = sortedAffiliations.indexOf(affiliation) + 1

    return (
      <a key={affiliation.name} href={`aff-${index}`}>
        {index}
      </a>
    )
  }

  return (
    <header>
      <Title>{metadata.title}</Title>

      <Authors>
        {metadata.authors.map((author, index) => (
          <Author key={author.id}>
            {index > 0 && <span>, </span>}
            <span>{author.name}</span>
            <AuthorAffiliations>
              {authorsAffiliations[index].map((affiliation, index) => (
                <span>
                  {index > 0 && <span>,</span>}
                  <AuthorAffiliation affiliation={affiliation} />
                </span>
              ))}
            </AuthorAffiliations>
          </Author>
        ))}
      </Authors>

      <Affiliations>
        {sortedAffiliations.map((affiliation, index) => (
          <Affiliation key={affiliation.name} id={`aff-${index}`}>
            <div>
              <AffiliationLabel>{index}</AffiliationLabel>
            </div>
            <div>
              <AffiliationString>{affiliation.name}</AffiliationString>
            </div>
          </Affiliation>
        ))}
      </Affiliations>
    </header>
  )
}

const Title = styled.h1``

const Authors = styled.div``

const Author = styled.span`
  white-space: nowrap;
`

const Affiliations = styled.div`
  display: table;
  margin: 16px 0;
`
const Affiliation = styled.div`
  display: table-row;

  > div {
    display: table-cell;
    padding: 2px;
  }
`

const AffiliationLabel = styled.div`
  position: relative;
  top: -0.5em;
  line-height: 0;
  font-size: 80%;
`

const AffiliationString = styled.div``

const AuthorAffiliations = styled.span`
  position: relative;
  top: -0.5em;
  line-height: 0;
  font-size: 80%;

  a {
    text-decoration: none;
    color: inherit;
  }
`
