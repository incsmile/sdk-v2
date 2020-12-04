import AccountKeySetModel from "../../models/key/accountKeySet";
import CoinModel from "../../models/coin";
interface TokenInfo {
    tokenSymbol: TokenSymbolType;
    tokenName: TokenNameType;
}
interface InitParam extends TokenInfo {
    accountKeySet: AccountKeySetModel;
    availableNativeCoins: CoinModel[];
    nativeFee: number;
    supplyAmount: number;
}
export default function initPrivacyToken({ accountKeySet, availableNativeCoins, nativeFee, tokenSymbol, tokenName, supplyAmount }: InitParam): Promise<import("../../..").TxHistoryModel>;
interface ShieldParam {
    accountKeySet: AccountKeySetModel;
    nativeAvailableCoins: CoinModel[];
    nativeFee: number;
    incTokenID: string;
    proofStrs: string[];
    blockHash: string;
    txIndex: number;
}
export declare function createShieldTokenRequestTx({ accountKeySet, nativeAvailableCoins, nativeFee, incTokenID, proofStrs, blockHash, txIndex }: ShieldParam): Promise<import("../../..").TxHistoryModel>;
export {};
//# sourceMappingURL=initPrivacyToken.d.ts.map