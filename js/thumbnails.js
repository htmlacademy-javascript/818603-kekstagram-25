import { getPhotosDescription, PHOTOS_COUNT } from './data.js';

const arrayData = getPhotosDescription(PHOTOS_COUNT);
const thumbnailContainer = document.querySelector('.pictures');
const thumbnailListFragment = document.createDocumentFragment();
const thumbnailTemplate = document.querySelector('#picture').content;
const newThumbnail = thumbnailTemplate.querySelector('.picture');

arrayData.forEach((dataValue) => {
  const clonedThumbnail = newThumbnail.cloneNode(true);
  const imgUrl = clonedThumbnail.querySelector('.picture__img');
  const likesCount = clonedThumbnail.querySelector('.picture__likes');
  const commentsCount = clonedThumbnail.querySelector('.picture__comments');
  imgUrl.src = dataValue.url;
  likesCount.textContent = dataValue.likes;
  commentsCount.textContent = dataValue.comments.length;
  thumbnailListFragment.appendChild(clonedThumbnail);
});

thumbnailContainer.appendChild(thumbnailListFragment);

export { thumbnailContainer };
