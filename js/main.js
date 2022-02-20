const getRandomInt = function (first, second) {
  const min = (first < second) ? Math.ceil(first) : Math.floor(second);
  const max = (first > second) ? Math.ceil(first) : Math.floor(second);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

getRandomInt(1, 4);

function verifyMaxLength (string, maxLength) {
  return string.length > maxLength;
}

verifyMaxLength('hello Kitty', 4);

