import { TokenInfo } from '@src/constants';
import Token from './token';
import NativeTokenModel from '@src/models/token/nativeToken';
import AccountKeySetModel from '@src/models/key/accountKeySet';
import sendNativeToken, { sendRawNativeTokenTx } from '@src/services/tx/sendNativeToken';
import { createNativeTokenTx } from '@src/services/tx/sendNativeToken';
import PaymentInfoModel from '@src/models/paymentInfo';
import sendStakingRequest from '@src/services/tx/sendStakingRequest';
import sendNativeTokenPdeContribution from '@src/services/tx/sendNativeTokenPdeContribution';
import sendNativeTokenPdeTradeRequest from '@src/services/tx/sendNativeTokenPdeTradeRequest';
import Validator from '@src/utils/validator';
import { createShieldTokenRequestTx } from '@src/services/tx/initPrivacyToken';
// import sendNativeTokenDefragment from '@src/services/tx/sendNativeTokenDefragment';

class NativeToken extends Token implements NativeTokenModel {
  tokenId: string;
  name: string;
  symbol: string;
  isNativeToken: boolean;

  constructor(accountKeySet: AccountKeySetModel) {
    new Validator('accountKeySet', accountKeySet).required();

    super({ accountKeySet, tokenId: null, name: null, symbol: null });

    this.tokenId = TokenInfo.NATIVE_TOKEN.tokenId;
    this.name = TokenInfo.NATIVE_TOKEN.name;
    this.symbol = TokenInfo.NATIVE_TOKEN.symbol;
    this.isNativeToken = true;
  }

  async transfer(paymentInfoList: PaymentInfoModel[], nativeFee: number) {
    try {
      new Validator('paymentInfoList', paymentInfoList).required().paymentInfoList();
      new Validator('nativeFee', nativeFee).required().amount();
  
      L.info('Native token transfer', { paymentInfoList, nativeFee });
  
      const history = await sendNativeToken({ nativePaymentInfoList: paymentInfoList, nativeFee: nativeFee, accountKeySet: this.accountKeySet, availableCoins: await this.getAvailableCoins() });
      
      L.info(`Native token transfered successfully with tx id ${history.txId}`);
  
      return history;
    } catch (e) {
      L.error('Native token transfer failed', e);
      throw e;
    }
  }

  async createRawTx(paymentInfoList: PaymentInfoModel[], nativeFee: number) {
    try {
      new Validator('paymentInfoList', paymentInfoList).required().paymentInfoList();
      new Validator('nativeFee', nativeFee).required().amount();
  
      L.info('Create raw native token tx', { paymentInfoList, nativeFee });
  
      const res = await createNativeTokenTx({ nativePaymentInfoList: paymentInfoList, nativeFee: nativeFee, accountKeySet: this.accountKeySet, availableCoins: await this.getAvailableCoins() });
      const { txInfo } = res;

      L.info(`Base58 check data tx ${txInfo.b58CheckEncodeTx}`);
  
      return res;
    } catch (e) {
      L.error('Create raw native token tx failed', e);
      throw e;
    }
  }

  static async sendRawTx(b58CheckEncodeTx: string) {
    try {
      new Validator('b58CheckEncodeTx', b58CheckEncodeTx).required().string();
      return await sendRawNativeTokenTx(b58CheckEncodeTx);
    } catch (e) {
      L.error('Send raw native token failed', e);
      throw e;
    }
  }

  async requestStaking(rewardReceiverPaymentAddress: string, nativeFee: number) {
    try {
      new Validator('rewardReceiverPaymentAddress', rewardReceiverPaymentAddress).required().string();
      new Validator('nativeFee', nativeFee).required().amount();

      L.info('Native token request staking', { rewardReceiverPaymentAddress, nativeFee });
  
      const history = await sendStakingRequest({
        candidateAccountKeySet: this.accountKeySet,
        availableNativeCoins: await this.getAvailableCoins(),
        nativeFee,
        rewardReceiverPaymentAddress,
        autoReStaking: true
      });
  
      L.info(`Native token sent request staking successfully with tx id ${history.txId}`);
  
      return history;
    } catch (e) {
      L.error('Native send request staking failed', e);
      throw e;
    }
  }

