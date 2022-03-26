// import { createThumbnails } from './create-thumbnails.js';
import { isEscapeKey } from './util.js';

const commentTemplate = document.querySelector('#comment').content;
const newTemplate = commentTemplate.querySelector('.social__comment');
const containerComments = document.querySelector('.social__comments');
const bigPicture = document.querySelector('.big-picture');
const bigImage = bigPicture.querySelector('img');
const closeButton = document.querySelector('#picture-cancel');
const listComments = document.querySelector('.social__comment-count');
const allCommentsCount = document.querySelector('.comments-count');
const loadedComments = document.querySelector('.load__comments-count');
const commentsLoad = document.querySelector('.comments-loader');
const bodyTag = document.querySelector('body');

const onBigPhotoEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPhoto();
  }
};

function closeBigPhoto () {
  containerComments.innerHTML = '';
  bigPicture.classList.add('hidden');
  listComments.classList.add('hidden');
  commentsLoad.classList.add('hidden');
  bodyTag.classList.remove('modal-open');
  containerComments.innerHTML = '';
  closeButton.removeEventListener('click', closeBigPhoto);
  document.removeEventListener('keydown', onBigPhotoEscKeydown);
}

function openBigPhoto () {
  bigPicture.classList.remove('hidden');
  listComments.classList.remove('hidden');
  commentsLoad.classList.remove('hidden');
  bodyTag.classList.add('modal-open');
  closeButton.addEventListener('click', closeBigPhoto);
  document.addEventListener('keydown', onBigPhotoEscKeydown);
}

const renderBigPhoto = (dataPhoto) => {
  const likesCount = document.querySelector('.likes-count');
  const descriptionPhoto = document.querySelector('.social__caption');
  bigImage.src = dataPhoto.url;
  likesCount.textContent = dataPhoto.likes;
  descriptionPhoto.textContent = dataPhoto.description;
  const { comments } = dataPhoto;
  allCommentsCount.textContent = comments.length;
  let commentsRendered = 0;

  const renderComments = (commentsData) => {
    const fragment = document.createDocumentFragment();
    commentsData.forEach((comment) => {
      const newComment = newTemplate.cloneNode(true);
      const socilComment = newComment.querySelector('.social__picture');
      newComment.querySelector('.social__text').textContent = comment.message;
      socilComment.src = comment.avatar;
      socilComment.alt = comment.name;
      fragment.append(newComment);
      commentsRendered += 1;
      loadedComments.textContent = commentsRendered;
      if (commentsRendered === comments.length) {
        commentsLoad.classList.add('hidden');
      }
    });
    containerComments.append(fragment);
  };
  const loadComments = () => {
    const commentsRender = comments.slice(commentsRendered, commentsRendered + 5);
    renderComments(commentsRender);
  };
  loadComments();
  commentsLoad.addEventListener('click', loadComments);
  closeButton.addEventListener('click', () => commentsLoad.removeEventListener('click', loadComments));
};

// scale preview image

const buttonDecreasePreview = document.querySelector('.scale__control--smaller');
const buttonIncreasePreview = document.querySelector('.scale__control--bigger');
const imageScaleValue = document.querySelector('.scale__control--value');
const imagePreview = document.querySelector('.img-upload__preview img');

let scalePreviewInteger = 1;

function reducePreview() {
  scalePreviewInteger -= 0.25;
  if (scalePreviewInteger === 0.25) {
    buttonDecreasePreview.removeEventListener('click', reducePreview);
  }
  imageScaleValue.value = parseFloat(imageScaleValue.value);
  imageScaleValue.value -= 25;
  imageScaleValue.value += '%';
  imagePreview.style.transform = `scale(${scalePreviewInteger}`;
  buttonIncreasePreview.addEventListener('click', increasePreview);
}

function increasePreview() {
  scalePreviewInteger += 0.25;
  imageScaleValue.value = parseFloat(imageScaleValue.value);
  imageScaleValue.value = parseFloat(imageScaleValue.value, 10) + 25;
  imageScaleValue.value += '%';
  imagePreview.style.transform = `scale(${scalePreviewInteger}`;
  buttonDecreasePreview.addEventListener('click', reducePreview);
  if (scalePreviewInteger === 1) {
    buttonIncreasePreview.removeEventListener('click', increasePreview);
  }
}

buttonDecreasePreview.addEventListener('click', reducePreview);

// slider

const sliderElement = document.querySelector('.img-upload__effect-level');
const slider = document.querySelector('.effect-level__slider');
const effect = document.querySelector('.effect-level__value');
const effectsList = document.querySelector('.effects__list');

sliderElement.classList.add('hidden');

noUiSlider.create(slider, {
  range: {
    min: 0,
    max: 100,
  },
  start: 100,
  step: 1,
  connect: 'lower',
});

let filter;
let units;
slider.noUiSlider.on('update', () => {
  effect.value = slider.noUiSlider.get();
  imagePreview.style.filter = `${filter}(${effect.value}${units})`;
});

effectsList.addEventListener('change', (evt) => {
  if (evt.target.checked) {
    if (evt.target.value === 'none') {
      sliderElement.classList.add('hidden');
      imagePreview.style.filter = '';
    }
    if (evt.target.value !== 'none') {
      sliderElement.classList.remove('hidden');
    }
    imagePreview.removeAttribute('class');
    imagePreview.classList.add(`effects__preview--${evt.target.value}`);
    if (evt.target.value === 'chrome' || evt.target.value === 'sepia') {
      imagePreview.style.filter = '';
      if (evt.target.value === 'chrome') {
        filter = 'grayscale';
      } else { filter = evt.target.value; }
      units = '';
      slider.noUiSlider.updateOptions({
        range: {
          min: 0,
          max: 1,
        },
        start: 1,
        step: 0.1,
      });
    }
    if (evt.target.value === 'marvin') {
      imagePreview.style.filter = '';
      filter = 'invert';
      units = '%';
      slider.noUiSlider.updateOptions({
        range: {
          min: 0,
          max: 100,
        },
        start: 100,
        step: 1,
      });
    }
    if (evt.target.value === 'phobos') {
      imagePreview.style.filter = '';
      filter = 'blur';
      units = 'px';
      slider.noUiSlider.updateOptions({
        range: {
          min: 0,
          max: 3,
        },
        start: 3,
        step: 0.1,
      });
    }
    if (evt.target.value === 'heat') {
      imagePreview.style.filter = '';
      filter = 'brightness';
      units = '';
      slider.noUiSlider.updateOptions({
        range: {
          min: 1,
          max: 3,
        },
        start: 3,
        step: 0.1,
      });
    }
  }
});

export { renderBigPhoto, openBigPhoto, bodyTag };
