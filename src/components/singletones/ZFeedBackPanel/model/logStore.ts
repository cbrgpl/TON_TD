import { defineStore } from 'pinia';
import { generateId } from '@libs/generate';

export type ULogTypes = 'message' | 'warn' | 'error';

type ILoggerPanelLogBase = {
  content: string;
};

export type ILoggerPanelLogIn = {
  type: ULogTypes;
  fixed?: boolean;
} & ILoggerPanelLogBase;

export type ILoggerPanelLogPatch = ILoggerPanelLogBase;

export type ILoggerPanelLog = {
  id: number;
} & ILoggerPanelLogIn;

export const useLogStore = defineStore('logStore', {
  state: () => ({
    logs: [] as ILoggerPanelLog[],
  }),
  actions: {
    log(logIn: ILoggerPanelLogIn) {
      const log: ILoggerPanelLog = {
        ...logIn,
        id: generateId(),
      };

      this.logs.unshift(log);

      return log.id;
    },
    updateLog(id: number, logPatch: ILoggerPanelLogPatch) {
      const log = this.logs.find((log) => log.id === id);

      if (log) {
        for (const prop of Object.keys(logPatch) as Array<keyof ILoggerPanelLogPatch>) {
          log[prop] = logPatch[prop];
        }
      }
    },
    removeLog(logIds: number[]) {
      for (let i = 0; i < logIds.length; ++i) {
        const logInx = this.logs.findIndex((log) => log.id === logIds[i]);

        if (logInx !== -1) {
          this.logs.splice(logInx, 1);
        }
      }
    },
    clearLogs() {
      this.logs = [];
    },
  },
});

export type ILogStore = ReturnType<typeof useLogStore>;
