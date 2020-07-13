'use strict';

(function () {
  // Получаем шаблон
  var pictureElementTemplate = document.querySelector('#picture').content.querySelector('.picture');

  // Создаем элемент из шаблона и присваиваем ему информацию из массива
  var createPictureElement = function (picture) {
    var pictureElement = pictureElementTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

    return pictureElement;
  };

  // Создаем DOM-элементы фотографий
  var createPictureFragment = function (pictures) {
    var fragment = document.createDocumentFragment();

    pictures.forEach(function (item) {
      fragment.appendChild(createPictureElement(item));
    });

    return fragment;
  };

  // Выполняем инициализацию страницы
  var pictureListElements = document.querySelector('.pictures');
  pictureListElements.appendChild(createPictureFragment(window.photoGeneratedData));
})();
