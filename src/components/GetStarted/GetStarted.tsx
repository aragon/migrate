import React from 'react'
// @ts-ignore
import { GU } from '@aragon/ui'
import Features from './Features'
import LayoutGutter from '../Layout/LayoutGutter'
import Header from './Header'
import Balances from './Balances'

function GetStarted(): JSX.Element {
  return (
    <LayoutGutter>
      <div
        css={`
          padding-top: ${7 * GU}px;
          padding-bottom: ${7 * GU}px;
        `}
      >
        <Header />
        <Balances
          css={`
            padding-top: ${14 * GU}px;
            padding-bottom: ${17 * GU}px;
          `}
        />
        <Features
          css={`
            padding-bottom: ${25 * GU}px;
          `}
        />
      </div>
    </LayoutGutter>
  )
}

export default GetStarted
