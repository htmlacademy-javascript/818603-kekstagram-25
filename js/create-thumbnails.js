import { getPhotosDescriptions, PHOTOS_COUNT } from './data.js';
import { renderBigPhoto, openBigPhoto } from './fullsize-photo.js';

const photosData = getPhotosDescriptions(PHOTOS_COUNT);
const thumbnailContainer = document.querySelector('.pictures');
const thumbnailListFragment = document.createDocumentFragment();
const thumbnailTemplate = document.querySelector('#picture').content;
const newTemplate = thumbnailTemplate.querySelector('.picture');

const createThumbnail = (data) => {
  const newThumbnail = newTemplate.cloneNode(true);
  const imgUrl = newThumbnail.querySelector('.picture__img');
  const likesCount = newThumbnail.querySelector('.picture__likes');
  const commentsCount = newThumbnail.querySelector('.picture__comments');
  imgUrl.src = data.url;
  likesCount.textContent = data.likes;
  commentsCount.textContent = data.comments.length;
  newThumbnail.addEventListener('click', () => {
    openBigPhoto();
    renderBigPhoto(data);
  });
  return newThumbnail;
};

const renderThumbnails = () => {
  const thumbnails = photosData.map(createThumbnail);
  thumbnailListFragment.append(...thumbnails);
  return thumbnailContainer.append(thumbnailListFragment);
};

export { renderThumbnails };

