import { EnvNetworkConfig, EnvNetworkName } from './types'

const networks = new Map<EnvNetworkName, EnvNetworkConfig>([
  [
    'ethereum',
    {
      chainId: 1,
      legacyNetworkType: 'main',
      endpoints: {
        ethereum: 'https://mainnet.eth.aragon.network/',
      },
      ipfsGateway: 'https://ipfs.eth.aragon.network/ipfs',
      contracts: {
        tokenAntV1: '0x960b236A07cf122663c4303350609A66A7B288C0',
        tokenAntV2: '0xa117000000f279D81A1D3cc75430fAA017FA5A2e',
        tokenAnj: '0xcD62b1C403fa761BAadFC74C525ce2B51780b184',
        anjNoLockMinterMigrator: '0xf6271c8eBF1C1C0384CBBD6Df8b84380623555Ef',
        antV2Migrator: '0x078BEbC744B819657e1927bF41aB8C74cBBF912D',
        antEthUniswapPool: '0xfa19de406e8f5b9100e4dd5cad8a503a6d686efe',
        antUniIncentivePool: '0xea4d68cf86bce59bf2bfa039b97794ce2c43debc',
        antEthBalancerPool: '0x2cf9106faf2c5c8713035d40df655fb1b9b0f9b9',
        anjLockMinterMigrator: '0xAb788183FfAD7D3fAa54Cfc1f9EEf7ff981F4cfD',
        court: '0xFb072baA713B01cE944A0515c3e1e98170977dAF',
      },
    },
  ],
  [
    'rinkeby',
    {
      chainId: 4,
      legacyNetworkType: 'rinkeby',
      endpoints: {
        ethereum: 'https://rinkeby.eth.aragon.network/',
      },
      ipfsGateway: 'https://ipfs.eth.aragon.network/ipfs',
      contracts: {
        tokenAntV1: '0x59f24735b61e6ef7E5A52F5F7bB708D1c0141C5A',
        tokenAntV2: '0xf0f8D83CdaB2F9514bEf0319F1b434267be36B5c',
        antV2Migrator: '0xF45C53D13bF1F5f757E3331e258589a6f30e662F',
        tokenAnj: '0x96286BbCac30Cef8dCB99593d0e28Fabe95F3572',
        anjNoLockMinterMigrator: '0xEE25745890bc04bCF926436Ef3Ce490089d89F05',
        anjLockMinterMigrator: '0x8A3475C25452B280a3Af1A8a9B4440e9f70f2f30',
        court: '0xC464EB732A1D2f5BbD705727576065C91B2E9f18',
      },
    },
  ],
])

export function getNetworkConfig(name: EnvNetworkName): EnvNetworkConfig {
  return networks.get(name) as EnvNetworkConfig
}
