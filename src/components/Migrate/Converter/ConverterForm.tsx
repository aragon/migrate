import React, { useMemo } from 'react'
import { css } from 'styled-components'
import {
  useTheme,
  useLayout,
  GU,
  // @ts-ignore
} from '@aragon/ui'
import TokenAmount from 'token-amount'
import { fontWeight } from '../../../style/font'
import { TokenConversionType } from '../types'
import { useMigrateState } from '../MigrateStateProvider'
import { shadowDepth } from '../../../style/shadow'
import { useAccountBalances } from '../../../providers/AccountBalances'
import ConverterFormControls from './ConverterFormControls'
import { radius } from '../../../style/radius'
import ConversionRate from './ConversionRate'
import PageHeading from '../../PageHeading/PageHeading'
import { ANJ_CONVERSIONS } from '../conversionUtils'

export const TOKEN_SYMBOL: Record<TokenConversionType, string> = {
  ANT: 'ANTv1',
  ANJ: 'ANJ',
  'ANJ-LOCK': 'ANJ',
}

const multiColumnLayout = css`
  grid-template-columns: 55% auto;
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
  const { antV1, anj } = useAccountBalances()

  const isANJConversion = ANJ_CONVERSIONS.has(conversionType)
  const token = isANJConversion ? anj : antV1
  const { balance, decimals } = token

  const compactMode = layoutName === 'small' || layoutName === 'medium'
  const tokenSymbol = TOKEN_SYMBOL[conversionType]

  const formattedBalance = useMemo(
    () =>
      balance &&
      new TokenAmount(balance, decimals).format({
        digits: decimals,
      }),
    [balance, decimals]
  )

  return (
    <>
      <PageHeading
        title="Aragon Upgrade"
        description={`How much ${tokenSymbol} would you like to ${
          isANJConversion ? 'redeem' : 'upgrade'
        }?`}
        css={`
          margin-bottom: ${7 * GU}px;
        `}
      />
      <div
        css={`
          padding: ${compactMode ? 4 * GU : 6 * GU}px;
          background-color: ${theme.surface};
          box-shadow: ${shadowDepth.high};
          border-radius: ${radius.high};
          display: grid;
          grid-gap: ${4 * GU}px;
          ${compactMode ? stackedLayout : multiColumnLayout}
        `}
      >
        <div
          css={`
            grid-area: title;
            text-align: ${compactMode ? 'center' : 'left'};
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
            {isANJConversion ? 'Redeem' : 'Upgrade'} {tokenSymbol}
          </h2>
          <p
            css={`
              color: ${theme.surfaceContentSecondary};
            `}
          >
            {formattedBalance ? (
              <>
                Balance:{' '}
                <span
                  css={`
                    word-break: break-all;
                  `}
                >
                  {formattedBalance}
                </span>{' '}
                {tokenSymbol}
              </>
            ) : (
              'Connect your wallet to see your balance'
            )}
          </p>
        </div>
        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: center;
            grid-area: rate;
            padding: ${2 * GU}px;
          `}
        >
          <ConversionRate tokenSymbol={tokenSymbol} compactMode={compactMode} />
        </div>
        <div
          css={`
            grid-area: inputs;
          `}
        >
          <ConverterFormControls
            conversionType={conversionType}
            tokenSymbol={tokenSymbol}
          />
        </div>
      </div>
    </>
  )
}

export default ConverterForm
