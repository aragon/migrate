import { useMemo } from 'react'
import TokenAmount from 'token-amount'
import { ValidationStatus } from '../types'
import { useMigrateState } from '../MigrateStateProvider'
import { useAccountBalances } from '../../../providers/AccountBalances'
import { parseUnits } from '../../../utils/math-utils'
import { BigNumber } from 'ethers'
import { ANJ_CONVERSIONS } from '../conversionUtils'

type InputValidationReturn = {
  parsedAmountBn: BigNumber
  formattedAmount: string
  maxAmount: string
  validationStatus: ValidationStatus
}

function useInputValidation(amount: string): InputValidationReturn {
  const { conversionType, getMinConvertAmount } = useMigrateState()
  const { antV1, anj } = useAccountBalances()
  const token = ANJ_CONVERSIONS.has(conversionType) ? anj : antV1
  const { balance, decimals } = token

  const parsedAmountBn = useMemo(() => parseInputValue(amount, decimals), [
    amount,
    decimals,
  ])

  const maxAmount = useMemo((): string => {
    return new TokenAmount(balance?.toString() || '', decimals).format({
      commify: false,
      digits: decimals,
    })
  }, [balance, decimals])

  const formattedAmount = useMemo((): string => {
    const formatted = new TokenAmount(parsedAmountBn, decimals).format({
      commify: false,
      digits: decimals,
    })

    const [, inputDecimalString] = amount.split('.')

    const formatWhenEmpty =
      (inputDecimalString && inputDecimalString.length > decimals) ||
      formatted === '0'

    return formatWhenEmpty ? '0.0' : formatted
  }, [parsedAmountBn, decimals, amount])

  const validationStatus = useMemo((): ValidationStatus => {
    if (!balance) {
      return 'notConnected'
    }

    if (parsedAmountBn.gt(balance)) {
      return 'insufficientBalance'
    }

    if (parsedAmountBn.lte(0)) {
      return 'noAmount'
    }

    if (conversionType === 'ANJ-LOCK') {
      const minConvertAmount = getMinConvertAmount(anj.decimals)
      if (!minConvertAmount) {
        return 'loading'
      }

      const minConvertAmountBn = parseUnits(minConvertAmount, anj.decimals)
      if (parsedAmountBn.lt(minConvertAmountBn)) {
        return 'insufficientAmount'
      }
    }

    return 'valid'
  }, [
    parsedAmountBn,
    balance,
    conversionType,
    anj.decimals,
    getMinConvertAmount,
  ])

  return {
    parsedAmountBn,
    formattedAmount,
    validationStatus,
    maxAmount,
  }
}

function parseInputValue(inputValue: string, decimals: number): BigNumber {
  const trimmedValue = inputValue.trim()

  return parseUnits(trimmedValue || '0', decimals)
}

export default useInputValidation
