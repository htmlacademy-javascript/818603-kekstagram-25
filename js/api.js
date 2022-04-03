import { renderThumbnails, onErrorLoad } from './create-thumbnails.js';

const getPhotosData = () => {
  fetch('https://25.javascript.pages.academy/kekstagram/data')
    .then((response) => {
      if (response.ok) {
        return response;
      }
      throw new Error;
    })
    .then((response) => response.json())
    .then((photosData) => renderThumbnails(photosData))
    .catch(() => onErrorLoad());
};

export { getPhotosData };
