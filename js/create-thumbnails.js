import { getPhotosDescriptions, PHOTOS_COUNT } from './data.js';
import { renderBigPhoto, openBigPhoto } from './fullsize-photo';

const photosData = getPhotosDescriptions(PHOTOS_COUNT);
const thumbnailContainer = document.querySelector('.pictures');
const thumbnailListFragment = document.createDocumentFragment();
const thumbnailTemplate = document.querySelector('#picture').content;
const newTemplate = thumbnailTemplate.querySelector('.picture');

const createThumbnails = (data) => {
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

const thumbnails = photosData.map((data) => createThumbnails(data));

thumbnailListFragment.appendChild(...thumbnails);
thumbnailContainer.appendChild(thumbnailListFragment);

export { createThumbnails };

