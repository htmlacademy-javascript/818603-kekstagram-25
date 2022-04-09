import { bodyTag } from './fullsize-photo.js';
import { isEscapeKey } from './util.js';

const MAXLENGTH_HASHTAGS_SYMBOLS = 20;
const MAXLENGTH_DESCRIPTION_SYMBOLS = 3;
const MINLENGTH_HASHTAGS_SYMBOLS = 2;
const HASGTAGS_COUNTS = 5;
const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
const fileChooser = document.querySelector('#upload-file');
const form = document.querySelector('.img-upload__form');
const submitButton = form.querySelector('.img-upload__submit');
const openForm = document.querySelector('#upload-file');
const description = document.querySelector('.text__description');
const editPhoto = document.querySelector('.img-upload__overlay');
const preview = document.querySelector('.img-upload__preview').querySelector('img');
const hashtag = document.querySelector('.text__hashtags');
const imagePreview = document.querySelector('.img-upload__preview img');
const re = /^#[A-Za-zA-Яа-яËё0-9]{1,19}$/;

const closeSuccessOrErrorPopup = (evt) => {
  const successOrErrorPopup = bodyTag.lastElementChild.querySelector('div');
  const closeButton = bodyTag.lastElementChild.querySelector('button');
  if(!successOrErrorPopup.contains(evt.target) || closeButton.contains(evt.target)) {
    removePopup();
  }
};

function removePopup() {
  bodyTag.lastElementChild.remove();
  document.removeEventListener('click', closeSuccessOrErrorPopup);
  document.removeEventListener('keydown', onSuccessErrorEscKeydown);
}

function onSuccessErrorEscKeydown(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    removePopup();
  }
}

function onSuccessPopup() {
  closeUpload();
  const successPopupTemplate = document.querySelector('#success').content.cloneNode(true);
  bodyTag.append(successPopupTemplate);
  document.addEventListener('click', closeSuccessOrErrorPopup);
  document.addEventListener('keydown', onSuccessErrorEscKeydown);
}

function onErrorPopup() {
  closeUpload();
  const errorPopup = document.querySelector('#error').content.cloneNode(true);
  bodyTag.append(errorPopup);
  document.addEventListener('click', closeSuccessOrErrorPopup);
  document.addEventListener('keydown', onSuccessErrorEscKeydown);
}

//validate form

const checkLength = (value, maxLength) => value.length <= maxLength;

const getTags = (string) => string.split(' ').filter((item) => item !== '');

const checkMinlength = (string) => getTags(string).every((item) => item.length >= MINLENGTH_HASHTAGS_SYMBOLS);

const checkHashtagMaxlength = (string) => getTags(string).every((item) => checkLength(item, MAXLENGTH_HASHTAGS_SYMBOLS));

const checkDescriptionMaxlength = (string) => string.length <= MAXLENGTH_DESCRIPTION_SYMBOLS;

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
  pristine.addValidator(hashtag, checkMinlength, 'hashtag min length 2 symbols');
  pristine.addValidator(hashtag, checkHashtagMaxlength, 'hashtag max length 20 symbols');
  pristine.addValidator(hashtag, checkSymbols, 'wrong symbol');
  pristine.addValidator(hashtag, checkUniq, 'this hashtag already exist');
  pristine.addValidator(description, checkDescriptionMaxlength, 'comments length max 140 symbols');

  // end validate form

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const validHashtag = pristine.validate();
    if (validHashtag) {
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
          if (!responce.ok) {
            throw new Error;
          }
          onSuccessPopup();
          submitButton.disabled = false;
        })
        .catch(() => {
          onErrorPopup();
          submitButton.disabled = false;
        });
    }
  });
};

// scale preview image

const buttonDecreasePreview = document.querySelector('.scale__control--smaller');
const buttonIncreasePreview = document.querySelector('.scale__control--bigger');
const imageScaleValue = document.querySelector('.scale__control--value');

function reducePreview() {
  imageScaleValue.value = parseFloat(imageScaleValue.value);
  imageScaleValue.value -= 25;
  imageScaleValue.value += '%';
  imagePreview.style.transform = `scale(${imageScaleValue.value})`;
  buttonIncreasePreview.addEventListener('click', increasePreview);
  if (imageScaleValue.value === '25%') {
    buttonDecreasePreview.removeEventListener('click', reducePreview);
  }
}

function increasePreview() {
  imageScaleValue.value = parseFloat(imageScaleValue.value);
  imageScaleValue.value = parseFloat(imageScaleValue.value, 10) + 25;
  imageScaleValue.value += '%';
  imagePreview.style.transform = `scale(${imageScaleValue.value}`;
  buttonDecreasePreview.addEventListener('click', reducePreview);
  if (imageScaleValue.value === '100%') {
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

const filtersSettings = {
  chrome: {
    config: {
      range: {
        min: 0,
        max: 1,
      },
      start: 1,
      step: 0.1,
    },
    filter: 'grayscale',
    units: ''
  },
  sepia: {
    config: {
      range: {
        min: 0,
        max: 1,
      },
      start: 1,
      step: 0.1,
    },
    filter: 'sepia',
    units: ''
  },
  marvin: {
    config: {
      range: {
        min: 0,
        max: 100,
      },
      start: 100,
      step: 1,
    },
    filter: 'invert',
    units: '%'
  },
  phobos: {
    config: {
      range: {
        min: 0,
        max: 3,
      },
      start: 3,
      step: 0.1,
    },
    filter: 'blur',
    units: 'px'
  },
  heat: {
    config: {
      range: {
        min: 1,
        max: 3,
      },
      start: 3,
      step: 0.1,
    },
    filter: 'brightness',
    units: ''
  }
};

const resetEffects = (evt) => {
  imagePreview.removeAttribute('class');
  imagePreview.classList.add(`effects__preview--${evt.target.value}`);
  imagePreview.style.filter = '';
};

const handlerEffects = (evt) => {
  if (evt.target.value === 'none') {
    sliderElement.classList.add('hidden');
    resetEffects(evt);
  }
  if (evt.target.value !== 'none' ) {
    sliderElement.classList.remove('hidden');
    resetEffects(evt);
    const filterType = evt.target.value;
    const filterConfig = filtersSettings[filterType];
    filter = filterConfig.filter;
    units = filterConfig.units;
    slider.noUiSlider.updateOptions(filterConfig.config);
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


fileChooser.addEventListener('change', () => {
  const file = fileChooser.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));
  if (matches) {
    preview.src = URL.createObjectURL(file);
  }
});

function openUpload() {
  sliderElement.classList.add('hidden');
  editPhoto.classList.remove('hidden');
  bodyTag.classList.add('modal-open');
  onFocusBlurEscKeydown();
  buttonDecreasePreview.addEventListener('click', reducePreview);
  effectsList.addEventListener('change', handlerEffects);
  document.addEventListener('keydown', onUploadEscKeydown);
}

function closeUpload() {
  preview.src = 'img/upload-default-image.jpg';
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
  document.removeEventListener('keydown', onUploadEscKeydown);
}

const initializeForm = () => {
  const closeForm = document.querySelector('#upload-cancel');
  openForm.addEventListener('change', openUpload);
  closeForm.addEventListener('click', closeUpload);
  validateForm();
};

export { initializeForm, closeUpload, closeSuccessOrErrorPopup, onSuccessErrorEscKeydown };
