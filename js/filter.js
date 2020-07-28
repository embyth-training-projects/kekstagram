'use strict';

(function () {
  // Получаем элементы фильтров фото
  var filterBlock = document.querySelector('.img-filters');
  var recommendedFilterButton = filterBlock.querySelector('#filter-recommended');
  var popularFilterButton = filterBlock.querySelector('#filter-popular');
  var randomFilterButton = filterBlock.querySelector('#filter-random');
  var discussedFilterButton = filterBlock.querySelector('#filter-discussed');
  var newFilterButton = filterBlock.querySelector('#filter-new');

  var NEW_FILTER_QUANTITY = 10;

  // Навешиваем состояние активной кнопки с помощью класса
  function getActiveClassState(evt) {
    var target = evt.target;

    target.parentNode.querySelectorAll('.img-filters__button').forEach(function (element) {
      element.classList.remove('img-filters__button--active');
    });

    target.classList.add('img-filters__button--active');
  }

  // Обработчик клика на фильтр "Рекомендуемые фото"
  function recommendedFilterClickHandler(evt) {
    evt.preventDefault();

    window.gallery.clear();
    getActiveClassState(evt);
    window.gallery.render(window.photoData);
  }

  // Обработчик клика на фильтр "Популярные фото"
  function popularFilterClickHandler(evt) {
    evt.preventDefault();

    var photoDataLikesOrder = window.photoData
      .slice()
      .sort(function (left, right) {
        return right.likes - left.likes;
      });

    window.gallery.clear();
    window.gallery.render(photoDataLikesOrder);
    getActiveClassState(evt);
  }

  // Обработчик клика на фильтр "Случайные фото"
  function randomFilterClickHandler(evt) {
    evt.preventDefault();

    var photoDataShuffled = window.photoData.slice();
    photoDataShuffled = window.util.shuffleArray(photoDataShuffled);

    window.gallery.clear();
    window.gallery.render(photoDataShuffled);
    getActiveClassState(evt);
  }

  // Обработчик клика на фильтр "Обсуждаемые фото"
  function discussedFilterClickHandler(evt) {
    evt.preventDefault();

    var photoDataCommentsOrder = window.photoData
      .slice()
      .sort(function (left, right) {
        return right.comments.length - left.comments.length;
      });

    window.gallery.clear();
    window.gallery.render(photoDataCommentsOrder);
    getActiveClassState(evt);
  }

  // Обработчик клика на фильтр "Новые фото"
  function newFilterClickHandler(evt) {
    evt.preventDefault();

    function getItemsFromArray(array, quantity) {
      var newArray = [];
      var usedIndexes = [];
      var randomIndex = window.util.getRandomIndex(array.length);

      for (var i = 0; i < quantity; i++) {
        while (usedIndexes.indexOf(randomIndex) !== -1) {
          randomIndex = window.util.getRandomIndex(array.length);
        }
        newArray.push(array[randomIndex]);
        usedIndexes.push(randomIndex);
      }

      return newArray;
    }

    var photoDataNew = getItemsFromArray(window.photoData, NEW_FILTER_QUANTITY);

    window.gallery.clear();
    window.gallery.render(photoDataNew);
    getActiveClassState(evt);
  }

  // Функция активации фильтров
  function activate() {
    // Показываем блок фильтров
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
    // Передаём события кнопкам фильтров фото
    recommendedFilterButton.addEventListener('click', recommendedFilterClickHandler);
    popularFilterButton.addEventListener('click', popularFilterClickHandler);
    randomFilterButton.addEventListener('click', randomFilterClickHandler);
    discussedFilterButton.addEventListener('click', discussedFilterClickHandler);
    newFilterButton.addEventListener('click', newFilterClickHandler);
  }

  // Передаём функиции в глобальную область видимости
  window.filter = {
    activate: activate
  };
})();
