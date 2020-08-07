/// <reference types="bn.js" />
import PaymentInfoModel from "../../models/paymentInfo";
import AccountKeySetModel from "../../models/key/accountKeySet";
import CoinModel from "../../models/coin";
interface TokenInfo {
    tokenId: TokenIdType;
    tokenSymbol: TokenSymbolType;
    tokenName: TokenNameType;
}
interface SendParam extends TokenInfo {
    accountKeySet: AccountKeySetModel;
    nativeAvailableCoins: CoinModel[];
    privacyAvailableCoins: CoinModel[];
    nativeFee: number;
    privacyFee: number;
    outchainAddress: string;
    burningAmount: number;
    metaType: number;
}
export default function sendBurningRequest({ accountKeySet, nativeAvailableCoins, privacyAvailableCoins, nativeFee, privacyFee, tokenId, tokenSymbol, tokenName, outchainAddress, burningAmount, metaType, }: SendParam): Promise<import("../../..").TxHistoryModel>;
export declare function createRawBurningRequestTx({ accountKeySet, nativeAvailableCoins, privacyAvailableCoins, nativeFee, privacyFee, tokenId, tokenSymbol, tokenName, outchainAddress, burningAmount, metaType }: SendParam): Promise<{
    txInfo: {
        b58CheckEncodeTx: string;
        lockTime: number;
        tokenID?: string;
    };
    nativeTxInput: import("./utils").TxInputType;
    privacyTxInput: import("./utils").TxInputType;
    nativePaymentAmountBN: import("bn.js");
    privacyPaymentAmountBN: import("bn.js");
    usePrivacyForPrivacyToken: boolean;
    usePrivacyForNativeToken: boolean;
    nativePaymentInfoList: PaymentInfoModel[];
    privacyPaymentInfoList: PaymentInfoModel[];
    burningReqMetadata: {
        BurnerAddress: string;
        BurningAmount: number;
        TokenID: string;
        TokenName: string;
        RemoteAddress: string;
        Type: number;
    };
    totalBurningAmountBN: import("bn.js");
}>;
export {};
//# sourceMappingURL=sendBurningRequest.d.ts.map