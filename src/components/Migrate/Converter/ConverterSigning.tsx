import React, { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
// @ts-ignore
import { useLayout, GU } from '@aragon/ui'
import TokenAmount from 'token-amount'
import BrandButton from '../../BrandButton/BrandButton'
import Stepper from '../../Stepper/Stepper'
import { getMockSteps } from '../../../mock'
import SigningInfo from './SigningInfo'
import { StepHandleSignProps } from '../../Stepper/types'
import {
  useAntTokenV1Contract,
  useAnjTokenContract,
  useAntV2MigratorContract,
  useAnjNoLockMinterMigratorContract,
  useAnjLockMinterMigratorContract,
} from '../../../hooks/useContract'
import { networkEnvironment } from '../../../environment'
import { useMigrateState } from '../MigrateStateProvider'
import { useWallet } from '../../../providers/Wallet'
import { ContractTransaction } from 'ethers'
import PageHeading from '../../PageHeading/PageHeading'
import { useActivity } from '../../Activity/ActivityProvider'
import { useAccountBalances } from '../../../providers/AccountBalances'
import { ANJ_CONVERSIONS, MIGRATORS } from '../conversionUtils'

const { contracts } = networkEnvironment

type ConverterSigningProps = {
  mockSigningSteps?: 1 | 2 | 3
}

function ConverterSigning({
  mockSigningSteps,
}: ConverterSigningProps): JSX.Element {
  const { addActivity } = useActivity()
  const history = useHistory()
  const { layoutName } = useLayout()
  const { account } = useWallet()
  const {
    convertAmount,
    goToForm,
    signingConfiguration,
    conversionType,
  } = useMigrateState()
  const { antV1, anj } = useAccountBalances()
  const antTokenV1Contract = useAntTokenV1Contract()
  const anjTokenContract = useAnjTokenContract()
  const antV2MigratorContract = useAntV2MigratorContract()
  const anjNoLockMinterMigratorContract = useAnjNoLockMinterMigratorContract()
  const anjLockMinterMigratorContract = useAnjLockMinterMigratorContract()
  const stackedButtons = layoutName === 'small'
  const isANJConversion = ANJ_CONVERSIONS.has(conversionType)

  const handleBackToHome = useCallback(() => {
    history.push('/')
  }, [history])

  const antMigrationContractInteraction = useCallback(():
    | Promise<ContractTransaction>
    | undefined => {
    if (!convertAmount) {
      throw new Error('No amount was provided!')
    }

    // We need to call the "migrate" method directly when there is an existing
    // allowance amount, otherwise we can use "appoveAndCall" on the v1 contract
    if (signingConfiguration === 'withinAnExistingAllowance') {
      return antV2MigratorContract?.functions.migrate(convertAmount)
    }

    return antTokenV1Contract?.functions.approveAndCall(
      contracts.antV2Migrator,
      convertAmount,
      '0x'
    )
  }, [
    antTokenV1Contract,
    antV2MigratorContract,
    convertAmount,
    signingConfiguration,
  ])

  const anjNoLockMigrationContractInteraction = useCallback(():
    | Promise<ContractTransaction>
    | undefined => {
    if (!convertAmount) {
      throw new Error('No amount was provided!')
    }

    if (signingConfiguration === 'withinAnExistingAllowance') {
      return anjNoLockMinterMigratorContract?.functions.migrate(convertAmount)
    }

    return anjTokenContract?.functions.approveAndCall(
      contracts.anjNoLockMinterMigrator,
      convertAmount,
      '0x'
    )
  }, [
    anjTokenContract,
    anjNoLockMinterMigratorContract,
    convertAmount,
    signingConfiguration,
  ])

  const anjLockMigrationContractInteraction = useCallback(():
    | Promise<ContractTransaction>
    | undefined => {
    if (!convertAmount) {
      throw new Error('No amount was provided!')
    }

    if (signingConfiguration === 'withinAnExistingAllowance') {
      return anjLockMinterMigratorContract?.functions.migrate(convertAmount)
    }

    return anjTokenContract?.functions.approveAndCall(
      contracts.anjLockMinterMigrator,
      convertAmount,
      '0x'
    )
  }, [
    anjTokenContract,
    anjLockMinterMigratorContract,
    convertAmount,
    signingConfiguration,
  ])

  const addUpgradeActivity = useCallback(
    (tx) => {
      const formattedAmount = new TokenAmount(
        convertAmount ?? 0,
        antV1.decimals
      ).format({
        digits: antV1.decimals,
      })

      addActivity(
        tx,
        'upgradeANT',
        `Upgrade ${formattedAmount} ANTv1 to ${formattedAmount} ANTv2`
      )
    },
    [addActivity, convertAmount, antV1.decimals]
  )

  const addRedeemActivity = useCallback(
    (tx) => {
      const formattedAmount = new TokenAmount(
        convertAmount ?? 0,
        anj.decimals
      ).format({
        digits: anj.decimals,
      })

      addActivity(
        tx,
        'redeemANJ',
        `Redeem ${formattedAmount} ANJ to ${formattedAmount} ANTv2`
      )
    },
    [addActivity, convertAmount, anj.decimals]
  )

  const transactionSteps = useMemo(() => {
    const upgradeANTSteps = [
      {
        title: 'Initiate upgrade',
        descriptions: {
          waiting: 'Waiting for signature…',
          prompting: 'Sign transaction…',
          working: 'Sign transaction…',
          success: 'Transaction signed',
          error: 'An error has occured',
        },
        handleSign: async ({
          setSuccess,
          setError,
          setHash,
        }: StepHandleSignProps): Promise<void> => {
          try {
            // convertAmount should have already been validated and exist
            // per the form but we still want to check here because:
            // 1. It keeps typescript happy
            // 2. Detailed errors are a good thing
            if (!convertAmount) {
              throw new Error('No amount was provided!')
            }

            const tx = await antMigrationContractInteraction()

            if (tx) {
              addUpgradeActivity(tx)
              setHash(tx.hash)
            }

            setSuccess()
          } catch (err) {
            console.error(err)
            setError()
          }
        },
      },
    ]

    const redeemANJSteps = [
      {
        title: 'Initiate ANJ redemption',
        descriptions: {
          waiting: 'Waiting for signature…',
          prompting: 'Sign transaction…',
          working: 'Sign transaction…',
          success: 'Transaction signed',
          error: 'An error has occured',
        },
        handleSign: async ({
          setSuccess,
          setError,
          setHash,
        }: StepHandleSignProps): Promise<void> => {
          try {
            if (!convertAmount) {
              throw new Error('No amount was provided!')
            }

            const tx =
              conversionType === 'ANJ'
                ? await anjNoLockMigrationContractInteraction()
                : await anjLockMigrationContractInteraction()

            if (tx) {
              addRedeemActivity(tx)
              setHash(tx.hash)
            }

            setSuccess()
          } catch (err) {
            console.error(err)
            setError()
          }
        },
      },
    ]

    const steps = isANJConversion ? redeemANJSteps : upgradeANTSteps

    // When the requested migration amount exceeds an existing allowance we need to add a step
    // to reset it to 0 before using "approveAndCall"
    if (signingConfiguration === 'requiresReset') {
      steps.unshift({
        title: 'Approve',
        descriptions: {
          waiting: 'Waiting for signature…',
          prompting: 'Sign transaction…',
          working: 'Transaction mining…',
          success: 'Transaction mined',
          error: 'An error has occured',
        },
        handleSign: async ({
          setSuccess,
          setWorking,
          setError,
          setHash,
        }: StepHandleSignProps): Promise<void> => {
          try {
            const contract = isANJConversion
              ? anjTokenContract
              : antTokenV1Contract

            const migrator = MIGRATORS[conversionType]
            const tx = await contract?.functions.approve(migrator, '0')

            if (tx) {
              if (isANJConversion) {
                addActivity(tx, 'approveANJ', 'Approve ANJ spend')
              } else {
                addActivity(tx, 'approveANT', 'Approve ANTv1 spend')
              }
              setHash(tx.hash)
            }

            setWorking()

            // We must wait for the approval tx to be mined before the next migration
            // step can verify as valid
            await tx?.wait()

            setSuccess()
          } catch (err) {
            console.error(err)
            setError()
          }
        },
      })
    }

    return steps
  }, [
    antTokenV1Contract,
    anjTokenContract,
    isANJConversion,
    convertAmount,
    signingConfiguration,
    conversionType,
    antMigrationContractInteraction,
    anjNoLockMigrationContractInteraction,
    anjLockMigrationContractInteraction,
    addActivity,
    addUpgradeActivity,
    addRedeemActivity,
  ])
  return (
    <>
      <PageHeading
        title="Aragon Upgrade"
        description={
          isANJConversion
            ? 'Redeeming your ANJ for ANTv2'
            : 'Upgrading your ANTv1'
        }
        css={`
          margin-bottom: ${7 * GU}px;
        `}
      />
      <Stepper
        steps={
          mockSigningSteps ? getMockSteps(mockSigningSteps) : transactionSteps
        }
        renderInfo={({ stepperStatus, handleSign }) => (
          <div
            css={`
              margin-top: ${4 * GU}px;
              margin-left: auto;
              margin-right: auto;
              max-width: ${70 * GU}px;
            `}
          >
            <div
              css={`
                margin-bottom: ${4 * GU}px;
              `}
            >
              {stepperStatus === 'error' ? (
                <div
                  css={`
                    display: grid;
                    grid-gap: ${1 * GU}px;
                    grid-template-columns: ${stackedButtons
                      ? 'auto'
                      : '1fr 1fr'};
                  `}
                >
                  <BrandButton wide onClick={goToForm}>
                    Abandon process
                  </BrandButton>
                  <BrandButton
                    mode="strong"
                    onClick={handleSign}
                    wide
                    // Cover edge case where a user rejects signing and disconnects the account
                    disabled={!account}
                  >
                    Repeat transaction
                  </BrandButton>
                </div>
              ) : (
                <BrandButton
                  onClick={handleBackToHome}
                  disabled={stepperStatus === 'working'}
                  wide
                  css={`
                    max-width: ${30 * GU}px;
                    margin: auto;
                  `}
                >
                  Back to Homepage
                </BrandButton>
              )}
            </div>
            <SigningInfo
              status={stepperStatus}
              multipleTransactions={signingConfiguration === 'requiresReset'}
            />
          </div>
        )}
        css={`
          width: 100%;
        `}
      />
    </>
  )
}

export default ConverterSigning
