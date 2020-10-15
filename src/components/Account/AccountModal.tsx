import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { Spring, Transition, animated } from 'react-spring/renderprops'
import {
  Modal,
  textStyle,
  springs,
  ButtonIcon,
  IconCross,
  useTheme,
  GU,
  // @ts-ignore
} from '@aragon/ui'
import { ScreenId, WalletError, WalletConnector } from './types'
import { fontWeight } from '../../style/font'
import { shadowDepth } from '../../style/shadow'
import { rgba } from 'polished'
import { radius } from '../../style/radius'

interface ScreenData {
  account: string | null
  activating: WalletConnector | null
  activationError: WalletError
  status: string
  screenId: ScreenId
}

type AccountModalProps = {
  visible: boolean
  children: (screenData: ScreenData) => ReactNode
  onClose: () => void
  screenData: ScreenData
  heading: ReactNode
  screenId: string
  direction: -1 | 1
}

const AnimatedDiv = animated.div

function AccountModal({
  visible,
  children,
  onClose,
  screenData,
  heading,
  screenId,
  direction,
}: AccountModalProps): JSX.Element {
  const theme = useTheme()
  const [animate, setAnimate] = useState(false)
  const [height, setHeight] = useState(30 * GU)
  const [measuredHeight, setMeasuredHeight] = useState(true)

  // Prevents to lose the focus on the popover when a screen leaves while an
  // element inside is focused (e.g. when clicking on the “disconnect” button).
  const popoverFocusElement = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (popoverFocusElement.current) {
      popoverFocusElement.current.focus()
    }
  }, [screenId])

  // Don’t animate the slider until the popover has opened
  useEffect(() => {
    let timer: number

    setAnimate(false)

    if (visible) {
      timer = setTimeout(() => {
        setAnimate(true)
      }, 0)
    }

    return () => clearTimeout(timer)
  }, [visible])

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      closeButton={false}
      padding={0}
      css={`
        > div > div > div {
          border-radius: ${radius.high} !important;
          box-shadow: ${shadowDepth.high};
        }

        background-color: ${rgba('#787c85', 0.25)};
      `}
    >
      <section
        css={`
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: ${4 * GU}px;
        `}
      >
        <div
          css={`
            position: relative;
          `}
        >
          <ButtonIcon
            label=""
            css={`
              position: absolute;
              top: -${1 * GU}px;
              right: -${1 * GU}px;
              z-index: 2;
            `}
            onClick={onClose}
          >
            <IconCross
              css={`
                color: ${theme.surfaceContent};
              `}
            />
          </ButtonIcon>

          <h1
            css={`
              display: flex;
              flex-grow: 0;
              flex-shrink: 0;
              align-items: center;
              margin-bottom: ${3 * GU}px;

              ${textStyle('body2')};
              font-weight: ${fontWeight.medium};
              line-height: 1;
            `}
          >
            {heading}
          </h1>
          <Spring
            config={springs.smooth}
            from={{ height: 32 * GU }}
            to={{ height }}
            immediate={!animate}
            native
          >
            {({ height }) => (
              <AnimatedDiv
                ref={popoverFocusElement}
                tabIndex={0}
                style={{ height: measuredHeight ? height : 'auto' }}
                css={`
                  position: relative;
                  flex-grow: 1;
                  width: 100%;
                  outline: 0;
                `}
              >
                <Transition
                  native
                  config={springs.smooth}
                  items={screenData}
                  keys={({ account, activating, activationError, screenId }) =>
                    (activationError ? activationError.name : '') +
                    account +
                    activating +
                    screenId
                  }
                  from={{
                    opacity: 0,
                    transform: `translate3d(${3 * GU * direction}px, 0, 0)`,
                  }}
                  enter={{ opacity: 1, transform: `translate3d(0, 0, 0)` }}
                  leave={{
                    opacity: 0,
                    transform: `translate3d(${3 * GU * -direction}px, 0, 0)`,
                  }}
                  immediate={!animate}
                  onStart={() => {
                    setMeasuredHeight(true)
                  }}
                >
                  {(screenData) => ({ opacity, transform }) => (
                    <AnimatedDiv
                      ref={(elt) => {
                        if (elt) {
                          setHeight(elt.clientHeight)
                        }
                      }}
                      style={{ opacity, transform }}
                      css={`
                        position: ${measuredHeight ? 'absolute' : 'static'};
                        top: 0;
                        left: 0;
                        right: 0;
                      `}
                    >
                      {children(screenData)}
                    </AnimatedDiv>
                  )}
                </Transition>
              </AnimatedDiv>
            )}
          </Spring>
        </div>
      </section>
    </Modal>
  )
}

export default AccountModal