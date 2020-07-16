'use strict';

(function () {
  // Получаем шаблон
  var pictureElementTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var pictureElement = document.querySelector('.pictures');

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
    window.photoData = window.util.shuffleArray(data);
    // Выполняем отрисовку фотографий
    renderPhotos(window.photoData);
  };

  // Генирируем данные для фотографий из ответа сервера
  window.backend.load(onLoad, window.util.showError);
})();
