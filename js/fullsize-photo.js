// import { createThumbnails } from './create-thumbnails.js';
import { isEscapeKey } from './util.js';

const commentTemplate = document.querySelector('#comment').content;
const newTemplate = commentTemplate.querySelector('.social__comment');
const containerComments = document.querySelector('.social__comments');
// const thumbnailsContainer = document.querySelector('.pictures');
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
  commentsLoad.removeEventListener('click', loadMoreComments);
}

function openBigPhoto () {
  bigPicture.classList.remove('hidden');
  listComments.classList.remove('hidden');
  commentsLoad.classList.remove('hidden');
  bodyTag.classList.add('modal-open');
  closeButton.addEventListener('click', closeBigPhoto);
  document.addEventListener('keydown', onBigPhotoEscKeydown);
  commentsLoad.addEventListener('click', loadMoreComments);
}

function loadComments(comments) {
  if (comments.length <= 5) {
    commentsLoad.classList.add('hidden');
  }
  for (let i = 0; i < 5; i++) {
    if (i === comments.length) { break; }
    renderComments(comments[i]);
    loadedComments.textContent = i + 1;
  }
  return comments;
}

function loadMoreComments(comments) {
  if (comments.length > 5) {
    for (let i = containerComments.children.length; i <= comments.length; i++) {
      if (containerComments.children.length % 5 === 0) {
        for (let j = 0; j < 5; j++) {
          renderComments(comments[i]);
          i += 1;
          loadedComments.textContent = i;
          if (i === comments.length) {
            commentsLoad.classList.add('hidden');
            { break; }
          }
        }
        { break; }
      }
      renderComments(comments[i]);
      loadedComments.textContent = i;
      if (i === comments.length) {
        commentsLoad.classList.add('hidden');
        { break; }
      }
    }
  }
}

function renderComments(dataComment) {
  const newComment = newTemplate.cloneNode(true);
  const socilComment = newComment.querySelector('.social__picture');
  newComment.querySelector('.social__text').textContent = dataComment.message;
  socilComment.src = dataComment.avatar;
  socilComment.alt = dataComment.name;
  containerComments.append(newComment);
}

const renderBigPhoto = (dataPhoto) => {
  const likesCount = document.querySelector('.likes-count');
  const descriptionPhoto = document.querySelector('.social__caption');
  bigImage.src = dataPhoto.url;
  likesCount.textContent = dataPhoto.likes;
  descriptionPhoto.textContent = dataPhoto.description;
  const commentsData = dataPhoto.comments;
  allCommentsCount.textContent = commentsData.length;
  loadComments(commentsData);
};

export { renderBigPhoto, openBigPhoto, bodyTag };
