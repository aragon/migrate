import React, { useCallback, useState } from 'react'
import {
  Button,
  TextInput,
  Link,
  useTheme,
  useLayout,
  Info,
  GU,
  // @ts-ignore
} from '@aragon/ui'
import { useMigrateState } from '../MigrateStateProvider'
import { css } from 'styled-components'
import { fontWeight } from '../../../style/font'
import { TokenConversionType } from '../types'

const BLOG_POST_URL = ''
const MOCK_AMOUNT = '78,000'
const TOKEN_SYMBOL: Record<TokenConversionType, string> = {
  ANT: 'ANT',
}

const multiColumnLayout = css`
  grid-template-columns: 50% auto;
  grid-template-rows: auto auto;
  grid-template-areas:
    'title rate'
    'inputs rate';
`

const stackedLayout = css`
  grid-template-rows: auto auto auto;
  grid-template-areas:
    'title'
    'rate'
    'inputs';
`

function ConverterForm(): JSX.Element {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const { conversionType } = useMigrateState()

  const compactMode = layoutName === 'medium' || layoutName === 'small'

  const tokenSymbol = TOKEN_SYMBOL[conversionType]

  return (
    <form
      css={`
        display: grid;
        grid-gap: ${4 * GU}px;
        ${compactMode ? stackedLayout : multiColumnLayout}
      `}
    >
      <div
        css={`
          grid-area: title;
        `}
      >
        <h2
          css={`
            line-height: 1;
            font-weight: ${fontWeight.medium};
            font-size: 32px;
            margin-bottom: ${1.5 * GU}px;
          `}
        >
          Migrate {tokenSymbol}
        </h2>
        <p
          css={`
            color: ${theme.surfaceContentSecondary};
          `}
        >
          Balance: {MOCK_AMOUNT} {tokenSymbol}
        </p>
      </div>
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: center;
          grid-area: rate;
          border: 1px dashed ${theme.border};
          border-radius: 8px;
        `}
      >
        Conversion Rate
      </div>
      <div
        css={`
          grid-area: inputs;
        `}
      >
        <FormControls />
      </div>
    </form>
  )
}

function FormControls() {
  const [amount, setAmount] = useState('')
  const theme = useTheme()
  const { setSigningStage } = useMigrateState()
  const { layoutName } = useLayout()
  const { conversionType } = useMigrateState()

  const stackedButtons = layoutName === 'small'
  const tokenSymbol = TOKEN_SYMBOL[conversionType]

  const handleAmountChange = useCallback((event) => {
    setAmount(event.target.value)
  }, [])

  return (
    <>
      <label
        css={`
          display: block;
        `}
      >
        <h3
          css={`
            font-weight: ${fontWeight.medium};
            margin-bottom: ${1 * GU}px;
          `}
        >
          Enter the amount you would like to convert
        </h3>
        <TextInput
          wide
          placeholder="0.0"
          value={amount}
          onChange={handleAmountChange}
          type="number"
          css={`
            display: block;
          `}
        />
      </label>
      <p
        css={`
          margin-top: ${1 * GU}px;
          color: ${theme.surfaceContentSecondary};
        `}
      >
        You will receive:{' '}
        <span css={`font-weight: ${fontWeight.medium}; color ${theme.accent}`}>
          {MOCK_AMOUNT} {tokenSymbol}
        </span>
      </p>
      <Info
        css={`
          margin-top: ${3 * GU}px;
          margin-bottom: ${2 * GU}px;
        `}
      >
        Please read our{' '}
        <Link href={BLOG_POST_URL}>ANT Migration blog post</Link> if you have
        any questions.
      </Info>
      <div
        css={`
          display: grid;
          grid-gap: ${1 * GU}px;

          grid-template-columns: ${stackedButtons ? 'auto' : '0.75fr 1fr'};
        `}
      >
        <Button onClick={setSigningStage} wide>
          Back
        </Button>
        <Button onClick={setSigningStage} mode="strong" wide>
          Continue
        </Button>
      </div>
    </>
  )
}

export default ConverterForm
