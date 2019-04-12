import React, { useContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Manager, Popper, Reference } from 'react-popper'
import styled from 'styled-components'
import { popperContainer } from '../index'
import { Arrow } from './Arrow'
import { BibliographyItem } from './Bibliography'
import { BibliographyContext } from './BibliographyProvider'

export const Cite = ({ children }) => {
  const [keys] = useState(children.split(/\s*;\s*/))
  const [isOpen, setOpen] = useState(false)
  const [citedItems, setCitedItems] = useState(null)
  const [label, setLabel] = useState(null)
  const [addedCitation, setAddedCitation] = useState(false)

  const { addCitation, labels, bibliographyItems, citedKeys } = useContext(
    BibliographyContext
  )

  useEffect(() => {
    if (bibliographyItems && citedKeys && labels) {
      setLabel(labels[keys])
      setCitedItems(
        keys
          .sort((a, b) => citedKeys.indexOf(a) - citedKeys.indexOf(b))
          .map(key => bibliographyItems[key])
      )
    }
  }, [bibliographyItems, citedKeys, labels, keys])

  useEffect(() => {
    addCitation(keys)
    setAddedCitation(true)
  }, [addCitation, keys])

  if (!addedCitation) return null

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <Citation ref={ref} onClick={() => setOpen(!isOpen)}>
            {label ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: label,
                }}
              />
            ) : (
              <sup>…</sup>
            )}
          </Citation>
        )}
      </Reference>

      {isOpen &&
        citedItems &&
        ReactDOM.createPortal(
          <Popper placement={'right'} positionFixed={true}>
            {({ ref, style, placement, arrowProps }) => (
              <div ref={ref} style={style} data-placement={placement}>
                <CitedItems>
                  {citedItems.map(citedItem => (
                    <BibliographyItem
                      key={citedItem}
                      dangerouslySetInnerHTML={{
                        __html: citedItem,
                      }}
                    />
                  ))}
                </CitedItems>

                <Arrow
                  ref={arrowProps.ref}
                  style={arrowProps.style}
                  data-placement={placement}
                />
              </div>
            )}
          </Popper>,
          popperContainer
        )}
    </Manager>
  )
}

// TODO: style only sup, move left when sup

const Citation = styled.span`
  cursor: pointer;
  line-height: 0;
  background: aliceblue;
  padding: 0 4px;
  border-radius: 4px;

  sup {
    font-family: 'Noto Sans', sans-serif;
    font-size: 75%;
  }
`

const CitedItems = styled.div`
  width: 400px;
  box-shadow: 0 1px 3px #ddd;
  border-radius: 4px;
  padding: 16px;
  background: white;
  border: 1px solid #eee;
  font-family: 'Noto Sans', sans-serif;
  font-size: 80%;
`
