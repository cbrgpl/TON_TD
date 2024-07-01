import { ref, readonly } from 'vue';

import { TonClient, type OpenedContract, internal } from '@ton/ton';
import { mnemonicToWalletKey } from '@ton/crypto';

import { HighloadWalletContractV2 } from 'ton-highload-wallet-contract';

import { LogStoreAccessor } from '../utils/logStoreAccessor';
import type { ILogStore, ITransfersStatisticsStore } from '@components/singletones/ZFeedBackPanel';
import { sleep } from '@libs/utils/sleep';

const TON_CENTER_TOKEN = '3467c4913be792fb4c721ec896a20238b55ac3da074140d57bc59b5d15fbef96';

const client = new TonClient({
  endpoint: 'https://toncenter.com/api/v2/jsonRPC',
  apiKey: TON_CENTER_TOKEN,
});

const TIME_PER_DISTRIBUTION = 700;
const MAX_TRANSFERS_PER_EXT_MESSAGE = 254;
const MIN_WALLETS_QNT_FOR_DISTRIBUTION = 220;

type IChunkContainer = {
  chunk: string[];
  resolve: null | ((v: boolean | number) => void);
};

class Distributor extends LogStoreAccessor {
  private _mnemonic: string;
  private _keyPair: Awaited<ReturnType<typeof mnemonicToWalletKey>>;

  private _wallet: OpenedContract<HighloadWalletContractV2>;
  private _transfersStatiscticsStore: ITransfersStatisticsStore;

  message: string | null = null;

  private _destructed: boolean = false;
  private _balance = ref<bigint>(0n);
  private _balanceUpdateTimeout: ReturnType<typeof setTimeout>;
  private _distributionInProcess = false;
  private _chunksQueue: IChunkContainer[] = [];

  constructor(
    mnemonic: string,
    keyPair: Awaited<ReturnType<typeof mnemonicToWalletKey>>,
    transfersStatiscticsStore: ITransfersStatisticsStore,
    ...args: ConstructorParameters<typeof LogStoreAccessor>
  ) {
    super(...args);
    this._mnemonic = mnemonic;
    this._wallet = client.open(HighloadWalletContractV2.create({ publicKey: keyPair.publicKey, workchain: 0 }));
    this._keyPair = keyPair;
    this._transfersStatiscticsStore = transfersStatiscticsStore;
    this._updateBalance();
  }

  get address() {
    return this._wallet.address.toString();
  }

  get mnemonic() {
    return this._mnemonic;
  }

  get balance() {
    return readonly(this._balance);
  }

  private async _updateBalance(time: number = 5000) {
    this._balance.value = await this._wallet.getBalance();

    if (this._destructed) {
      return;
    }

    this._balanceUpdateTimeout = setTimeout(() => this._updateBalance(), time);
  }

  private async _sendZeroTransactions(destinations: string[], message: string) {
    try {
      const beforeDistribution = Date.now();

      const messages = destinations.map((address) =>
        internal({
          to: address,
          body: message,
          value: '0.000000001',
          bounce: true,
        }),
      );

      const result = await this._wallet.sendTransfer({
        secretKey: this._keyPair.secretKey,
        messages: messages,
      });

      const afterDistribution = Date.now();

      const distributionDuration = afterDistribution - beforeDistribution;
      if (distributionDuration <= TIME_PER_DISTRIBUTION) {
        await sleep(TIME_PER_DISTRIBUTION - distributionDuration);
      }

      this._transfersStatiscticsStore.updateStatistics({
        successful: destinations.length,
      });

      return result;
    } catch (err) {
      this._transfersStatiscticsStore.updateStatistics({
        failed: destinations.length,
      });

      if ((err as any).response.status === 500) {
        return 500;
      }

      throw err;
    }
  }

  private async _reallyDistribute() {
    if (this._distributionInProcess) {
      return;
    }

    const chunk = this._chunksQueue.shift();

    if (!chunk) {
      return;
    }

    this._distributionInProcess = true;

    if (!this.message) {
      return;
    }

    do {
      let walletsForIteration = chunk.chunk.splice(0, MAX_TRANSFERS_PER_EXT_MESSAGE);

      if (walletsForIteration.length < MIN_WALLETS_QNT_FOR_DISTRIBUTION) {
        if (this._chunksQueue.length) {
          this._chunksQueue[0].chunk.push(...walletsForIteration);
          break;
        }
      }

      const result = await this._sendZeroTransactions(walletsForIteration, this.message);

      if (result === 500) {
        this._logStore.log({
          type: 'warn',
          content: 'Кажется на кошельке закончились деньги, рассылка остановлена',
        });

        chunk.resolve?.(500);
        this._distributionInProcess = false;
        return;
      }
    } while (chunk.chunk.length !== 0);

    this._distributionInProcess = false;
    chunk.resolve!(true);
    this._reallyDistribute();
  }

  async distribute(distributedChunk: string[]) {
    if (!this.message) {
      this._logStore.log({
        content: 'Отсутствует сообщение для рассылки',
        type: 'error',
      });

      return new Promise((resolve) => {
        resolve(false);
      });
    }

    const chunkContainer: IChunkContainer = {
      chunk: distributedChunk,
      resolve: null,
    };

    const promise = new Promise((resolve) => {
      chunkContainer.resolve = resolve;
    });

    this._chunksQueue.push(chunkContainer);

    if (!this._distributionInProcess) {
      this._reallyDistribute();
    }

    return promise;
  }

  desctruct() {
    clearTimeout(this._balanceUpdateTimeout);
    this._destructed = true;
    return this._chunksQueue;
  }
}

export const createDistributor = async (
  mnemonic: string,
  transfersStatiscticsStore: ITransfersStatisticsStore,
  logStore: ILogStore,
) => {
  const keyPair = await mnemonicToWalletKey(mnemonic.split(' '));
  return new Distributor(mnemonic, keyPair, transfersStatiscticsStore, logStore);
};
