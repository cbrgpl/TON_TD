import type { IChunkContainer } from '../types';

const PREFIX = 'Chunk Dubugging';

export const logWhileDebugging = (message: any[], chunk?: IChunkContainer) => {
  if (import.meta.env.MODE === 'production') {
    return;
  }

  if (chunk) {
    console.log(`[${PREFIX} ${chunk.id}]:`, ...message);
  } else {
    console.log(`[${PREFIX}]:`, ...message);
  }
};
