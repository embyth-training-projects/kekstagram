'use strict';

(function () {
  // Получаем элементы редактирования изображения
  var imageUpload = document.querySelector('.img-upload');
  var imageUploadForm = imageUpload.querySelector('#upload-select-image');
  var imageUploadInput = imageUpload.querySelector('#upload-file');
  var imageUploadOverlay = imageUpload.querySelector('.img-upload__overlay');
  var imageUploadCloseButton = imageUpload.querySelector('.img-upload__cancel');
  var imageUploadPreview = imageUpload.querySelector('.img-upload__preview img');

  // Получаем элементы управления масштабом изображения
  var buttonScaleDecrease = imageUpload.querySelector('.scale__control--smaller');
  var buttonScaleIncrease = imageUpload.querySelector('.scale__control--bigger');
  var inputScaleValue = imageUpload.querySelector('.scale__control--value');

  // Получаем элементы настроек эффекта
  var blockEffectLevel = imageUpload.querySelector('.effect-level');
  var inputEffectValue = blockEffectLevel.querySelector('.effect-level__value');
  var scaleEffectLevel = blockEffectLevel.querySelector('.effect-level__line');
  var pinEffectLevel = blockEffectLevel.querySelector('.effect-level__pin');
  var depthEffectLevel = blockEffectLevel.querySelector('.effect-level__depth');
  var listEffect = imageUpload.querySelector('.effects__list');
  var DEPTH_EFFECT_MAX = 100;
  // Минимальное и масксимальные параметры масштабирования изображения
  var scaleParams = {
    MIN: 25,
    MAX: 100,
    DEFAULT: 100,
    STEP: 25
  };

  // Получаем элементы ввода текста
  var inputHashtags = imageUpload.querySelector('.text__hashtags');
  var commentTextarea = imageUpload.querySelector('.text__description');

  // Меняем размер изображения
  var resizeImage = function (scale) {
    inputScaleValue.value = scale + '%';
    imageUploadPreview.style.transform = ('scale(' + scale / 100 + ')');
  };

  // Блокируем кнопки увеличения и уменьшения изображения при максимальном и минимальном масштабе
  var disableScaleButtons = function () {
    buttonScaleDecrease.disabled = parseInt(inputScaleValue.value, 10) === scaleParams.MIN;
    buttonScaleIncrease.disabled = parseInt(inputScaleValue.value, 10) === scaleParams.MAX;
  };

  // Обработчик нажатия по кнопке уменьшения масштаба фотографии
  var buttonDecreaseClickHandler = function () {
    var currentScale = parseInt(inputScaleValue.value, 10);

    if (currentScale > scaleParams.MIN) {
      currentScale -= scaleParams.STEP;
    }

    resizeImage(currentScale);
    disableScaleButtons();
  };

  // Обработчик нажатия по кнопке увеличения масштаба фотографии
  var buttonIncreaseClickHandler = function () {
    var currentScale = parseInt(inputScaleValue.value, 10);

    if (currentScale < scaleParams.MAX) {
      currentScale += scaleParams.STEP;
    }

    resizeImage(currentScale);
    disableScaleButtons();
  };

  // Обработчик изменения примененного эффекта
  var listEffectChangeHandler = function (evt) {
    var effectName = evt.target.value;

    depthEffectLevel.style.width = DEPTH_EFFECT_MAX + '%';
    pinEffectLevel.style.left = DEPTH_EFFECT_MAX + '%';
    inputEffectValue.value = DEPTH_EFFECT_MAX;
    imageUploadPreview.className = '';
    imageUploadPreview.style = '';

    if (effectName === 'none') {
      window.util.hideElement(blockEffectLevel);
    } else {
      window.util.showElement(blockEffectLevel);
      imageUploadPreview.classList.add('effects__preview--' + effectName);
    }

    var currentScale = parseInt(inputScaleValue.value, 10);
    resizeImage(currentScale);
    disableScaleButtons();
  };

  // Получение насищености эффекта
  var getDepthValue = function () {
    var rect = scaleEffectLevel.getBoundingClientRect();

    return pinEffectLevel.offsetLeft / rect.width;
  };

  // Установка фильтров
  var setFilters = function (value) {
    return {
      'chrome': 'greyscale(' + value + ')',
      'sepia': 'sepia(' + value + ')',
      'marvin': 'invert(' + value * 100 + '%)',
      'phobos': 'blur(' + value * 3 + 'px)',
      'heat': 'brightness(' + (value * 2 + 1) + ')'
    };
  };

  // Обработчик поднятия кнопки мыши вверх для ползунка
  var pinEffectLevelMouseUpHandler = function (evt) {
    var filter = listEffect.querySelector('.effects__radio:checked').value;

    evt.preventDefault();
    imageUploadPreview.style.filter = setFilters(getDepthValue())[filter];
  };

  // Закрыть окно при нажатии кнопки Esc
  var closeFormOnPressEsc = function (evt) {
    window.util.isEscKey(evt, uploadFileCloseHandler);
  };

  // Обработчик фокуса ввода хэштегов
  var inputHashtagsFocusHandler = function () {
    document.removeEventListener('keydown', closeFormOnPressEsc);
  };

  // Обработчик выхода из фокуса ввода хэштегов
  var inputHashtagsBlurHandler = function () {
    document.addEventListener('keydown', closeFormOnPressEsc);
  };

  // Обработчик фокуса ввода комментария
  var commentTextareaFocusHandler = function () {
    document.removeEventListener('keydown', closeFormOnPressEsc);
  };

  // Обработчик выхода из фокуса ввода комментария
  var commentTextareaBlurHandler = function () {
    document.addEventListener('keydown', closeFormOnPressEsc);
  };

  // Обработчик кнопки закрытия редактирования фотографии
  var uploadImageCloseButtonClickHandler = function () {
    uploadFileCloseHandler();
  };

  // Открывает форму редактирования изображения
  var uploadFileChangeHandler = function () {
    window.util.showElement(imageUploadOverlay);
    window.util.hideElement(blockEffectLevel);

    document.addEventListener('keydown', closeFormOnPressEsc);
    imageUploadCloseButton.addEventListener('click', uploadImageCloseButtonClickHandler);
    buttonScaleDecrease.addEventListener('click', buttonDecreaseClickHandler);
    buttonScaleIncrease.addEventListener('click', buttonIncreaseClickHandler);
    listEffect.addEventListener('change', listEffectChangeHandler);
    pinEffectLevel.addEventListener('mouseup', pinEffectLevelMouseUpHandler);
    inputHashtags.addEventListener('input', window.inputHashtagsInputHandler);
    inputHashtags.addEventListener('focus', inputHashtagsFocusHandler);
    inputHashtags.addEventListener('blur', inputHashtagsBlurHandler);
    commentTextarea.addEventListener('input', window.commentTextareaInputHandler);
    commentTextarea.addEventListener('focus', commentTextareaFocusHandler);
    commentTextarea.addEventListener('blur', commentTextareaBlurHandler);

    resizeImage(scaleParams.DEFAULT);
    disableScaleButtons();
  };

  // Закрывает форму редактирования изображения
  var uploadFileCloseHandler = function () {
    window.util.hideElement(imageUploadOverlay);

    document.removeEventListener('keydown', closeFormOnPressEsc);
    imageUploadCloseButton.removeEventListener('click', uploadImageCloseButtonClickHandler);
    buttonScaleDecrease.removeEventListener('click', buttonDecreaseClickHandler);
    buttonScaleIncrease.removeEventListener('click', buttonIncreaseClickHandler);
    listEffect.removeEventListener('change', listEffectChangeHandler);
    pinEffectLevel.removeEventListener('mouseup', pinEffectLevelMouseUpHandler);
    inputHashtags.removeEventListener('input', window.inputHashtagsInputHandler);
    inputHashtags.removeEventListener('focus', inputHashtagsFocusHandler);
    inputHashtags.removeEventListener('blur', inputHashtagsBlurHandler);
    commentTextarea.removeEventListener('input', window.commentTextareaInputHandler);
    commentTextarea.removeEventListener('focus', commentTextareaFocusHandler);
    commentTextarea.removeEventListener('blur', commentTextareaBlurHandler);

    imageUploadForm.reset();
  };

  imageUploadInput.addEventListener('change', uploadFileChangeHandler);
})();
