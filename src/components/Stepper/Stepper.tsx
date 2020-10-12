import React, { useCallback, useEffect, useState } from 'react'
import { Transition, animated } from 'react-spring/renderprops'
// @ts-ignore
import { springs, noop, useTheme, GU } from '@aragon/ui'
import Step from './Step/Step'
import { useDisableAnimation } from '../../hooks/useDisableAnimation'
import { useMounted } from '../../hooks/useMounted'
import useStepperLayout from './useStepperLayout'
import { StepItems } from './types'
import useStepState from './useStepState'

const AnimatedDiv = animated.div

const DEFAULT_DESCRIPTIONS = {
  waiting: 'Waiting for signature',
  prompting: 'Waiting for signature',
  working: 'Transaction being mined',
  success: 'Transaction mined',
  error: 'An error has occured',
}

type StepperProps = {
  steps: StepItems
  onSuccess?: () => void
  onError?: () => void
  renderInfo?: () => void
}

function Stepper({
  steps,
  onSuccess = noop,
  onError = noop,
  renderInfo,
  ...props
}: StepperProps): JSX.Element {
  const theme = useTheme()
  const mounted = useMounted()
  const [animationDisabled, enableAnimation] = useDisableAnimation()
  const [stepperStage, setStepperStage] = useState(0)
  const { stepState, updateStep, initialStatus } = useStepState(steps)
  const { outerBoundsRef, innerBoundsRef, layout } = useStepperLayout()

  const stepsCount = steps.length - 1

  const renderStep = useCallback(
    (stepIndex: number, showDivider: boolean) => {
      const { title, descriptions: suppliedDescriptions } = steps[stepIndex]
      const { status, hash } = stepState[stepIndex]
      const descriptions = suppliedDescriptions || DEFAULT_DESCRIPTIONS

      return (
        <li
          key={stepIndex}
          css={`
            display: flex;
          `}
        >
          <Step
            title={title}
            desc={descriptions[status]}
            number={stepIndex + 1}
            status={status}
            showDivider={showDivider}
            transactionHash={hash}
          />
        </li>
      )
    },
    [stepState, steps]
  )

  const renderSteps = useCallback(() => {
    return steps.map((_, index) => {
      const showDivider = index < stepsCount

      return renderStep(index, showDivider)
    })
  }, [steps, stepsCount, renderStep])

  const updateStepStatus = useCallback(
    (status) => {
      if (mounted()) {
        updateStep(['setStatus', { stepIndex: stepperStage, status }])
      }
    },
    [stepperStage, mounted, updateStep]
  )

  const updateHash = useCallback(
    (hash) => {
      if (mounted()) {
        updateStep(['setHash', { stepIndex: stepperStage, hash }])
      }
    },
    [stepperStage, mounted, updateStep]
  )

  const handleSign = useCallback(() => {
    const { handleSign } = steps[stepperStage]

    updateStepStatus(initialStatus)

    // Pass state updates as render props to handleSign
    handleSign({
      setPrompting: () => updateStepStatus('prompting'),
      setWorking: () => updateStepStatus('working'),
      setError: () => {
        updateStepStatus('error')
        onError()
      },
      setSuccess: () => {
        updateStepStatus('success')

        // Advance to next step or fire complete callback
        if (mounted()) {
          if (stepperStage === stepsCount) {
            onSuccess()
          } else {
            setStepperStage(stepperStage + 1)
          }
        }
      },
      setHash: (hash) => updateHash(hash),
    })
  }, [
    steps,
    stepperStage,
    updateStepStatus,
    updateHash,
    stepsCount,
    mounted,
    onSuccess,
    onError,
    initialStatus,
  ])

  // Trigger sign prompt when moving to a new step
  useEffect(handleSign, [stepperStage])

  return (
    <div {...props}>
      <div
        ref={outerBoundsRef}
        css={`
          display: flex;
          justify-content: center;
        `}
      >
        <ul
          ref={innerBoundsRef}
          css={`
            padding: 0;
            display: flex;
            flex-direction: ${layout === 'collapsed' ? 'column' : 'row'};
          `}
        >
          {layout === 'collapsed' && (
            <>
              {steps.length > 1 && (
                <p
                  css={`
                    text-align: center;
                    margin-bottom: ${2 * GU}px;
                    color: ${theme.contentSecondary};
                  `}
                >
                  {stepperStage + 1} out of {steps.length} transactions
                </p>
              )}

              <div
                css={`
                  position: relative;
                `}
              >
                <Transition
                  config={springs.smooth}
                  delay={300}
                  items={stepperStage}
                  immediate={animationDisabled}
                  onStart={enableAnimation}
                  from={{
                    opacity: 0,
                    transform: `translate3d(${10 * GU}px, 0, 0)`,
                  }}
                  enter={{
                    opacity: 1,
                    transform: 'translate3d(0, 0, 0)',
                  }}
                  leave={{
                    opacity: 0,
                    transform: `translate3d(-${20 * GU}px, 0, 0)`,
                  }}
                  native
                >
                  {(currentStage) => (animProps) => (
                    <AnimatedDiv
                      style={{
                        position:
                          currentStage === stepperStage ? 'static' : 'absolute',
                        ...animProps,
                      }}
                    >
                      {renderStep(currentStage, false)}
                    </AnimatedDiv>
                  )}
                </Transition>
              </div>
            </>
          )}
          {layout === 'expanded' && renderSteps()}
        </ul>
      </div>
      {renderInfo && renderInfo()}
    </div>
  )
}

export default Stepper
