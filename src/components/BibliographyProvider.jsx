import React, { useCallback, useEffect, useState } from 'react'
import { ErrorMessage } from './ErrorMessage'

export const BibliographyContext = React.createContext({})

export const BibliographyProvider = ({
  references = [],
  citationStyle = 'nature',
  children,
}) => {
  const [bibliographyItems, setBibliographyItems] = useState(null)
  const [labels, setLabels] = useState(null)
  const [citations, setCitations] = useState([])
  const [citedKeys, setCitedKeys] = useState(null)
  const [error, setError] = useState(null)

  // initialise the CiteProc processor, then generate labels and bibliography items
  // NOTE: only runs after all descendants have mounted
  useEffect(() => {
    if (citations.length) {
      createProcessor(citationStyle, references)
        .then(processor => {
          const { bibliographyItems, labels } = processCitations({
            citations,
            processor,
          })

          setLabels(labels)
          setBibliographyItems(bibliographyItems)
          setCitedKeys(Object.keys(bibliographyItems))
        })
        .catch(error => {
          console.error(error)
          setError(error)
        })
    }
  }, [citationStyle, references, citations])

  const addCitation = useCallback(
    keys => {
      citations.push({ keys })
      setCitations(citations)
    },
    [citations, setCitations]
  )

  return (
    <BibliographyContext.Provider
      value={{ bibliographyItems, labels, addCitation, citedKeys }}
    >
      {children}
      {error && <ErrorMessage>ERROR: {error.message}</ErrorMessage>}
    </BibliographyContext.Provider>
  )
}

const variableWrapper = (params, prePunct, str, postPunct) => {
  if (params.context === 'bibliography') {
    switch (params.variableNames[0]) {
      case 'URL':
        return `${prePunct}<a href="${str}" target="blank">${str}</a>${postPunct}`

      case 'title':
        if (params.itemData.URL) {
          return `${prePunct}<a href="${
            params.itemData.URL
          }" target="blank">${str}</a>${postPunct}`
        }

        if (params.itemData.DOI) {
          return `${prePunct}<a href="https://doi.org/${
            params.itemData.DOI
          }" target="blank">${str}</a>${postPunct}`
        }
    }
  }

  return `${prePunct}${str}${postPunct}`
}

const createProcessor = async (citationStyle, references) => {
  const referenceMap = new Map()

  for (const item of references) {
    referenceMap.set(item.id, item)
  }

  const style = await fetchCitationStyle(citationStyle)

  const CSL = await import('citeproc')

  const localeMap = new Map()
  const localeNames = CSL.getLocaleNames(style, 'en-GB')

  for (const localeName of localeNames) {
    const locale = await fetchLocale(localeName)
    localeMap.set(localeName, locale)
  }

  return new CSL.Engine(
    {
      retrieveLocale: id => localeMap.get(id),
      retrieveItem: id => {
        if (!referenceMap.has(id)) {
          throw new Error(`Reference ${id} not found`)
        }

        return referenceMap.get(id)
      },
      variableWrapper,
    },
    style
  )
}

const processCitations = ({ citations, processor }) => {
  // update processor with ids
  const citedIDs = []

  citations.forEach(citation => {
    citation.keys.forEach(key => {
      if (!citedIDs.includes(key)) {
        citedIDs.push(key)
      }
    })
  })

  processor.updateItems(citedIDs)

  const citationsList = citations.map(citation => ({
    citationItems: citation.keys.map(id => ({ id })),
  }))

  const result = processor.rebuildProcessorState(citationsList)

  // build labels
  const labels = {}

  result.forEach((item, index) => {
    const keys = citations[index].keys
    labels[keys] = item[2]
  })

  // build bibliography
  const bibliographyItems = {}

  const [message, items] = processor.makeBibliography()

  items.forEach((item, index) => {
    const entryId = message.entry_ids[index]
    bibliographyItems[entryId] = item
  })

  return { bibliographyItems, labels }
}

const fetchLocale = id =>
  fetch(
    `https://raw.githubusercontent.com/citation-style-language/locales/master/locales-${id}.xml`
  ).then(response => response.text())

const fetchCitationStyle = async id => {
  const response = await fetch(
    `https://raw.githubusercontent.com/citation-style-language/styles-distribution/master/${id}.csl`
  )

  const xml = await response.text()

  const parentId = findParentId(xml)

  if (parentId) {
    return fetchCitationStyle(parentId)
  }

  return xml
}

const findParentId = xml => {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')

  const link = doc.querySelector('link[rel="independent-parent"]')
  if (!link) return

  const url = link.getAttribute('href')
  if (!url) return

  const matches = url.match(/[a-z0-9-]+$/)
  if (!matches) return

  return matches[1]
}
