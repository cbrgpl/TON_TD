import { type ILogStore } from '@components/singletones/ZFeedBackPanel';
// eslint-disable-next-line import-x/namespace
import { merge } from 'ts-deepmerge';

import { TON_CENTER_API_URl, TON_CENTER_TOKEN } from '@/static';

export const fetchWrapper = (logStore: ILogStore | null, ...args: Parameters<typeof fetch>) => {
  try {
    const requestInit = merge(args[1] ?? {}, {
      headers: {
        'X-API-Key': `${TON_CENTER_TOKEN}`,
      },
    });

    return fetch(`${TON_CENTER_API_URl}` + args[0], requestInit);
  } catch (err) {
    if (logStore) {
      logStore.log({
        type: 'error',
        content: `При запросе по "${args[0]}" произошла ошибка;
Сообщение ошибки: ${(err as Error)?.message ?? null};
Более детальная информация в консоли разработчика;`,
      });
    }

    console.group('Ошибка при запросе по АПИ');
    // eslint-disable-next-line no-console
    console.error(err);
    console.groupEnd();

    throw err;
  }
};
