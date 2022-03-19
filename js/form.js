import { bodyTag } from './fullsize-photo.js';
import { isEscapeKey } from './util.js';

const MAXLENGTH = 5;
const form = document.querySelector('.img-upload__form');
const openForm = document.querySelector('#upload-file');
const description = document.querySelector('.text__description');
const editPhoto = document.querySelector('.img-upload__overlay');
const preview = document.querySelector('.img-upload__preview').querySelector('img');
const hashtag = document.querySelector('.text__hashtags');
// const re = /^#[A-Za-zA-Яа-яËё0-9]{1, 5}$/;


//validate form
const validateForm = () => {
  const pristine = new Pristine(form, {
    classTo: 'img-upload__form',
    errorTextParent: 'text__hashtags-container'
  });

  const checkLength = (value, maxLength) => value.length <= maxLength;
  const checkMinLength = (value) => {
    if (value[1] !== ' ') {
      return true;
    }
    return false;
  };
  const checkHashtag = (value) => {
    if (value === '') {
      return true;
    }
    return false;
  };

  const checkMaxLength = (value) => {
    const tags = value.split(' ');
    const string = tags.filter((item) => item !== '');
    return string.every((item) => checkLength(item, MAXLENGTH));
  };

  const checkFirstSymbol = (value) => {
    if (value[0] === '#') {
      return true;
    }
    return false;
  };

  pristine.addValidator(hashtag, checkMinLength, 'hashtag length min 2 symbols');
  pristine.addValidator(hashtag, checkMaxLength, 'hashtag length max 20 symbols');
  pristine.addValidator(hashtag, checkFirstSymbol, 'begin with #');
  pristine.addValidator(hashtag, checkHashtag, 'wrong symbol', 5, true);

  form.addEventListener('submit', (evt) => {
    const valid = pristine.validate();
    if (!valid) {
      evt.preventDefault();
    }
  });
};
// end validate form

const onUploadEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeUpload();
  }
};

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
  editPhoto.classList.remove('hidden');
  bodyTag.classList.add('modal-open');
  onFocusBlurEscKeydown();
  document.addEventListener('keydown', onUploadEscKeydown);
}

function closeUpload () {
  editPhoto.classList.add('hidden');
  bodyTag.classList.remove('modal-open');
  openForm.value = '';
  document.removeEventListener('keydown', onUploadEscKeydown);
  description.addEventListener('focus', () => {
    document.removeEventListener('keydown', onUploadEscKeydown);
  });
  hashtag.addEventListener('focus', () => {
    document.removeEventListener('keydown', onUploadEscKeydown);
  });
}

const initializeForm = () => {
  const closeForm = document.querySelector('#upload-cancel');
  openForm.addEventListener('change', openUpload);
  closeForm.addEventListener('click', closeUpload);
  validateForm();
};

export { initializeForm };
