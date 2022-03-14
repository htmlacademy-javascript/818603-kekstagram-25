// import { createThumbnails } from './create-thumbnails.js';
import { isEscapeKey } from './util.js';

const commentTemplate = document.querySelector('#comment').content;
const newTemplate = commentTemplate.querySelector('.social__comment');
const container = document.querySelector('.social__comments');
const thumbnailsContainer = document.querySelector('.pictures');
const bigPicture = document.querySelector('.big-picture');
const bigImage = bigPicture.querySelector('img');
const closeButton = document.querySelector('#picture-cancel');
const listComments = document.querySelector('.social__comment-count');
const commentsLoad = document.querySelector('.comments-loader');
const bodyTag = document.querySelector('body');

const onBigPhotoEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPhoto();
  }
};
function closeBigPhoto () {
  container.innerHTML = '';
  bigPicture.classList.add('hidden');
  listComments.classList.remove('hidden');
  commentsLoad.classList.remove('hidden');
  bodyTag.classList.remove('modal-open');
  document.removeEventListener('keydown', onBigPhotoEscKeydown);
}

function openBigPhoto () {
  bigPicture.classList.remove('hidden');
  listComments.classList.add('hidden');
  commentsLoad.classList.add('hidden');
  bodyTag.classList.add('modal-open');
  document.addEventListener('keydown', onBigPhotoEscKeydown);
}

closeButton.addEventListener('click', () => {
  closeBigPhoto();
});

const renderBigPhoto = (dataPhoto) => {
  const likesCount = document.querySelector('.likes-count');
  const commentsCount = document.querySelector('.comments-count');
  const descriptionPhoto = document.querySelector('.social__caption');
  bigImage.src = dataPhoto.url;
  likesCount.textContent = dataPhoto.likes;
  descriptionPhoto.textContent = dataPhoto.description;
  const socialComments = dataPhoto.comments;
  commentsCount.textContent = socialComments.length;

  socialComments.forEach((dataComment) => {
    const newComment = newTemplate.cloneNode(true);
    newComment.querySelector('.social__text').textContent = dataComment;
    container.appendChild(newComment);
  });
  return thumbnailsContainer.appendChild(container);
};

export { renderBigPhoto, openBigPhoto };
