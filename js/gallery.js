'use strict';

(function () {
  // Получаем шаблон
  var pictureElementTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var pictureElement = document.querySelector('.pictures');

  // Создаем элемент из шаблона и присваиваем ему информацию из массива
  function createPictureElement(picture) {
    var pictureNode = pictureElementTemplate.cloneNode(true);

    pictureNode.querySelector('.picture__img').src = picture.url;
    pictureNode.querySelector('.picture__likes').textContent = picture.likes;
    pictureNode.querySelector('.picture__comments').textContent = picture.comments.length;

    return pictureNode;
  }

  // Отрисовывает фотографии
  function renderPhotos(photos) {
    var fragment = document.createDocumentFragment();
    var totalPhotos = (photos.length - window.CONSTANTS.PHOTOS.QUANTITY <= 0) ? photos.length : window.CONSTANTS.PHOTOS.QUANTITY;

    if (totalPhotos !== 0) {
      for (var i = 0; i < totalPhotos; i++) {
        var photoElement = createPictureElement(photos[i]);
        photoElement.setAttribute('data-photo', photos[i].id);
        fragment.appendChild(photoElement);
      }
    }

    pictureElement.appendChild(fragment);
  }

  // Очищаем фотографии в галереи
  function clearGalleryContainer() {
    pictureElement.querySelectorAll('.picture').forEach(function (item) {
      item.remove();
    });
  }

  // Передаём функции в глобальную область видимости
  window.gallery = {
    render: renderPhotos,
    clear: clearGalleryContainer
  };
})();
