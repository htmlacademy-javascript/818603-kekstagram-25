import { bodyTag } from './fullsize-photo.js';
import { isEscapeKey } from './util.js';

const MAXLENGTH_HASHTAGS_SYMBOLS = 20;
const MINLENGTH_HASHTAGS_SYMBOLS = 2;
const HASGTAGS_COUNTS = 5;
const form = document.querySelector('.img-upload__form');
const submitButton = form.querySelector('.img-upload__submit');
const openForm = document.querySelector('#upload-file');
const description = document.querySelector('.text__description');
const editPhoto = document.querySelector('.img-upload__overlay');
const preview = document.querySelector('.img-upload__preview').querySelector('img');
const hashtag = document.querySelector('.text__hashtags');
const imagePreview = document.querySelector('.img-upload__preview img');
// const closeSuccess = document.querySelector('.success__button');
const re = /^#[A-Za-zA-Яа-яËё0-9]{1,19}$/;

function onSuccessEscKeydown(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    offSuccess();
  }
}

function offSuccess() {
  bodyTag.lastElementChild.remove();
  document.removeEventListener('keydown', onSuccessEscKeydown);
}

const removePopup = (evt) => {
  const successPopup = bodyTag.lastElementChild.querySelector('div');
  const button = bodyTag.lastElementChild.querySelector('button');
  if(!successPopup.contains(evt.target) || button.contains(evt.target)) {
    bodyTag.lastElementChild.remove();
    document.removeEventListener('click', removePopup);
  }
};

function onSuccess() {
  closeUpload();
  const successPopupTemplate = document.querySelector('#success').content.cloneNode(true);
  bodyTag.append(successPopupTemplate);
  document.addEventListener('click', removePopup);
  document.addEventListener('keydown', onSuccessEscKeydown);
}

function onError() {
  closeUpload();
  const errorPopUp = document.querySelector('#error').content.cloneNode(true);
  bodyTag.append(errorPopUp);
  document.addEventListener('click', removePopup);
  document.addEventListener('keydown', onSuccessEscKeydown);
}

//validate form

const checkLength = (value, maxLength) => value.length <= maxLength;

const getTags = (string) => string.split(' ').filter((item) => item !== '');

const checkMinLength = (string) => getTags(string).every((item) => item.length >= MINLENGTH_HASHTAGS_SYMBOLS);

const checkMaxLength = (string) => getTags(string).every((item) => checkLength(item, MAXLENGTH_HASHTAGS_SYMBOLS));

const checkHashtag = (string) => getTags(string).every((item) => item[0] === '#');

const checkSymbols = (string) => getTags(string).every((item) => item.length <= 1 || re.test(item));

const checkUniq = (string) => {
  const hashtags = getTags(string);
  return hashtags.length === new Set(hashtags).size;
};

const checkCount = (string) => {
  const hashtags = getTags(string);
  return hashtags.length <= HASGTAGS_COUNTS || !hashtags.length > HASGTAGS_COUNTS;
};

const validateForm = () => {
  const pristine = new Pristine(form, {
    classTo: 'img-upload__form',
    errorTextParent: 'text__hashtags-container'
  });

  pristine.addValidator(hashtag, checkCount, 'max 5 hashtags');
  pristine.addValidator(hashtag, checkHashtag, 'begin with #');
  pristine.addValidator(hashtag, checkMinLength, 'hashtag min length 2 symbols');
  pristine.addValidator(hashtag, checkMaxLength, 'hashtag max length 20 symbols');
  pristine.addValidator(hashtag, checkSymbols, 'wrong symbol');
  pristine.addValidator(hashtag, checkUniq, 'this hashtag already exist');

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const valid = pristine.validate();
    if (valid) {
      const formData = new FormData(evt.target);
      submitButton.disabled = true;
      fetch(
        'https://25.javascript.pages.academy/kekstagram',
        {
          method: 'POST',
          body: formData,
        },
      )
        .then((responce) => {
          if (responce.ok) {
            onSuccess();
            submitButton.disabled = false;
          } else {
            onError();
          }
        })
        .catch(() => {
          onError();
          submitButton.disabled = false;
        });
    }
  });
};

// end validate form

// scale preview image

const buttonDecreasePreview = document.querySelector('.scale__control--smaller');
const buttonIncreasePreview = document.querySelector('.scale__control--bigger');
const imageScaleValue = document.querySelector('.scale__control--value');

let scalePreviewInteger = 1;

function reducePreview() {
  scalePreviewInteger -= 0.25;
  if (scalePreviewInteger === 0.25) {
    buttonDecreasePreview.removeEventListener('click', reducePreview);
  }
  imageScaleValue.value = parseFloat(imageScaleValue.value);
  imageScaleValue.value -= 25;
  imageScaleValue.value += '%';
  imagePreview.style.transform = `scale(${scalePreviewInteger})`;
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

// slider

const sliderElement = document.querySelector('.img-upload__effect-level');
const slider = document.querySelector('.effect-level__slider');
const effect = document.querySelector('.effect-level__value');
const effectsList = document.querySelector('.effects__list');

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

const handlerEffects = (evt) => {
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
};

// end slider

function onUploadEscKeydown(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeUpload();
  }
}

const onFocusBlurEscKeydown = () => {
  description.addEventListener('focus', () => {
    document.removeEventListener('keydown', onUploadEscKeydown);
    description.addEventListener('blur', () => {
      document.addEventListener('keydown', onUploadEscKeydown);
    });
  });
  hashtag.addEventListener('focus', () => {
    document.removeEventListener('keydown', onUploadEscKeydown);
    hashtag.addEventListener('blur', () => {
      document.addEventListener('keydown', onUploadEscKeydown);
    });
  });
};

function openUpload (evt) {
  preview.src = URL.createObjectURL(evt.target.files[0]);
  sliderElement.classList.add('hidden');
  editPhoto.classList.remove('hidden');
  bodyTag.classList.add('modal-open');
  onFocusBlurEscKeydown();
  buttonDecreasePreview.addEventListener('click', reducePreview);
  effectsList.addEventListener('change', handlerEffects);
  document.addEventListener('keydown', onUploadEscKeydown);
}

function closeUpload () {
  editPhoto.classList.add('hidden');
  bodyTag.classList.remove('modal-open');
  openForm.value = '';
  hashtag.value = '';
  description.value = '';
  slider.noUiSlider.reset();
  imagePreview.removeAttribute('style');
  imagePreview.removeAttribute('class');
  document.querySelector('#effect-none').checked = true;
  imageScaleValue.value = '100%';
  description.addEventListener('input', () => {
    document.removeEventListener('keydown', onUploadEscKeydown);
  });
  hashtag.addEventListener('input', () => {
    document.removeEventListener('keydown', onUploadEscKeydown);
  });
  effectsList.removeEventListener('change', handlerEffects);
  buttonDecreasePreview.removeEventListener('click', reducePreview);
  buttonIncreasePreview.removeEventListener('click', increasePreview);
  scalePreviewInteger = 1;
  document.removeEventListener('keydown', onUploadEscKeydown);
}

const initializeForm = () => {
  const closeForm = document.querySelector('#upload-cancel');
  openForm.addEventListener('change', openUpload);
  closeForm.addEventListener('click', closeUpload);
  validateForm();
};

export { initializeForm };
