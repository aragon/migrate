import React from 'react'
// @ts-ignore
import { GU, Link, useTheme, useLayout } from '@aragon/ui'
import featuresPng from '../../assets/antv2-features.png'
import redeemAnjPng from '../../assets/redeem-anj.png'
import { fontWeight } from '../../style/font'
import LayoutLimiter from '../Layout/LayoutLimiter'

const BLOG_POST_URL = 'https://aragon.org/blog/antv2'
const REDEEM_ANJ_PROPOSAL_URL = 'https://aragon.org/blog/merge-anj'

function Features({
  ...props
}: React.HTMLAttributes<HTMLElement>): JSX.Element {
  const theme = useTheme()
  const { layoutName } = useLayout()

  const compactMode = layoutName === 'small'
  const stackColumns = layoutName === 'small' || layoutName === 'medium'

  return (
    <LayoutLimiter size="medium" {...props}>
      <div
        css={`
          display: grid;
          grid-template-columns: ${stackColumns ? '1fr' : '1fr 1fr'};
          align-items: center;
          grid-gap: ${10 * GU}px;
          text-align: ${stackColumns ? 'center' : 'left'};
          padding-bottom: ${10 * GU}px;
        `}
      >
        <div>
          <div
            css={`
              max-width: ${stackColumns ? `${62 * GU}px` : 'auto'};
              margin: auto;
            `}
          >
            <div
              css={`
                position: relative;
                width: 100%;

                margin-left: auto;
                margin-right: auto;
              `}
            >
              <img
                alt="Redeem ANJ into ANTv2"
                src={redeemAnjPng}
                css={`
                  width: 100%;
                `}
              />
            </div>
          </div>
        </div>
        <div>
          <h2
            css={`
              font-weight: ${fontWeight.bold};
              line-height: 1.2;
              font-size: ${compactMode ? `35` : `48`}px;
              margin-bottom: ${2.5 * GU}px;
            `}
          >
            Redeem your ANJ&nbsp;into ANTv2
          </h2>
          <p
            css={`
              font-weight: ${fontWeight.medium};
              font-size: ${compactMode ? `18` : `26`}px;
              color: ${theme.contentSecondary};
              margin-bottom: ${3 * GU}px;
            `}
          >
            ANJ holders will be compensated with ANTv2 to ensure they can
            continue participating in Aragon Court with equivalent economic
            weight.
          </p>
          <Link
            href={REDEEM_ANJ_PROPOSAL_URL}
            css={`
              font-weight: ${fontWeight.medium};
              font-size: ${compactMode ? `17` : `20`}px;
              text-decoration: none;
            `}
          >
            Review the proposal
          </Link>
        </div>
      </div>

      <div
        css={`
          display: grid;
          grid-template-columns: ${stackColumns ? '1fr' : '1fr 1fr'};
          align-items: center;
          grid-gap: ${10 * GU}px;
          text-align: ${stackColumns ? 'center' : 'left'};
        `}
      >
        <div>
          <h2
            css={`
              font-weight: ${fontWeight.bold};
              line-height: 1.2;
              font-size: ${compactMode ? `35` : `48`}px;
              margin-bottom: ${2.5 * GU}px;
            `}
          >
            Why are we modernizing&nbsp;ANT?
          </h2>
          <p
            css={`
              font-weight: ${fontWeight.medium};
              font-size: ${compactMode ? `18` : `26`}px;
              color: ${theme.contentSecondary};
              margin-bottom: ${3 * GU}px;
            `}
          >
            It’s time for ANT to get an upgrade! Switching to a newer, simpler
            token contract makes ANT transactions 66% cheaper and support
            gasless&nbsp;transfers.
          </p>
          <Link
            href={BLOG_POST_URL}
            css={`
              font-weight: ${fontWeight.medium};
              font-size: ${compactMode ? `17` : `20`}px;
              text-decoration: none;
            `}
          >
            Read the blog post
          </Link>
        </div>
        <div>
          <div
            css={`
              max-width: ${stackColumns ? `${62 * GU}px` : 'auto'};
              margin: auto;
            `}
          >
            <div
              css={`
                position: relative;
                padding-top: 108%;
                width: 100%;

                margin-left: auto;
                margin-right: auto;
              `}
            >
              <img
                alt="ANT v2"
                src={featuresPng}
                css={`
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                `}
              />
            </div>
          </div>
        </div>
      </div>
    </LayoutLimiter>
  )
}

export default Features
