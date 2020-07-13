'use strict';

(function () {
  // Заносим константы в глобальную область видимости
  window.CONSTANTS = {
    // Коды кнопок
    KEYCODES: {
      ESC: 27,
      ENTER: 13
    },
    IMAGE_UPLOAD: {
      SCALE_PARAMS: {
        MIN: 25,
        MAX: 100,
        DEFAULT: 100,
        STEP: 25
      },
      DEPTH_PARAMS: {
        MIN: 0,
        MAX: 100,
        DEFAULT: 75
      }
    }
  };

  // Заносим методы в глобальную область видимости
  window.util = {
    // Метод возвращает случайный индекс
    getRandomIndex: function (number) {
      return Math.floor(Math.random() * number);
    },
    // Метод возвращает случайное число в заданном интервале
    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    // Метод возвращает случайное значение в заданном массиве
    getRandomValue: function (array) {
      return array[this.getRandomIndex(array.length)];
    },
    // Проверка на нажатиe кнопки ESC
    isEscKey: function (evt, action) {
      if (evt.keyCode === window.CONSTANTS.KEYCODES.ESC) {
        action();
      }
    },
    // Проверка на нажатиe кнопки Enter
    isEnterKey: function (evt, action) {
      if (evt.keyCode === window.CONSTANTS.KEYCODES.ENTER) {
        action();
      }
    },
    // Показать элемент
    showElement: function (element) {
      element.classList.remove('hidden');
    },
    // Спрятать элемент
    hideElement: function (element) {
      element.classList.add('hidden');
    },
    // Показываем скролл на странице
    showBodyScroll: function () {
      document.body.style.overflowY = 'auto';
    },
    // Прячем скролл на странице
    hideBodyScroll: function () {
      document.body.style.overflowY = 'hidden';
    },
  };
})();
