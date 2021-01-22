import React, { useMemo } from 'react'
import {
  useTheme,
  ButtonBase,
  IconInfo,
  GU,
  useLayout,
  // @ts-ignore
} from '@aragon/ui'
import { useHistory } from 'react-router-dom'
import TokenGraphic from '../TokenGraphic/TokenGraphic'
import BrandButton from '../BrandButton/BrandButton'
import { BalanceItem } from './BalanceCard'
import { shadowDepth } from '../../style/shadow'
import { radius } from '../../style/radius'
import { fontWeight } from '../../style/font'
import { TokenName } from '../../token-info/types'
import { tokenInfo } from '../../token-info/tokenInfo'
import rightArrowPng from '../../assets/right-arrow.png'
import { CONVERTER_PATH } from '../../Routes'

type TokenConversionCardProps = {
  tokenName: TokenName
  balance: string | null
  accountConnected: boolean
  lpTotalBalance?: string | null
  showLpBalance?: boolean
  lpInfoAvailable?: boolean
  onLpClick?: (() => void) | null
}

function TokenConversionCard({
  tokenName = 'antV1',
  balance,
  accountConnected,
  lpTotalBalance,
  lpInfoAvailable,
  showLpBalance,
  onLpClick,
}: TokenConversionCardProps): JSX.Element {
  const theme = useTheme()
  const history = useHistory()
  const { layoutName } = useLayout()

  const compactMode = layoutName === 'small'

  const tokenTitle = tokenInfo[tokenName].suffix

  const lpModalButton = useMemo(() => {
    const title = 'Liquidity pools distribution'
    return onLpClick ? (
      <div
        css={`
          margin: -${1 * GU}px;
        `}
      >
        <ButtonBase
          onClick={onLpClick}
          css={`
            display: flex;
            align-items: center;
            font-size: 18px;
            line-height: 1;
            padding: ${1 * GU}px;
            color: ${theme.link};
          `}
        >
          <div
            css={`
              margin-left: -${0.5 * GU}px;
              margin-bottom: -${0.25 * GU}px;
              margin-right: ${0.25 * GU}px;
            `}
          >
            <IconInfo />
          </div>

          {title}
        </ButtonBase>
      </div>
    ) : (
      <div
        css={`
          color: ${theme.contentSecondary};
        `}
      >
        {title}
      </div>
    )
  }, [onLpClick, theme])

  return (
    <div
      css={`
        background-color: ${theme.surface};
        box-shadow: ${shadowDepth.high};
        border-radius: ${radius.high};
        padding: ${compactMode ? 4 * GU : 5 * GU}px;

        max-width: ${90 * GU}px;
        margin-left: auto;
        margin-right: auto;
        width: 100%;
      `}
    >
      <div
        css={`
          display: flex;
          justify-content: space-between;
          padding-bottom: ${4 * GU}px;
          margin-bottom: ${4.5 * GU}px;
          border-bottom: 1px solid ${theme.border};
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            flex: 1;
            justify-content: center;
            flex-direction: column;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
            `}
          >
            <TokenGraphic
              shadow
              tokenName={tokenName}
              size={compactMode ? 75 : 100}
              css={`
                flex-shrink: 0;
              `}
            />
            <img
              css={`
                height: 20px;
                margin-left: ${1 * GU}px;
                margin-right: ${1 * GU}px;
              `}
              src={rightArrowPng}
              alt=""
            />
            <TokenGraphic
              shadow
              tokenName={'antV2'}
              size={compactMode ? 75 : 100}
              css={`
                flex-shrink: 0;
              `}
            />
          </div>
          <div
            css={`
              flex: 1;
              text-align: center;
            `}
          >
            <p
              css={`
                font-weight: ${fontWeight.medium};
                font-size: 22px;
                color: ${theme.contentSecondary};
                padding-top: ${2 * GU}px;
              `}
            >
              Convert
            </p>
            <h3
              css={`
                font-size: ${compactMode ? 24 : 28}px;
                font-weight: ${fontWeight.medium};
                line-height: 1.3;
                margin-bottom: ${1 * GU}px;
              `}
            >
              {tokenTitle} to ANTv2
            </h3>
          </div>
          <div
            css={`
              padding-top: ${2 * GU}px;
            `}
          >
            <BrandButton
              mode="strong"
              size="large"
              disabled={!balance || balance === '0'}
              onClick={() => {
                if (tokenName === 'anj') {
                  history.push(CONVERTER_PATH)
                } else {
                  history.push(CONVERTER_PATH)
                }
              }}
              label="Start now"
            />
          </div>
        </div>
      </div>
      <div
        css={`
          font-size: 18px;
          line-height: 1;
        `}
      >
        {accountConnected ? (
          <ul>
            <BalanceItem
              title={
                <span>
                  Wallet{' '}
                  <span
                    css={`
                      font-weight: bold;
                    `}
                  >
                    {tokenTitle}
                  </span>{' '}
                  balance
                </span>
              }
              amount={balance}
              compactMode={compactMode}
              tokenName={tokenName}
            />

            {showLpBalance &&
              (lpInfoAvailable ? (
                <BalanceItem
                  title={lpModalButton}
                  amount={lpTotalBalance}
                  skeletonWidth={18 * GU}
                  compactMode={compactMode}
                  tokenName={tokenName}
                />
              ) : (
                <span
                  css={`
                    color: ${theme.contentSecondary};
                  `}
                >
                  Distribution unavailable on Rinkeby
                </span>
              ))}
          </ul>
        ) : (
          <p
            css={`
              color: ${theme.contentSecondary};
            `}
          >
            Enable account to see your balance
          </p>
        )}
      </div>
    </div>
  )
}

export default TokenConversionCard