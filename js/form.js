import { bodyTag } from './fullsize-photo.js';
import { isEscapeKey } from './util.js';

const MAXLENGTH_HASHTAGS_SYMBOLS = 5;
const MINLENGTH_HASHTAGS_SYMBOLS = 2;
const HASGTAGS_COUNTS = 5;
const form = document.querySelector('.img-upload__form');
const openForm = document.querySelector('#upload-file');
const description = document.querySelector('.text__description');
const editPhoto = document.querySelector('.img-upload__overlay');
const preview = document.querySelector('.img-upload__preview').querySelector('img');
const hashtag = document.querySelector('.text__hashtags');
const re = /^#[A-Za-zA-Яа-яËё0-9]{1,19}$/;


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
