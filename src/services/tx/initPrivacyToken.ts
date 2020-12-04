import {
  getTotalAmountFromPaymentList,
  getNativeTokenTxInput,
  toBNAmount,
  sendB58CheckEncodeTxToChain,
  getCoinInfoForCache,
  getPrivacyTokenTxInput,
  createHistoryInfo
} from './utils';
import rpc from '@src/services/rpc';
import PaymentInfoModel from '@src/models/paymentInfo';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
import goMethods from '@src/go';
import { PRIVACY_TOKEN_TX_TYPE, TX_TYPE, HISTORY_TYPE } from '@src/constants/tx';
import Validator from '@src/utils/validator';
import { createTx } from './sendPrivacyToken';
import { createTx as createNativeTx } from './sendNativeToken';
import { DEFAULT_NATIVE_FEE } from '@src/constants/constants';
import { ShieldTokenMeta } from '@src/constants/wallet';

interface TokenInfo {
  tokenSymbol: TokenSymbolType,
  tokenName: TokenNameType,
};

interface InitParam extends TokenInfo {
  accountKeySet: AccountKeySetModel,
  availableNativeCoins: CoinModel[],
  nativeFee: number,
  supplyAmount: number,
};

export default async function initPrivacyToken({
  accountKeySet,
  availableNativeCoins,
  nativeFee = DEFAULT_NATIVE_FEE,
  tokenSymbol,
  tokenName,
  supplyAmount
} : InitParam) {
  new Validator('accountKeySet', accountKeySet).required();
  new Validator('availableNativeCoins', availableNativeCoins).required();
  new Validator('nativeFee', nativeFee).required().amount();
  new Validator('tokenSymbol', tokenSymbol).required().string();
  new Validator('tokenName', tokenName).required().string();
  new Validator('supplyAmount', supplyAmount).required().amount();

  const usePrivacyForPrivacyToken = false;
  const usePrivacyForNativeToken = true;
  const privacyPaymentInfoList = [
    new PaymentInfoModel({
      paymentAddress: accountKeySet.paymentAddressKeySerialized,
      amount: supplyAmount,
      message: ''
    })
  ];
  const tokenId = <string>'';
  const nativePaymentInfoList = <PaymentInfoModel[]>null;
  const nativeTokenFeeBN = toBNAmount(nativeFee);
  const nativePaymentAmountBN = getTotalAmountFromPaymentList(nativePaymentInfoList);
  const privacyTokenFeeBN = toBNAmount(0);
  const privacyPaymentAmountBN = toBNAmount(0);
  const nativeTxInput = await getNativeTokenTxInput(accountKeySet, availableNativeCoins, nativePaymentAmountBN, nativeTokenFeeBN, usePrivacyForNativeToken);
  const privacyAvailableCoins: CoinModel[] = [];

  console.log('nativeTxInput', nativeTxInput);

  const privacyTxInput = await getPrivacyTokenTxInput(accountKeySet, privacyAvailableCoins, tokenId, privacyPaymentAmountBN, privacyTokenFeeBN, usePrivacyForPrivacyToken);
  console.log('privacyTxInput', privacyTxInput);

  const txInfo = await createTx({
    nativeTxInput,
    nativePaymentInfoList,
    nativeTokenFeeBN,
    nativePaymentAmountBN,
    privacyTxInput,
    privacyPaymentInfoList,
    privacyTokenFeeBN,
    privacyPaymentAmountBN,
    privateKeySerialized: accountKeySet.privateKeySerialized,
    tokenId,
    tokenSymbol,
    tokenName,
    usePrivacyForPrivacyToken,
    usePrivacyForNativeToken,
    initTxMethod: goMethods.initPrivacyTokenTx,
    privacyTokenParamAdditional: {
      amount: supplyAmount.toString(),
      tokenTxType: PRIVACY_TOKEN_TX_TYPE.INIT,
    },
  });

  console.log('txInfo', txInfo);

  const sentInfo = await sendB58CheckEncodeTxToChain(rpc.sendRawTxCustomTokenPrivacy, txInfo.b58CheckEncodeTx);

  const { serialNumberList: nativeSpendingCoinSNs, listUTXO: nativeListUTXO } = getCoinInfoForCache(nativeTxInput.inputCoinStrs);
  
  return createHistoryInfo({
    txId: sentInfo.txId,
    lockTime: txInfo.lockTime,
    nativePaymentInfoList,
    nativeFee,
    nativeListUTXO,
    nativePaymentAmount: nativePaymentAmountBN.toNumber(),
    nativeSpendingCoinSNs,
    tokenSymbol,
    tokenName,
    tokenId: txInfo.tokenID,
    txType: TX_TYPE.PRIVACY_TOKEN_WITH_PRIVACY_MODE,
    privacyTokenTxType: PRIVACY_TOKEN_TX_TYPE.INIT,
    privacyPaymentInfoList,
    privacyPaymentAmount: supplyAmount,
    accountPublicKeySerialized: accountKeySet.publicKeySerialized,
    usePrivacyForNativeToken,
    usePrivacyForPrivacyToken,
    historyType: HISTORY_TYPE.ISSUE_TOKEN
  });
}

