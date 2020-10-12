import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
// @ts-ignore
import { Button, useLayout, GU } from '@aragon/ui'
import Stepper from '../../Stepper/Stepper'
import { getMockSteps } from '../../../mock'
import SigningInfo from './SigningInfo'

function ConverterSigning(): JSX.Element {
  const { layoutName } = useLayout()
  const history = useHistory()
  const stackedButtons = layoutName === 'small'

  const handleBackToHome = useCallback(() => {
    history.push('/')
  }, [history])

  return (
    <Stepper
      steps={getMockSteps(1)}
      renderInfo={({ stepperStatus, handleSign }) => (
        <div
          css={`
            margin-top: ${6 * GU}px;
          `}
        >
          {stepperStatus === 'error' ? (
            <div
              css={`
                display: grid;
                grid-gap: ${1 * GU}px;
                grid-template-columns: ${stackedButtons ? 'auto' : '1fr 1fr'};
                margin-bottom: ${2 * GU}px;
              `}
            >
              <Button wide onClick={handleBackToHome}>
                Abandon process
              </Button>
              <Button mode="strong" onClick={handleSign} wide>
                Repeat transaction
              </Button>
            </div>
          ) : (
            <Button
              mode="strong"
              onClick={handleBackToHome}
              disabled={stepperStatus === 'working'}
              wide
              css={`
                max-width: ${30 * GU}px;
                margin-left: auto;
                margin-right: auto;
                margin-bottom: ${2 * GU}px;
              `}
            >
              Back to Migrate
            </Button>
          )}
          <SigningInfo status={stepperStatus} />
        </div>
      )}
      css={`
        padding-top: ${2 * GU}px;
        width: 100%;
        max-width: ${70 * GU}px;
      `}
    />
  )
}

export default ConverterSigning
