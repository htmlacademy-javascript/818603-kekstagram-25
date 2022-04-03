
import { renderBigPhoto, openBigPhoto } from './fullsize-photo.js';
import { closeUpload, closeSuccessOrErrorPopup, onSuccessErrorEscKeydown } from './form.js';
import { bodyTag } from './fullsize-photo.js';
import  { getRandomInt, debounce } from './util.js';

const RERENDER_DELAY = 500;
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

const filterThumbnailsMenu = document.querySelector('.img-filters');
const filterThumbnails = document.querySelector('.img-filters__form');
const filterButtonDefault = filterThumbnails.querySelector('#filter-default');
const filterRandomButton = filterThumbnails.querySelector('#filter-random');
const filterButtonDiscussed = filterThumbnails.querySelector('#filter-discussed');

const renderThumbnails = debounce ((photosData) => {
  const thumbnails = photosData.map(createThumbnail);
  thumbnailListFragment.append(...thumbnails);
  thumbnailContainer.append(thumbnailListFragment);
}, RERENDER_DELAY);

const showThumbnails = (data) => {
  const elements = thumbnailContainer.getElementsByTagName('a');
  [...elements].forEach((item) => item.remove());
  filterRandomButton.classList.remove('img-filters__button--active');
  filterButtonDiscussed.classList.remove('img-filters__button--active');
  filterButtonDefault.classList.add('img-filters__button--active');
  renderThumbnails(data);
};

const showRandomThumbnails = (data) => {
  const elements = thumbnailContainer.getElementsByTagName('a');
  [...elements].forEach((item) => item.remove());
  const random = [];
  while (random.length < 10) {
    const item = data[getRandomInt(0, data.length - 1)];
    if (random.includes(item)) { continue; }
    random.push(item);
  }
  filterButtonDefault.classList.remove('img-filters__button--active');
  filterButtonDiscussed.classList.remove('img-filters__button--active');
  filterRandomButton.classList.add('img-filters__button--active');
  renderThumbnails(random);
};

const showDiscussedThumbnails = (data) => {
  const elements = thumbnailContainer.getElementsByTagName('a');
  [...elements].forEach((item) => item.remove());
  filterButtonDefault.classList.remove('img-filters__button--active');
  filterRandomButton.classList.remove('img-filters__button--active');
  filterButtonDiscussed.classList.add('img-filters__button--active');
  renderThumbnails(data.slice().sort((a, b) => b.comments.length - a.comments.length));
};

const showFilteredThumbnails = (data) => {
  filterThumbnailsMenu.classList.remove('img-filters--inactive');
  filterThumbnailsMenu.addEventListener('click', (evt) => {
    if (evt.target === filterRandomButton && !evt.target.classList.contains('img-filters__button--active')) {
      showRandomThumbnails(data);
    }
    if (evt.target === filterButtonDiscussed && !evt.target.classList.contains('img-filters__button--active')) {
      showDiscussedThumbnails(data);
    }
    if (evt.target === filterButtonDefault && !evt.target.classList.contains('img-filters__button--active')) {
      showThumbnails(data);
    }
  });
};

export { renderThumbnails, onErrorLoad, showFilteredThumbnails };


