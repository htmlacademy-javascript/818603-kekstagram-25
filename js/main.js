'use strict';

const getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    if (min >= 0 && max >= 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }

const verifyCommentLength = function (string) {
    if (string >= 5 && string <= 140) {
        return string = true;
    } 
    return string = false;
}