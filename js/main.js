const getRandomInt = function (first, second) {
  const min = (first < second) ? Math.ceil(first) : Math.floor(second);
  const max = (first > second) ? Math.ceil(first) : Math.floor(second);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function verifyMaxLength (string, maxLength) {
  return string.length > maxLength;
}

const createPhotoDescriptions = function () {

}

const  publicPhotos = Array.from({length: 25}, createPhotoDescriptions);
const commentMessage = [
  'Всё отлично!',

  'В целом всё неплохо. Но не всё.',

  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',

  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',

  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',

  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
const authorNames = ['Alex', 'Sergey', 'Max', 'Dima', 'Anna', 'Inna']

const photo = {
  id: getRandomInt(1, 25),
  url: photos/getRandomInt(1, 25).jpg,
  description: 'my photo',
  likes: getRandomInt(15, 200),
  comments: [
    {
      id: getRandomInt(0, 100),
      avatar: `img/avatar-${getRandomInt(1, 6)}.svg`,
      message: getRandomInt(0, commentMessage.length),
      name: getRandomInt(0, authorNames.length),
    }
  ]
}

console.log(publicPhotos);
