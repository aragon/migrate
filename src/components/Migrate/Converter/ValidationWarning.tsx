import React from 'react'
import { useMigrateState } from '../MigrateStateProvider'
import { ValidationStatus } from '../types'
// @ts-ignore
import { Info, GU } from '@aragon/ui'

type ValidationWarningProps = {
  status: ValidationStatus
}

function ValidationWarning({ status }: ValidationWarningProps): JSX.Element {
  const { getMinConvertAmount } = useMigrateState()

  const minConvertAmount = getMinConvertAmount(0)
  const messages: Record<string, JSX.Element> = {
    insufficientBalance: <>Insufficient balance.</>,
    insufficientAmount: (
      <>
        You need at least <b>{minConvertAmount} ANJ</b> to start the conversion.
      </>
    ),
    noAmount: <>Enter an amount.</>,
  }

  const content = messages[status]
  return (
    <>
      {content && (
        <Info
          mode="warning"
          css={`
            margin-top: ${GU}px;
          `}
        >
          {content}
        </Info>
      )}
    </>
  )
}

export default ValidationWarning