  async pdeContribution(pdeContributionPairID: string, contributedAmount: number, nativeFee: number) {
    try {
      new Validator('pdeContributionPairID', pdeContributionPairID).required().string();
      new Validator('contributedAmount', contributedAmount).required().amount();
      new Validator('nativeFee', nativeFee).required().amount();
  
      L.info('Native token sent PDE contribution', { pdeContributionPairID, contributedAmount, nativeFee });

      const history = await sendNativeTokenPdeContribution({
        accountKeySet: this.accountKeySet,
        availableNativeCoins: await this.getAvailableCoins(),
        nativeFee,
        pdeContributionPairID,
        tokenId: this.tokenId,
        contributedAmount
      });
  
      L.info(`Native token sent PDE contribution successfully with tx id ${history.txId}`);
  
      return history;
    } catch (e) {
      L.error('Native token sent PDE contribution failed', e);
      throw e;
    }
  }

  async requestTrade(tokenIdBuy: TokenIdType, sellAmount: number, minimumAcceptableAmount: number, nativeFee: number, tradingFee: number) {
    try {
      new Validator('tokenIdBuy', tokenIdBuy).required().string();
      new Validator('sellAmount', sellAmount).required().amount();
      new Validator('minimumAcceptableAmount', minimumAcceptableAmount).required().amount();
      new Validator('nativeFee', nativeFee).required().amount();
      new Validator('tradingFee', tradingFee).required().amount();
  
      L.info('Native token send trade request', {tokenIdBuy, sellAmount, minimumAcceptableAmount, nativeFee, tradingFee});

      const history = await sendNativeTokenPdeTradeRequest({
        accountKeySet: this.accountKeySet,
        availableNativeCoins: await this.getAvailableCoins(),
        nativeFee,
        tradingFee,
        tokenIdBuy,
        tokenIdSell: this.tokenId,
        sellAmount,
        minimumAcceptableAmount
      });
  
      L.info(`Native token sent trade request successfully with tx id ${history.txId}`);
  
      return history;
    } catch (e) {
      L.error('Native token sent trade request failed', e);
      throw e;
    }
  }

  async createRawTxForShieldingToken(incTokenID: string, blockHash: string, txIndex: number, proofStrs: string[], nativeFee: number) {
    try {
      new Validator('incTokenID', incTokenID).required().string();
      new Validator('blockHash', blockHash).required().string();
      new Validator('txIndex', txIndex).required().amount();
      new Validator('proofStrs', proofStrs).required();
      new Validator('nativeFee', nativeFee).required().amount();
  
      L.info(`Shielding privacy token`, {incTokenID, blockHash, txIndex, proofStrs, nativeFee});

      const res = await createShieldTokenRequestTx({
        accountKeySet: this.accountKeySet,
        nativeAvailableCoins: await this.getAvailableCoins(),
        nativeFee,
        incTokenID,
        proofStrs,
        blockHash,
        txIndex,
      });

      return res;
    } catch (e) {
      L.error(`Shielding privacy token request failed`, e);
      throw e;
    } 
  }

  // async defragment(defragmentAmount: number, nativeFee: number, maxCoinNumberToDefragment?: number) {
  //   try {
  //     new Validator('defragmentAmount', defragmentAmount).required().amount();
  //     new Validator('nativeFee', nativeFee).required().amount();
  
  //     L.info('Native token defragment', { defragmentAmount, nativeFee });
  
  //     const history = await sendNativeTokenDefragment({ defragmentAmount, nativeFee: nativeFee, accountKeySet: this.accountKeySet, availableNativeCoins: await this.getAvailableCoins(), maxCoinNumber: maxCoinNumberToDefragment });
      
  //     if (history) {
  //       L.info(`Native token defragmented successfully with tx id ${history.txId}`);
  //     } else {
  //       L.info('Not much coins need to defragment');
  //     }

  //     return history;
  //   } catch (e) {
  //     L.error('Native token defragmented failed', e);
  //     throw e;
  //   }
  // }
}

export default NativeToken;