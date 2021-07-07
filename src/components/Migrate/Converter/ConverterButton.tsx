import React, { useMemo } from 'react'
import {
  IconConnect,
  // @ts-ignore
} from '@aragon/ui'
import BrandButton from '../../BrandButton/BrandButton'
import { ValidationStatus } from '../types'
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner'

type ButtonStatus = ValidationStatus

const BUTTON_MESSAGES: Record<ButtonStatus, string> = {
  notConnected: 'Connect wallet',
  insufficientBalance: 'Continue',
  insufficientAmount: 'Continue',
  noAmount: 'Continue',
  valid: 'Continue',
  loading: 'Loading…',
}

type ConverterButtonProps = {
  status: ButtonStatus
  agree: boolean
}

function ConverterButton({ status, agree }: ConverterButtonProps): JSX.Element {
  const disableButton = status === 'loading' || !agree

  const icon = useMemo(() => {
    if (status === 'notConnected') {
      return <IconConnect />
    }

    if (status === 'loading') {
      return <LoadingSpinner />
    }
  }, [status])

  return (
    <BrandButton
      mode="strong"
      wide
      type="submit"
      disabled={disableButton}
      icon={icon}
      label={BUTTON_MESSAGES[status]}
    />
  )
}

export default ConverterButton
