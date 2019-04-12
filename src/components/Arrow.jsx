import styled from 'styled-components'

export const Arrow = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;

  &[data-placement*='bottom'] {
    top: 0;
    left: 0;
    margin-top: -4px;
    width: 16px;
    height: 5px;
    &::before {
      border-width: 0 8px 5px 8px;
      border-color: transparent transparent #ddd transparent;
    }
  }

  &[data-placement*='top'] {
    bottom: 0;
    left: 0;
    margin-bottom: -4px;
    width: 16px;
    height: 5px;
    &::before {
      border-width: 5px 8px 0 8px;
      border-color: #ddd transparent transparent transparent;
    }
  }

  &[data-placement*='right'] {
    left: 0;
    margin-left: -4px;
    height: 16px;
    width: 5px;
    &::before {
      border-width: 8px 5px 8px 0;
      border-color: transparent #ddd transparent transparent;
    }
  }

  &[data-placement*='left'] {
    right: 0;
    margin-right: -4px;
    height: 16px;
    width: 5px;
    &::before {
      border-width: 8px 0 8px 5px;
      border-color: transparent transparent transparent #ddd;
    }
  }

  &::before {
    content: '';
    margin: auto;
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
  }
`
