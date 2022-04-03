
import { renderBigPhoto, openBigPhoto } from './fullsize-photo.js';
import { closeUpload, closeSuccessOrErrorPopup, onSuccessErrorEscKeydown } from './form.js';
import { bodyTag } from './fullsize-photo.js';

const thumbnailContainer = document.querySelector('.pictures');
const thumbnailListFragment = document.createDocumentFragment();
const thumbnailTemplate = document.querySelector('#picture').content;
const newTemplate = thumbnailTemplate.querySelector('.picture');

const createThumbnail = (data) => {
  const newThumbnail = newTemplate.cloneNode(true);
  const imgUrl = newThumbnail.querySelector('.picture__img');
  const likesCount = newThumbnail.querySelector('.picture__likes');
  const pictureComments = newThumbnail.querySelector('.picture__comments');
  pictureComments.textContent = data.comments.length;
  imgUrl.src = data.url;
  likesCount.textContent = data.likes;

  newThumbnail.addEventListener('click', () => {
    openBigPhoto();
    renderBigPhoto(data);
  });
  return newThumbnail;
};

function onErrorLoad() {
  closeUpload();
  const errorPopup = document.querySelector('#error').content.cloneNode(true);
  errorPopup.querySelector('.error__title').textContent = 'ошибка загрузки';
  errorPopup.querySelector('.error__button').textContent = 'закрыть';
  bodyTag.append(errorPopup);
  document.addEventListener('click', closeSuccessOrErrorPopup);
  document.addEventListener('keydown', onSuccessErrorEscKeydown);
}

const renderThumbnails = (photosData) => {
  const thumbnails = photosData.map(createThumbnail);
  thumbnailListFragment.append(...thumbnails);
  thumbnailContainer.append(thumbnailListFragment);
};

export { renderThumbnails, onErrorLoad };


