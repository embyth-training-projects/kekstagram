'use strict';

(function () {
  // Получаем элементы редактирования изображения
  var imageUploadNode = document.querySelector('.img-upload');
  var imageUploadForm = imageUploadNode.querySelector('#upload-select-image');
  var imageUploadInput = imageUploadNode.querySelector('#upload-file');
  var imageUploadOverlay = imageUploadNode.querySelector('.img-upload__overlay');
  var imageUploadCloseButton = imageUploadNode.querySelector('.img-upload__cancel');
  var imageUploadPreview = imageUploadNode.querySelector('.img-upload__preview img');
  var blockEffectLevel = imageUploadNode.querySelector('.effect-level');

  // Получаем элементы ввода текста
  var inputHashtags = imageUploadNode.querySelector('.text__hashtags');
  var commentTextarea = imageUploadNode.querySelector('.text__description');

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
    window.file.upload(imageUploadInput, imageUploadPreview, uploadFileCloseHandler);
    window.scale.activate();
    window.scale.hideControls();
    window.scale.resize(window.scale.Params.DEFAULT);
    window.effect.activate();
    window.effect.reset();
    window.validation.activate();

    window.preview.disable();

    document.addEventListener('keydown', uploadImageEscPressHandler);
    imageUploadCloseButton.addEventListener('click', uploadImageCloseButtonClickHandler);

    inputHashtags.addEventListener('focus', inputHashtagsFocusHandler);
    inputHashtags.addEventListener('blur', inputHashtagsBlurHandler);
    commentTextarea.addEventListener('focus', commentTextareaFocusHandler);
    commentTextarea.addEventListener('blur', commentTextareaBlurHandler);
    imageUploadForm.addEventListener('submit', uploadFormSubmitHandler);

    imageUploadInput.blur();
  }

  // Закрывает форму редактирования изображения
  function uploadFileCloseHandler() {
    window.util.hideElement(imageUploadOverlay);
    window.util.showBodyScroll();
    window.scale.disable();
    window.effect.disable();
    window.validation.disable();

    window.preview.activate();

    document.removeEventListener('keydown', uploadImageEscPressHandler);
    imageUploadCloseButton.removeEventListener('click', uploadImageCloseButtonClickHandler);

    inputHashtags.removeEventListener('focus', inputHashtagsFocusHandler);
    inputHashtags.removeEventListener('blur', inputHashtagsBlurHandler);
    commentTextarea.removeEventListener('focus', commentTextareaFocusHandler);
    commentTextarea.removeEventListener('blur', commentTextareaBlurHandler);
    imageUploadForm.removeEventListener('submit', uploadFormSubmitHandler);

    imageUploadForm.reset();
  }

  // Активирует форму загрузки фото
  function activate() {
    imageUploadInput.addEventListener('change', uploadImageChangeHandler);
  }

  // Передаём функции в глобальную область видимости
  window.form = {
    activate: activate
  };
})();
