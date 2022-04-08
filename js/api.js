import { renderThumbnails, onErrorLoad, showFilteredThumbnails } from './create-thumbnails.js';
import  { debounce } from './util.js';
const RERENDER_DELAY = 500;
const getPhotosData = () => {
  fetch('https://25.javascript.pages.academy/kekstagram/data')
    .then((response) => {
      if (response.ok) {
        return response;
      }
      throw new Error;
    })
    .then((response) => response.json())
    .then((photosData) => {
      renderThumbnails(photosData);
      showFilteredThumbnails(debounce(()=>renderThumbnails(photosData), RERENDER_DELAY), photosData);
    })
    .catch(onErrorLoad);
};

export { getPhotosData };
