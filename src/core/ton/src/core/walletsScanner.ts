// eslint-disable-next-line import-x/namespace
import { merge } from 'ts-deepmerge';

import { fetchWrapper } from '@libs/http';
import { createOrc, OPERATION_STATUS } from '@libs/orc';

import { LogStoreAccessor } from '../utils/logStoreAccessor';
import { APPROXIMATE_QNT_OF_WALLETS_PER_CHUNK } from '../static';

type ITransaction = {
  in_msg: {
    source: string | null;
    destination: string | null;
  } | null;
  out_msgs: Array<{
    source: string | null;
    destination: string | null;
  }>;
};

type IWalletsScannerParams = {
  transactionsLimitPerRequest: number;
};

type IWalletsScannerParamsIn = Omit<IWalletsScannerParams, 'transactionsLimitPerRequest'>;

const DEFAULT_PARAMS: IWalletsScannerParams = {
  transactionsLimitPerRequest: 256,
};

export class WalletsScanner extends LogStoreAccessor {
  private _params: IWalletsScannerParams;
  offset: number = 0;

  constructor(params: IWalletsScannerParamsIn | null, ...args: ConstructorParameters<typeof LogStoreAccessor>) {
    super(...args);

    this._params = merge(params ?? {}, DEFAULT_PARAMS);
  }

  private async _fetchTransactions(offset: number) {
    const response = await fetchWrapper(
      this._logStore,
      `/api/v3/transactions?workchain=0&limit=${this._params.transactionsLimitPerRequest}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const body = await response.json();

    if (response.status !== 200) {
      this._logStore.log({
        type: 'error',
        content: `При попытке получения списка транзакций был получен неожиданный статус "${response.status}\nЭто означает, что произошло слишком много запросов к toncenter.com"`,
      });

      return createOrc({
        status: OPERATION_STATUS.ERROR,
      });
    }

    return createOrc({
      status: OPERATION_STATUS.SUCCESS,
      data: (body as { transactions: ITransaction[] }).transactions,
    });
  }

  private _createWalletsSet(transactions: ITransaction[]): Set<string> {
    const wallets = new Set<string>();

    const addDestinationAndSourceToSet = (data: { destination: string | null; source: string | null }) => {
      if (data.destination) {
        wallets.add(data.destination);
      }

      if (data.source) {
        wallets.add(data.source);
      }
    };

    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];

      if (transaction.in_msg) {
        addDestinationAndSourceToSet(transaction.in_msg);
      }

      for (let j = 0; j < transaction.out_msgs.length; ++j) {
        addDestinationAndSourceToSet(transaction.out_msgs[j]);
      }
    }

    return wallets;
  }

  async scan() {
    try {
      const iterationsCount = Math.floor(
        APPROXIMATE_QNT_OF_WALLETS_PER_CHUNK / this._params.transactionsLimitPerRequest,
      );

      const chunk = new Set<string>();

      let i = 0;
      const promises: ReturnType<InstanceType<typeof WalletsScanner>['_fetchTransactions']>[] = [];
      while (i++ < iterationsCount) {
        const offset = this.offset++;
        promises.push(this._fetchTransactions(offset));
      }

      const transactions = (await Promise.allSettled(promises)).map((result) =>
        result.status === 'fulfilled' ? result.value : null,
      );

      transactions.forEach((transactionsContainer) => {
        if (transactionsContainer?.status === OPERATION_STATUS.SUCCESS) {
          const parsedWallets = this._createWalletsSet(transactionsContainer.data);
          parsedWallets.forEach((wallet) => {
            chunk.add(wallet);
          });
        }
      });

      return [...chunk];
    } catch (err) {
      this._logStore.log({
        type: 'error',
        content: `При загрузке чанка произошла ошибка:
<strong>${(err as Error)?.message ?? err}</strong>`,
      });
      return [];
    }
  }
}
