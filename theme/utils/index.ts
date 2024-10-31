export function throttleAndDebounce<T extends any[]>(fn: (...args: T) => void, delay: number): (...args: T) => void {
  let timeoutId: NodeJS.Timeout;
  let called = false;

  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!called) {
      fn(...args);
      called = true;
      setTimeout(() => {
        called = false;
      }, delay);
    } else {
      timeoutId = setTimeout(() => fn(...args), delay);
    }
  };
}
