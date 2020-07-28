'use strict';

(function () {
  // Получаем элемент фотографии при загрузке
  var imageUploadNode = document.querySelector('.img-upload');
  var imageUploadPreview = imageUploadNode.querySelector('.img-upload__preview img');

  // Получаем элементы управления масштабом изображения
  var buttonScaleDecrease = imageUploadNode.querySelector('.scale__control--smaller');
  var buttonScaleIncrease = imageUploadNode.querySelector('.scale__control--bigger');
  var inputScaleValue = imageUploadNode.querySelector('.scale__control--value');

  // Минимальное и максимальные параметры масштабирования изображения
  var ScaleParams = {
    MIN: 25,
    MAX: 100,
    DEFAULT: 100,
    STEP: 25
  };

  // Меняем размер изображения
  function resizeImage(scale) {
    inputScaleValue.value = scale + '%';
    imageUploadPreview.style.transform = ('scale(' + scale / 100 + ')');
  }

  // Блокируем кнопки увеличения и уменьшения изображения при максимальном и минимальном масштабе
  function disableScaleButtons() {
    buttonScaleDecrease.disabled = parseInt(inputScaleValue.value, 10) === ScaleParams.MIN;
    buttonScaleIncrease.disabled = parseInt(inputScaleValue.value, 10) === ScaleParams.MAX;
  }

  // Обработчик нажатия по кнопке уменьшения масштаба фотографии
  function buttonDecreaseClickHandler() {
    var currentScale = parseInt(inputScaleValue.value, 10);

    if (currentScale > ScaleParams.MIN) {
      currentScale -= ScaleParams.STEP;
    }

    resizeImage(currentScale);
    disableScaleButtons();
  }

  // Обработчик нажатия по кнопке увеличения масштаба фотографии
  function buttonIncreaseClickHandler() {
    var currentScale = parseInt(inputScaleValue.value, 10);

    if (currentScale < ScaleParams.MAX) {
      currentScale += ScaleParams.STEP;
    }

    resizeImage(currentScale);
    disableScaleButtons();
  }

  // Активация управлением изменения размера изображения
  function activate() {
    buttonScaleDecrease.addEventListener('click', buttonDecreaseClickHandler);
    buttonScaleIncrease.addEventListener('click', buttonIncreaseClickHandler);
  }

  // Отключение управления изменения размера изображения
  function disable() {
    buttonScaleDecrease.removeEventListener('click', buttonDecreaseClickHandler);
    buttonScaleIncrease.removeEventListener('click', buttonIncreaseClickHandler);
  }

  window.scale = {
    activate: activate,
    disable: disable,
    hideControls: disableScaleButtons,
    resize: resizeImage,
    Params: ScaleParams
  };
})();
