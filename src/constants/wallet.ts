const PriKeyType = 0x0; // Serialize wallet account key into string with only PRIVATE KEY of account KeySet
const PaymentAddressType = 0x1; // Serialize wallet account key into string with only PAYMENT ADDRESS of account KeySet
const ViewingKeyType = 0x2; // Serialize wallet account key into string with only READONLY KEY of account KeySet
const PublicKeyType = 0x3; // Serialize wallet account key into string with only READONLY KEY of account KeySet

const PriKeySerializeSize = 71;
const PaymentAddrSerializeSize = 67;
const ReadonlyKeySerializeSize = 67;
const PublicKeySerializeSize = 34;

const PriKeySerializeAddCheckSumSize = 75;
const PaymentAddrSerializeAddCheckSumSize = 71;
const ReadonlyKeySerializeAddCheckSumSize = 71;

// for staking tx
// amount in mili constant
const MetaStakingBeacon = 64;
const MetaStakingShard = 63;
const StopAutoStakingMeta = 127;

const ShardStakingType = 0;
const BeaconStakingType = 1;

const MaxTxSize = 100;    // in kb

const ChildNumberSize = 4;
const ChainCodeSize = 32;
const NanoUnit = 1e-9;

const BurnAddress =
  '15pABFiJVeh9D5uiQEhQX4SVibGGbdAVipQxBdxkmDqAJaoG1EdFKHBrNfs';

const BurnAddress2 =
'12RxahVABnAVCGP3LGwCn8jkQxgw7z1x14wztHzn455TTVpi1wBq9YGwkRMQg3J4e657AbAnCvYCJSdA9czBUNuCKwGSRQt55Xwz8WA';

const BurningRequestMeta = 240;
const BurningRequestDepositToSCMeta = 242;
const WithDrawRewardRequestMeta = 44;
const PDEContributionMeta = 204;
const PDETradeRequestMeta = 205;
const PDETradeResponseMeta = 206;
const PDEWithdrawalRequestMeta = 207;
const PDEWithdrawalResponseMeta = 208;
const ShieldTokenMeta = 80;

const PRVID = [4];
const PRVIDSTR = '0000000000000000000000000000000000000000000000000000000000000004';
const PDEPOOLKEY = 'pdepool';

const NoStakeStatus = -1;
const CandidatorStatus = 0;
const ValidatorStatus = 1;

const MenmonicWordLen = 12;
const PercentFeeToReplaceTx = 10;
const MaxSizeInfoCoin = 255;
const ShardNumber = 8;


export {
  PriKeyType,
  PaymentAddressType,
  ViewingKeyType,
  PublicKeyType,
  PriKeySerializeSize,
  PaymentAddrSerializeSize,
  ReadonlyKeySerializeSize,
  PublicKeySerializeSize,
  MetaStakingBeacon,
  MetaStakingShard,
  ShardStakingType,
  BeaconStakingType,
  MaxTxSize,
  ChildNumberSize,
  ChainCodeSize,
  PercentFeeToReplaceTx,
  NanoUnit,
  BurnAddress,
  BurningRequestMeta,
  BurningRequestDepositToSCMeta,
  WithDrawRewardRequestMeta,
  PRVID,
  NoStakeStatus,
  CandidatorStatus,
  ValidatorStatus,
  PDEContributionMeta,
  PDETradeRequestMeta,
  PDETradeResponseMeta,
  PDEWithdrawalRequestMeta,
  PDEWithdrawalResponseMeta,
  PRVIDSTR,
  PDEPOOLKEY,
  PriKeySerializeAddCheckSumSize,
  PaymentAddrSerializeAddCheckSumSize,
  ReadonlyKeySerializeAddCheckSumSize,
  MenmonicWordLen,
  MaxSizeInfoCoin,
  StopAutoStakingMeta,
  ShardNumber,
  BurnAddress2,
  ShieldTokenMeta,
};
