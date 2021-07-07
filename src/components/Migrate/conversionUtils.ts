import { TokenConversionType } from './types'
import { networkEnvironment } from '../../environment'

export const CONVERSION_RATE: Record<TokenConversionType, number> = {
  ANT: 1,
  ANJ: 0.015,
  'ANJ-LOCK': 0.044,
}

const { contracts } = networkEnvironment
export const MIGRATORS: Record<TokenConversionType, string> = {
  ANT: contracts.antV2Migrator,
  ANJ: contracts.anjNoLockMinterMigrator,
  'ANJ-LOCK': contracts.anjLockMinterMigrator,
}

export const ANJ_CONVERSIONS = new Set(['ANJ', 'ANJ-LOCK'])
