import { getPhotosDescription, PHOTOS_COUNT } from './data.js';

const arrayData = getPhotosDescription(PHOTOS_COUNT);
const thumbnailContainer = document.querySelector('.pictures');
const thumbnailListFragment = document.createDocumentFragment();
const thumbnailTemplate = document.querySelector('#picture').content;


arrayData.forEach((dataValue) => {
  const newThumbnail = thumbnailTemplate.querySelector('.picture');
  const imgUrl = newThumbnail.querySelector('.picture__img');
  const likesCount = newThumbnail.querySelector('.picture__likes');
  const commentsCount = newThumbnail.querySelector('.picture__comments');
  imgUrl.src = dataValue.url;
  likesCount.textContent = dataValue.likes;
  commentsCount.textContent = dataValue.comments.length;
  thumbnailListFragment.appendChild(newThumbnail.cloneNode(true));
});

const createThumbnail = () => thumbnailContainer.appendChild(thumbnailListFragment);

export { createThumbnail };
