import { getPhotosDescription, PHOTOS_COUNT } from './data.js';

const arrayData = getPhotosDescription(PHOTOS_COUNT);
const thumbnailContainer = document.querySelector('.pictures');
const thumbnailListFragment = document.createDocumentFragment();
const thumbnailTemplate = document.querySelector('#picture').content;
const newTemplate = thumbnailTemplate.querySelector('.picture');

arrayData.forEach((dataValue) => {
  const newThumbnail = newTemplate.cloneNode(true);
  const imgUrl = newThumbnail.querySelector('.picture__img');
  const likesCount = newThumbnail.querySelector('.picture__likes');
  const commentsCount = newThumbnail.querySelector('.picture__comments');
  imgUrl.src = dataValue.url;
  likesCount.textContent = dataValue.likes;
  commentsCount.textContent = dataValue.comments.length;
  thumbnailListFragment.appendChild(newThumbnail);
});

const createThumbnail = () => thumbnailContainer.appendChild(thumbnailListFragment);

export { createThumbnail };
