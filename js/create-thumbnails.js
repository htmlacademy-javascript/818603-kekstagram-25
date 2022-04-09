
import { renderBigPhoto, openBigPhoto } from './fullsize-photo.js';
import { closeUpload, closeSuccessOrErrorPopup, onSuccessErrorEscKeydown } from './form.js';
import { bodyTag } from './fullsize-photo.js';
import  { debounce, shuffleArray } from './util.js';

const RERENDER_DELAY = 500;
const RANDOM_THUMBNAILS = 10;
const thumbnailContainer = document.querySelector('.pictures');
const thumbnailListFragment = document.createDocumentFragment();
const thumbnailTemplate = document.querySelector('#picture').content;
const newTemplate = thumbnailTemplate.querySelector('.picture');
const filterThumbnailsMenu = document.querySelector('.img-filters');
const filterThumbnails = document.querySelector('.img-filters__form');
const filterButtonDefault = filterThumbnails.querySelector('#filter-default');
const filterRandomButton = filterThumbnails.querySelector('#filter-random');
const filterButtonDiscussed = filterThumbnails.querySelector('#filter-discussed');

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

const clearThumbnailsContainer = () => {
  const elements = thumbnailContainer.querySelectorAll('.picture');
  [...elements].forEach((item) => item.remove());
};

const renderThumbnails = (photosData) => {
  clearThumbnailsContainer();
  const thumbnails = photosData.map(createThumbnail);
  thumbnailListFragment.append(...thumbnails);
  thumbnailContainer.append(thumbnailListFragment);
};

const showFilteredThumbnails = (data) => {
  filterThumbnailsMenu.classList.remove('img-filters--inactive');
  filterThumbnailsMenu.addEventListener('click', debounce((evt) => {
    if (evt.target === filterButtonDefault && !evt.target.classList.contains('img-filters__button--active')) {
      if (filterRandomButton.classList.contains('img-filters__button--active')) {
        filterRandomButton.classList.remove('img-filters__button--active');
      }
      if (filterButtonDiscussed.classList.contains('img-filters__button--active')) {
        filterButtonDiscussed.classList.remove('img-filters__button--active');
      }
      filterButtonDefault.classList.add('img-filters__button--active');
      renderThumbnails(data);
    }
    if (evt.target === filterRandomButton && !evt.target.classList.contains('img-filters__button--active')) {
      if (filterButtonDefault.classList.contains('img-filters__button--active')) {
        filterButtonDefault.classList.remove('img-filters__button--active');
      }
      if (filterButtonDiscussed.classList.contains('img-filters__button--active')) {
        filterButtonDiscussed.classList.remove('img-filters__button--active');
      }
      filterRandomButton.classList.add('img-filters__button--active');
      const random = shuffleArray([...data]).slice(0, RANDOM_THUMBNAILS);
      renderThumbnails(random);
    }
    if (evt.target === filterButtonDiscussed && !evt.target.classList.contains('img-filters__button--active')) {
      if (filterButtonDefault.classList.contains('img-filters__button--active')) {
        filterButtonDefault.classList.remove('img-filters__button--active');
      }
      if (filterRandomButton.classList.contains('img-filters__button--active')) {
        filterRandomButton.classList.remove('img-filters__button--active');
      }
      filterButtonDiscussed.classList.add('img-filters__button--active');
      const discussedData = data.slice().sort((a, b) => b.comments.length - a.comments.length);
      renderThumbnails(discussedData);
    }
  }, RERENDER_DELAY));
};

export { renderThumbnails, onErrorLoad, showFilteredThumbnails };


