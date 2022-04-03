const getRandomInt = function (first, second) {
  const min = (first < second) ? Math.ceil(first) : Math.floor(second);
  const max = (first > second) ? Math.ceil(first) : Math.floor(second);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const debounce = (callback, timeoutDelay) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

const isEscapeKey = (evt) => evt.key === 'Escape';

export { isEscapeKey, getRandomInt, debounce };
