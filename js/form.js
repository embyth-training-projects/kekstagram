'use strict';

(function () {
  // Получаем элементы редактирования изображения
  window.imageUpload = document.querySelector('.img-upload');
  var imageUploadForm = window.imageUpload.querySelector('#upload-select-image');
  var imageUploadInput = window.imageUpload.querySelector('#upload-file');
  var imageUploadOverlay = window.imageUpload.querySelector('.img-upload__overlay');
  var imageUploadCloseButton = window.imageUpload.querySelector('.img-upload__cancel');
  var imageUploadPreview = window.imageUpload.querySelector('.img-upload__preview img');

  // Получаем элементы управления масштабом изображения
  var buttonScaleDecrease = window.imageUpload.querySelector('.scale__control--smaller');
  var buttonScaleIncrease = window.imageUpload.querySelector('.scale__control--bigger');
  var inputScaleValue = window.imageUpload.querySelector('.scale__control--value');

  // Получаем элементы настроек эффекта
  var blockEffectLevel = window.imageUpload.querySelector('.effect-level');
  var inputEffectValue = blockEffectLevel.querySelector('.effect-level__value');
  var pinEffectLevel = blockEffectLevel.querySelector('.effect-level__pin');
  var depthEffectLevel = blockEffectLevel.querySelector('.effect-level__depth');
  var listEffect = window.imageUpload.querySelector('.effects__list');

  // Получаем элементы ввода текста
  var inputHashtags = window.imageUpload.querySelector('.text__hashtags');
  var commentTextarea = window.imageUpload.querySelector('.text__description');

  // Обработчик изменения примененного эффекта
  function listEffectChangeHandler(evt) {
    var effectName = evt.target.value;

    var depthEffect = window.CONSTANTS.IMAGE_UPLOAD.DEPTH_PARAMS;
    depthEffectLevel.style.width = depthEffect.DEFAULT + '%';
    pinEffectLevel.style.left = depthEffect.DEFAULT + '%';
    inputEffectValue.value = depthEffect.DEFAULT;
    imageUploadPreview.className = '';
    imageUploadPreview.style = '';

    if (effectName === 'none') {
      window.util.hideElement(blockEffectLevel);
    } else {
      window.util.showElement(blockEffectLevel);
      imageUploadPreview.classList.add('effects__preview--' + effectName);
      window.setFilter(imageUploadPreview, depthEffect.DEFAULT);
    }

    var currentScale = parseInt(inputScaleValue.value, 10);
    window.resizeImage(currentScale);
    window.disableScaleButtons();
  }

  // Закрыть окно при нажатии кнопки Esc
  function uploadImageEscPressHandler(evt) {
    window.util.isEscKey(evt, uploadFileCloseHandler);
  }

  // Обработчик фокуса ввода хэштегов
  function inputHashtagsFocusHandler() {
    document.removeEventListener('keydown', uploadImageEscPressHandler);
  }

  // Обработчик выхода из фокуса ввода хэштегов
  function inputHashtagsBlurHandler() {
    document.addEventListener('keydown', uploadImageEscPressHandler);
  }

  // Обработчик фокуса ввода комментария
  function commentTextareaFocusHandler() {
    document.removeEventListener('keydown', uploadImageEscPressHandler);
  }

  // Обработчик выхода из фокуса ввода комментария
  function commentTextareaBlurHandler() {
    document.addEventListener('keydown', uploadImageEscPressHandler);
  }

  // Обработчик кнопки закрытия редактирования фотографии
  function uploadImageCloseButtonClickHandler() {
    uploadFileCloseHandler();
  }

  // Обработчик отправки формы загрузки изображения
  function uploadFormSubmitHandler(evt) {
    evt.preventDefault();
    window.backend.save(new FormData(imageUploadForm), uploadFileCloseHandler, window.util.showError);
  }

  // Открывает форму редактирования изображения
  function uploadImageChangeHandler() {
    window.util.showElement(imageUploadOverlay);
    window.util.hideElement(blockEffectLevel);
    window.util.hideBodyScroll();

    document.addEventListener('keydown', uploadImageEscPressHandler);
    pinEffectLevel.addEventListener('mousedown', window.moveEffectSlider);
    imageUploadCloseButton.addEventListener('click', uploadImageCloseButtonClickHandler);
    buttonScaleDecrease.addEventListener('click', window.buttonDecreaseClickHandler);
    buttonScaleIncrease.addEventListener('click', window.buttonIncreaseClickHandler);
    listEffect.addEventListener('change', listEffectChangeHandler);
    pinEffectLevel.addEventListener('mouseup', window.pinEffectLevelMouseUpHandler);
    inputHashtags.addEventListener('input', window.inputHashtagsInputHandler);
    inputHashtags.addEventListener('focus', inputHashtagsFocusHandler);
    inputHashtags.addEventListener('blur', inputHashtagsBlurHandler);
    commentTextarea.addEventListener('input', window.commentTextareaInputHandler);
    commentTextarea.addEventListener('focus', commentTextareaFocusHandler);
    commentTextarea.addEventListener('blur', commentTextareaBlurHandler);
    imageUploadForm.addEventListener('submit', uploadFormSubmitHandler);

    window.resizeImage(window.CONSTANTS.IMAGE_UPLOAD.SCALE_PARAMS.DEFAULT);
    window.disableScaleButtons();
  }

  // Закрывает форму редактирования изображения
  function uploadFileCloseHandler() {
    window.util.hideElement(imageUploadOverlay);
    window.util.showBodyScroll();

    document.removeEventListener('keydown', uploadImageEscPressHandler);
    pinEffectLevel.removeEventListener('mousedown', window.moveEffectSlider);
    imageUploadCloseButton.removeEventListener('click', uploadImageCloseButtonClickHandler);
    buttonScaleDecrease.removeEventListener('click', window.buttonDecreaseClickHandler);
    buttonScaleIncrease.removeEventListener('click', window.buttonIncreaseClickHandler);
    listEffect.removeEventListener('change', listEffectChangeHandler);
    pinEffectLevel.removeEventListener('mouseup', window.pinEffectLevelMouseUpHandler);
    inputHashtags.removeEventListener('input', window.inputHashtagsInputHandler);
    inputHashtags.removeEventListener('focus', inputHashtagsFocusHandler);
    inputHashtags.removeEventListener('blur', inputHashtagsBlurHandler);
    commentTextarea.removeEventListener('input', window.commentTextareaInputHandler);
    commentTextarea.removeEventListener('focus', commentTextareaFocusHandler);
    commentTextarea.removeEventListener('blur', commentTextareaBlurHandler);
    imageUploadForm.removeEventListener('submit', uploadFormSubmitHandler);

    imageUploadForm.reset();
  }

  imageUploadInput.addEventListener('change', uploadImageChangeHandler);
})();
