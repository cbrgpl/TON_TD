import { defineStore } from 'pinia';

type ITransfersStatistics = {
  successful: number;
  failed: number;
  total: number;
};

type IStatisticsContainer = {
  successful?: number;
  failed?: number;
};

const createTransfersStatistics = (): ITransfersStatistics => ({ successful: 0, failed: 0, total: 0 });

export const useTransfersStatisticsStore = defineStore('transfersStatistics', {
  state: () => ({
    transfersStatistics: createTransfersStatistics(),
  }),
  actions: {
    updateStatistics(container: IStatisticsContainer) {
      const valueOrZero = (value?: number) => (typeof value === 'number' ? value : 0);

      this.transfersStatistics.total += valueOrZero(container.successful);
      this.transfersStatistics.successful += valueOrZero(container.successful);
      this.transfersStatistics.total += valueOrZero(container.failed);
      this.transfersStatistics.failed += valueOrZero(container.failed);
    },
    clearStatistics() {
      this.transfersStatistics = createTransfersStatistics();
    },
  },
});

export type ITransfersStatisticsStore = ReturnType<typeof useTransfersStatisticsStore>;
