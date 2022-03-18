import { bodyTag } from './fullsize-photo.js';
import { isEscapeKey } from './util.js';

const MAXLENGTH = 3;
const form = document.querySelector('.img-upload__form');
const openForm = document.querySelector('#upload-file');
const description = document.querySelector('.text__description');
const editPhoto = document.querySelector('.img-upload__overlay');
const preview = document.querySelector('.img-upload__preview').querySelector('img');

//validate form

const pristine = new Pristine(form);
const hashtagInput = document.querySelector('.text__hashtags');

const checkLength = (string, maxLength) => string.length <= maxLength;

const checkMaxLength = (str) => {
  if (str === '') {
    return true;
  }
  const tags = str.split(' ');
  return tags.every((item) => checkLength(item, MAXLENGTH));
};

pristine.addValidator(hashtagInput, checkMaxLength, 'error text message');

form.addEventListener('submit', (evt) => {
  const valid = pristine.validate();
  if (!valid) {
    evt.preventDefault();
  }
});

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
  hashtagInput.addEventListener('focus', () => {
    document.removeEventListener('keydown', onUploadEscKeydown);
    hashtagInput.addEventListener('blur', () => {
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
  hashtagInput.addEventListener('focus', () => {
    document.removeEventListener('keydown', onUploadEscKeydown);
  });
}

const initializeForm = () => {
  const closeForm = document.querySelector('#upload-cancel');
  openForm.addEventListener('change', openUpload);
  closeForm.addEventListener('click', closeUpload);
};

export { initializeForm };
