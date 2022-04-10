import { renderThumbnails, onErrorLoad, showFilteredThumbnails } from './create-thumbnails.js';

const URL_GET_DATA = 'https://25.javascript.pages.academy/kekstagram/data';

const getPhotosData = () => {
  fetch(URL_GET_DATA)
    .then((response) => {
      if (response.ok) {
        return response;
      }
      throw new Error;
    })
    .then((response) => response.json())
    .then((photosData) => {
      renderThumbnails(photosData);
      showFilteredThumbnails(photosData);
    })
    .catch(onErrorLoad);
};

export { getPhotosData };
