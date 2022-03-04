const getRandomInt = function (first, second) {
  const min = (first < second) ? Math.ceil(first) : Math.floor(second);
  const max = (first > second) ? Math.ceil(first) : Math.floor(second);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/*
function verifyMaxLength (string, maxLength) {
  return string.length > maxLength;
}
verifyMaxLength('qwerty', 10);
*/
let integer = 0; //счетчик для инкремента

const getRandomArrayElement = function (elements) {
  return elements[getRandomInt(0, elements.length - 1)];
};

const PHOTO_DESCRIPTIONS_COUNT = 25;
const COMMENT_MESSAGE = [
  'Всё отлично!',

  'В целом всё неплохо. Но не всё.',

  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',

  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',

  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',

  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
const AUTHOR_NAMES = ['Alex', 'Sergey', 'Max', 'Dima', 'Anna', 'Inna'];

const createPhotoDescriptions = () => ({
  descriptionId: ++integer,
  url: `photos/${integer}.jpg`,
  description: `my photo ${integer}`,
  likes: getRandomInt(15, 200),
  comments: {
    commentsId: integer,
    avatar: `img/avatar-${getRandomInt(1, 6)}.svg`,
    message: getRandomArrayElement(COMMENT_MESSAGE),
    name: getRandomArrayElement(AUTHOR_NAMES),
  }
});

Array.from({length: PHOTO_DESCRIPTIONS_COUNT}, createPhotoDescriptions);

