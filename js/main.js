const MIN_AVATAR_COUNT = 1;
const MAX_AVATAR_COUNT = 6;
const MIN_LIKES_COUNT = 15;
const MAX_LIKES_COUNT = 200;
const PHOTOS_COUNT = 25;
const COMMENT_MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
const DESCRIPTIONS = [
  'Я и моя ладная кошка',
  'Закат',
  'Как будто держу солнце на ладошке',
  'Вместе уже целых 45 минут',
  'Да!',
  'Мама, я фотограф!',
  'С пацанами',
];
const AUTHOR_NAMES = ['Alex', 'Sergey', 'Max', 'Dima', 'Anna', 'Inna'];

const getRandomInt = function (first, second) {
  const min = (first < second) ? Math.ceil(first) : Math.floor(second);
  const max = (first > second) ? Math.ceil(first) : Math.floor(second);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getAvatarUrl = () => {
  const avatarId = getRandomInt(MIN_AVATAR_COUNT, MAX_AVATAR_COUNT);
  return `img/avatar-${avatarId}.jpg`;
};

const getRandomArrayElement = (elements) => elements[getRandomInt(0, elements.length - 1)];

const getCommentData = (id) => ({
  id,
  avatar: getAvatarUrl(),
  message: getRandomArrayElement(COMMENT_MESSAGES),
  name: getRandomArrayElement(AUTHOR_NAMES),
});

const getCommentsData = () => Array.from({ length: 2 }, (v, k) => getCommentData(k + 1));

const getPhotoDescription = (id) => ({
  id,
  url: `photos/${id}.jpg`,
  description: getRandomArrayElement(DESCRIPTIONS),
  likes: getRandomInt(MIN_LIKES_COUNT, MAX_LIKES_COUNT),
  comments: getCommentsData()
});

const getPhotosDescription = (count) => Array.from({ length: count }, (v, k) => getPhotoDescription(k + 1));

getPhotosDescription(PHOTOS_COUNT);