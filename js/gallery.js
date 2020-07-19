'use strict';

(function () {
  // Получаем шаблон
  var pictureElementTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var pictureElement = document.querySelector('.pictures');

  // Получаем элементы фильтров фото
  var filterBlock = document.querySelector('.img-filters');
  var recommendedFilterButton = filterBlock.querySelector('#filter-recommended');
  var popularFilterButton = filterBlock.querySelector('#filter-popular');
  var randomFilterButton = filterBlock.querySelector('#filter-random');
  var discussedFilterButton = filterBlock.querySelector('#filter-discussed');
  var newFilterButton = filterBlock.querySelector('#filter-new');

  // Создаем элемент из шаблона и присваиваем ему информацию из массива
  var createPictureElement = function (picture) {
    var pictureNode = pictureElementTemplate.cloneNode(true);

    pictureNode.querySelector('.picture__img').src = picture.url;
    pictureNode.querySelector('.picture__likes').textContent = picture.likes;
    pictureNode.querySelector('.picture__comments').textContent = picture.comments.length;

    return pictureNode;
  };

  // Отрисовывает фотографии
  var renderPhotos = function (photos) {
    var fragment = document.createDocumentFragment();

    photos.forEach(function (item) {
      fragment.appendChild(createPictureElement(item));
    });

    pictureElement.appendChild(fragment);
  };

  // Обработчик загрузки данных для фото с сервера
  var onLoad = function (data) {
    window.photoData = data;
    // Выполняем отрисовку фотографий
    renderPhotos(window.photoData);

    // Показываем блок фильтров
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
  };

  // Генирируем данные для фотографий из ответа сервера
  window.backend.load(onLoad, window.util.showError);

  // Очищаем фотографии в галереи
  function clearGalleryContainer() {
    pictureElement.querySelectorAll('.picture').forEach(function (item) {
      item.remove();
    });
  }

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

    clearGalleryContainer();
    getActiveClassState(evt);
    renderPhotos(window.photoData);
  }

  // Обработчик клика на фильтр "Популярные фото"
  function popularFilterClickHandler(evt) {
    evt.preventDefault();

    var photoDataLikesOrder = window.photoData
      .slice()
      .sort(function (left, right) {
        return right.likes - left.likes;
      });

    clearGalleryContainer();
    renderPhotos(photoDataLikesOrder);
    getActiveClassState(evt);
  }

  // Обработчик клика на фильтр "Случайные фото"
  function randomFilterClickHandler(evt) {
    evt.preventDefault();

    var photoDataShuffled = window.photoData.slice();
    photoDataShuffled = window.util.shuffleArray(photoDataShuffled);

    clearGalleryContainer();
    renderPhotos(photoDataShuffled);
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

    clearGalleryContainer();
    renderPhotos(photoDataCommentsOrder);
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

    var photoDataNew = getItemsFromArray(window.photoData, window.CONSTANTS.GALLERY.NEW_QUANTITY);

    clearGalleryContainer();
    renderPhotos(photoDataNew);
    getActiveClassState(evt);
  }

  // Передаём события кнопкам фильтров фото
  recommendedFilterButton.addEventListener('click', recommendedFilterClickHandler);
  popularFilterButton.addEventListener('click', popularFilterClickHandler);
  randomFilterButton.addEventListener('click', randomFilterClickHandler);
  discussedFilterButton.addEventListener('click', discussedFilterClickHandler);
  newFilterButton.addEventListener('click', newFilterClickHandler);
})();
