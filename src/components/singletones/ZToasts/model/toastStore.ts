import { defineStore } from 'pinia';
import { generateId } from '@libs/generate';

type UToastTypes = 'message';

type IToastIn = {
  title: string;
  message?: string;
  life?: number;
};

type IToastInternalContainer = IToastIn & {
  type: UToastTypes;
  life: number;
};

export type IToast = IToastInternalContainer & {
  id: number;
};

export const useToastStore = defineStore('toastStore', {
  state: () => ({
    toasts: [] as IToast[],
  }),
  actions: {
    _addToast(toast: IToastInternalContainer) {
      this.toasts.push({
        ...toast,
        id: generateId(),
      });
    },
    show(): Record<UToastTypes, (toastIn: IToastIn) => void> {
      return {
        message: (toastIn) => {
          this._addToast({
            life: 5000,
            ...toastIn,
            type: 'message',
          });
        },
      };
    },
    removeToast(toastId: number) {
      const toastInx = this.toasts.findIndex((toast) => toast.id === toastId);
      if (typeof toastInx === 'number') {
        this.toasts.splice(toastInx, 1);
      }
    },
  },
});
