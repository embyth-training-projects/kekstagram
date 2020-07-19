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
    },
    GALLERY: {
      NEW_QUANTITY: 10
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
    // Перемешиваем массив
    shuffleArray: function (array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    },
    // Показ ошибки
    showError: function (errorMessage) {
      var node = document.createElement('div');

      node.style.zIndex = 100;
      node.style.width = '100%';
      node.style.margin = '0 auto';
      node.style.padding = '5px 0';
      node.style.textAlign = 'center';
      node.style.position = 'absolute';
      node.style.left = 0;
      node.style.top = 0;
      node.style.backgroundColor = 'red';
      node.style.fontSize = '30px';

      node.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', node);
    }
  };
})();
