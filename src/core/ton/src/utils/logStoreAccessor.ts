import { type ILogStore } from '@/components/singletones/ZFeedBackPanel';

export abstract class LogStoreAccessor {
  protected _logStore: ILogStore;

  constructor(logStore: ILogStore) {
    this._logStore = logStore;
  }
}
