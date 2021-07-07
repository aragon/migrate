import { BigNumber } from 'ethers'
import React, {
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { ConversionStage, TokenConversionType } from './types'
import TokenAmount from 'token-amount'

type MigrateStateProviderProps = {
  conversionType: TokenConversionType
  children: ReactNode
}

type SigningConfiguration =
  | 'requiresReset'
  | 'withinAnExistingAllowance'
  | 'directApproveAndCall'

type MigrateStateContext = {
  conversionStage: ConversionStage
  conversionType: TokenConversionType
  convertAmount: BigNumber | null
  signingConfiguration: SigningConfiguration
  goToSigning: () => void
  goToForm: () => void
  updateConvertAmount: (amount: BigNumber | null) => void
  updateMinConvertAmount: (amount: TokenAmount | null) => void
  getMinConvertAmount: (digits?: number) => string | null
  changeSigningConfiguration: (config: SigningConfiguration) => void
}

const UseMigrateStateContext = React.createContext<MigrateStateContext | null>(
  null
)

function MigrateStateProvider({
  children,
  conversionType,
}: MigrateStateProviderProps): JSX.Element {
  const [conversionStage, setConversionStage] = useState<
    MigrateStateContext['conversionStage']
  >('form')

  const [convertAmount, setConvertAmount] = useState<
    MigrateStateContext['convertAmount']
  >(null)

  const [minConvertAmount, setMinConvertAmount] = useState<TokenAmount | null>(
    null
  )

  const [signingConfiguration, setSigningConfiguration] = useState<
    MigrateStateContext['signingConfiguration']
  >('directApproveAndCall')

  const goToSigning = useCallback(() => setConversionStage('signing'), [])
  const goToForm = useCallback(() => setConversionStage('form'), [])
  const updateConvertAmount = useCallback(
    (amount) => setConvertAmount(amount),
    []
  )
  const updateMinConvertAmount = useCallback(
    (amount) => setMinConvertAmount(amount),
    []
  )
  const getMinConvertAmount = useCallback(
    (digits?: number): string | null => {
      if (!minConvertAmount) {
        return null
      }
      return minConvertAmount.format({ commify: false, digits })
    },
    [minConvertAmount]
  )
  const changeSigningConfiguration = useCallback(
    (config) => setSigningConfiguration(config),
    []
  )

  const contextValue = useMemo(
    (): MigrateStateContext => ({
      conversionStage,
      conversionType,
      signingConfiguration,
      changeSigningConfiguration,
      goToSigning,
      convertAmount,
      updateConvertAmount,
      updateMinConvertAmount,
      getMinConvertAmount,
      goToForm,
    }),
    [
      conversionStage,
      conversionType,
      signingConfiguration,
      changeSigningConfiguration,
      goToSigning,
      convertAmount,
      updateConvertAmount,
      updateMinConvertAmount,
      getMinConvertAmount,
      goToForm,
    ]
  )

  return (
    <UseMigrateStateContext.Provider value={contextValue}>
      {children}
    </UseMigrateStateContext.Provider>
  )
}

function useMigrateState(): MigrateStateContext {
  return useContext(UseMigrateStateContext) as MigrateStateContext
}

export { MigrateStateProvider, useMigrateState }
