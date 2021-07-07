import React, { ReactNode } from 'react'
import { useMigrateState } from '../MigrateStateProvider'
// @ts-ignore
import { Info, Link, GU } from '@aragon/ui'
import { getEtherscanUrl } from '../../../utils/etherscan'
import { networkEnvironment } from '../../../environment'
import styled from 'styled-components'

const { contracts } = networkEnvironment
const antV2ContractUrl = getEtherscanUrl(contracts.tokenAntV2)

const StyledInfo = styled(Info)`
  display: flex;
  flex-flow: column wrap;
  row-gap: ${GU}px;
  margin-top: ${3 * GU}px;
  margin-bottom: ${2 * GU}px;
`

const StyledLink = styled(Link)`
  text-decoration: none;
`

const ARROW = <>&#8594;</>

type OneWayMessageProps = {
  arrow?: ReactNode
  boldLink?: boolean
}

function OneWayMessage({
  arrow = null,
  boldLink = false,
}: OneWayMessageProps): JSX.Element {
  return (
    <div>
      This conversion is a one way path.{' '}
      <StyledLink href={antV2ContractUrl} style={{ textDecoration: 'none' }}>
        <label style={{ fontWeight: boldLink ? 'bold' : 'normal' }}>
          {arrow} Review ANTv2 token contract
        </label>
      </StyledLink>
    </div>
  )
}

function StakingInfo(): JSX.Element {
  const { getMinConvertAmount, conversionType } = useMigrateState()

  // format the amount to have no decimals
  const minConvertAmount = getMinConvertAmount(0)

  if (conversionType === 'ANJ-LOCK') {
    return (
      <StyledInfo mode="warning">
        <div>
          To be a guardian you need{' '}
          <b>
            {minConvertAmount == null
              ? 'some amount of'
              : `at least ${minConvertAmount}`}{' '}
            ANJ
          </b>{' '}
          that will be converted into ANT to be{' '}
          <b>staked until October 5th, 2021</b> on Aragon Court.{' '}
          <StyledLink
            href={'https://help.aragon.org/article/98-anj-conversion-faq'}
          >
            <b>{ARROW} Learn more</b>
          </StyledLink>
        </div>

        <div>
          In addition, if you redeem this ANJ,{' '}
          <b>you must fulfil your obligations</b> as a guardian for Aragon
          Court.{' '}
          <StyledLink href={'https://court.aragon.org'}>
            <b>{ARROW} Learn more</b>
          </StyledLink>
        </div>

        <OneWayMessage arrow={ARROW} boldLink={true} />
      </StyledInfo>
    )
  }

  return (
    <StyledInfo>
      <OneWayMessage />
    </StyledInfo>
  )
}

export default StakingInfo
