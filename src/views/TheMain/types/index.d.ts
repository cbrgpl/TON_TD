export type UDistributionMethods = 'Store' | 'Parsing' | 'StoreAndParsing';

export type IDistributionBtnProps = {
  distributionMethod: UDistributionMethods | null;
  onAbortingClasses: string;
};
export type IDistributionBtnEmits = {
  'update:distributionMethod': [method: UDistributionMethods | null];
  'setStartingDistributionFn': [fn: () => void];
};
export type IDistributionBtnExposes = Record<string, never>;

export type IChunkContainer = {
  id: number | null;
  chunk: string[] | null;
  loadedPromise: Promise<unknown>;
};
