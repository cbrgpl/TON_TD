import { LogStoreAccessor } from '../utils/logStoreAccessor';

import { APPROXIMATE_QNT_OF_WALLETS_PER_CHUNK } from '../static';

const ANOMALY_COEF_EDGE_VALUE = 0.15;
const MARGIN_OF_ERROR = APPROXIMATE_QNT_OF_WALLETS_PER_CHUNK * 0.3;

const ANOMALY_VALUE_EDGE = APPROXIMATE_QNT_OF_WALLETS_PER_CHUNK + MARGIN_OF_ERROR;

const MIN_QNT_OF_SIZES_FOR_LOGGING = 10;

export class ChunkSizeStatisticsChecker extends LogStoreAccessor {
  private _chunksSizesBuffer: number[] = [];
  private _mean: number = 0;
  private _anomalyCoef: number = 0;
  private _anomalySizesQnt: number = 0;

  constructor(...args: ConstructorParameters<typeof LogStoreAccessor>) {
    super(...args);
  }

  private _recalcStatistics(chunkSize: number) {
    if (chunkSize >= ANOMALY_VALUE_EDGE) {
      this._anomalySizesQnt++;
    }

    this._chunksSizesBuffer.push(chunkSize);
    this._mean += (chunkSize - this._mean) / this._chunksSizesBuffer.length;
    this._anomalyCoef = this._anomalySizesQnt / this._chunksSizesBuffer.length;
  }

  onChunkFetched(chunkSize: number) {
    this._recalcStatistics(chunkSize);

    if (
      this._chunksSizesBuffer.length >= MIN_QNT_OF_SIZES_FOR_LOGGING &&
      this._anomalyCoef >= ANOMALY_COEF_EDGE_VALUE &&
      chunkSize >= ANOMALY_VALUE_EDGE
    ) {
      const prettyAnomalyCoef = this._anomalyCoef.toFixed(2);

      this._logStore.log({
        type: 'warn',
        content: `При подсчете статистики выявленно, что чанки размером много больше того, на который рассчитана программа, начали встречаться слишком часто.
Коэфицент появления аномальных чанков ${prettyAnomalyCoef}; Это значит, что на каждые 100 чанков есть ${Math.round(+prettyAnomalyCoef * 100)} аномальных.
`,
      });

      console.group('Информация по аномальным размерам чанков:');
      console.warn('_chunksSizesBuffer', this._chunksSizesBuffer);
      console.groupEnd();
    }
  }
}