interface ShieldParam {
  accountKeySet: AccountKeySetModel,
  nativeAvailableCoins: CoinModel[],
  nativeFee: number,
  incTokenID: string,
  proofStrs: string[],
  blockHash: string,
  txIndex: number,
};

export async function createShieldTokenRequestTx({
  accountKeySet,
  nativeAvailableCoins,
  nativeFee = DEFAULT_NATIVE_FEE,
  incTokenID,
  proofStrs,
  blockHash,
  txIndex
} : ShieldParam) {
  new Validator('accountKeySet', accountKeySet).required();
  new Validator('nativeAvailableCoins', nativeAvailableCoins).required();
  new Validator('nativeFee', nativeFee).required().amount();
  new Validator('incTokenID', incTokenID).required().string();
  new Validator('proofStrs', proofStrs).required();
  new Validator('txIndex', txIndex).required().amount();
  new Validator('blockHash', proofStrs).required().string();

  const nativeFeeBN = toBNAmount(nativeFee);

  const usePrivacyForNativeToken = true;
  const nativePaymentInfoList: PaymentInfoModel[] = null;
  const nativePaymentAmountBN = getTotalAmountFromPaymentList(nativePaymentInfoList);

  const nativeTxInput = await getNativeTokenTxInput(accountKeySet, nativeAvailableCoins, nativePaymentAmountBN, nativeFeeBN, usePrivacyForNativeToken);
  console.log('nativeTxInput', nativeTxInput);
  
  const metaData = {
    ProofStrs: proofStrs,
    TxIndex: txIndex,
    BlockHash: blockHash,
    IncTokenID: incTokenID,
    Type: ShieldTokenMeta
  };

  const txInfo = await createNativeTx({
    nativeTxInput,
    nativePaymentInfoList,
    nativeTokenFeeBN: nativeFeeBN,
    nativePaymentAmountBN,
    privateKeySerialized: accountKeySet.privateKeySerialized,
    usePrivacyForNativeToken,
    initTxMethod: goMethods.initShieldToken,
    metaData
  });
  console.log('txInfo', txInfo);

  const sentInfo = await sendB58CheckEncodeTxToChain(rpc.sendRawTx, txInfo.b58CheckEncodeTx);
  const { serialNumberList: nativeSpendingCoinSNs, listUTXO: nativeListUTXO } = getCoinInfoForCache(nativeTxInput.inputCoinStrs);
  
  const history = createHistoryInfo({
    txId: sentInfo.txId,
    lockTime: txInfo.lockTime,
    nativePaymentInfoList,
    nativeFee,
    nativeListUTXO: nativeListUTXO,
    nativePaymentAmount: nativePaymentAmountBN.toNumber(),
    nativeSpendingCoinSNs: nativeSpendingCoinSNs,
    txType: TX_TYPE.NORMAL,
    accountPublicKeySerialized: accountKeySet.publicKeySerialized,
    usePrivacyForNativeToken,
    historyType: HISTORY_TYPE.SHIELD_TOKEN
  });

  return history;
}