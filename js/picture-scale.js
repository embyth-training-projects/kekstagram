'use strict';

(function () {
  // Получаем элемент фотографии при загрузке
  var imageUploadPreview = window.imageUpload.querySelector('.img-upload__preview img');
  // Получаем элементы управления масштабом изображения
  var buttonScaleDecrease = window.imageUpload.querySelector('.scale__control--smaller');
  var buttonScaleIncrease = window.imageUpload.querySelector('.scale__control--bigger');
  var inputScaleValue = window.imageUpload.querySelector('.scale__control--value');

  // Минимальное и максимальные параметры масштабирования изображения
  var scaleParams = window.CONSTANTS.IMAGE_UPLOAD.SCALE_PARAMS;

  // Меняем размер изображения
  window.resizeImage = function (scale) {
    inputScaleValue.value = scale + '%';
    imageUploadPreview.style.transform = ('scale(' + scale / 100 + ')');
  };

  // Блокируем кнопки увеличения и уменьшения изображения при максимальном и минимальном масштабе
  window.disableScaleButtons = function () {
    buttonScaleDecrease.disabled = parseInt(inputScaleValue.value, 10) === scaleParams.MIN;
    buttonScaleIncrease.disabled = parseInt(inputScaleValue.value, 10) === scaleParams.MAX;
  };

  // Обработчик нажатия по кнопке уменьшения масштаба фотографии
  window.buttonDecreaseClickHandler = function () {
    var currentScale = parseInt(inputScaleValue.value, 10);

    if (currentScale > scaleParams.MIN) {
      currentScale -= scaleParams.STEP;
    }

    window.resizeImage(currentScale);
    window.disableScaleButtons();
  };

  // Обработчик нажатия по кнопке увеличения масштаба фотографии
  window.buttonIncreaseClickHandler = function () {
    var currentScale = parseInt(inputScaleValue.value, 10);

    if (currentScale < scaleParams.MAX) {
      currentScale += scaleParams.STEP;
    }

    window.resizeImage(currentScale);
    window.disableScaleButtons();
  };
})();
