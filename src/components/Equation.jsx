import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

// TODO: make this into a provider

export const Equation = ({ tex }) => {
  const [processor, setProcessor] = useState(null)
  const [output, setOutput] = useState(null)

  useEffect(() => {
    buildProcessor(setProcessor).catch(error => {
      console.error(error)
    })
  }, [])

  useEffect(() => {
    if (!processor) return

    const output = processor.renderToString(tex)
    setOutput(output)
  }, [processor, tex])

  if (!output) return null

  return <Container dangerouslySetInnerHTML={{ __html: output }} />
}

const buildProcessor = async setProcessor => {
  await import('katex/dist/katex.css')
  const processor = await import('katex')
  setProcessor(processor)
}

const Container = styled.span``
