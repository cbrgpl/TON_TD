export const generateNumber = (min: number = 1, max: number = 99): number => {
  return Math.round(Math.random() * (max - min) + min);
};

export const generateId = (() => {
  let id = 0;

  return <T extends '0' | 0 = 0, R = T extends 0 ? number : string>(type: T = 0 as T): R => {
    const newId = id++;

    if (type === '0') {
      return newId.toString() as R;
    } else {
      return newId as R;
    }
  };
})();
