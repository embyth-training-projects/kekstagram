'use strict';

(function () {
  // Получаем элементы ввода текста
  var imageUpload = document.querySelector('.img-upload');
  var inputHashtags = imageUpload.querySelector('.text__hashtags');
  var commentTextarea = imageUpload.querySelector('.text__description');

  // Параметры хэштегов
  var hashtagsProps = {
    MAX: 5,
    MAX_LENGTH: 20
  };

  // Параметры комментариев
  var commentProps = {
    MAX_LENGTH: 140
  };

  // Сообщения о ошибке
  var errorMessages = {
    OVER_MAX: 'Количество хэш-тегов не должно быть больше ' + hashtagsProps.MAX,
    UNIQUE: 'Хэш-тег не может быть использован дважды',
    TOO_LONG: 'Максимальная длина одно хэш-тега не должна превышать ' + hashtagsProps.MAX_LENGTH + ' символов',
    TOO_SHORT: 'Хэш-тег не может состоять только из символа # (решётка)',
    HASH_SYMBOL: 'Хэш-тег должен начинаться с символа # (решётка)',
    SPACE_DELIMITER: 'Хэш-теги должны разделяться пробелами',
    COMMENT_TOO_LONG: 'Комментарий не может составлять больше ' + commentProps.MAX_LENGTH + ' символов'
  };

  // Проверяет на уникальность хэштег
  var isHashtagUnique = function (item, index, items) {
    return items.indexOf(item) === index;
  };

  // Обработчик ввода хэштегов
  window.inputHashtagsInputHandler = function () {
    var hashtags = inputHashtags.value.trim().toLowerCase().split(' ');

    if (!hashtags.length) {
      return;
    }

    if (hashtags.length > hashtagsProps.MAX) {
      inputHashtags.setCustomValidity(errorMessages.OVER_MAX);
      return;
    }

    if (!hashtags.every(isHashtagUnique)) {
      inputHashtags.setCustomValidity(errorMessages.UNIQUE);
      return;
    }

    hashtags.forEach(function (hashtag) {
      if (hashtag.length > hashtagsProps.MAX_LENGTH) {
        inputHashtags.setCustomValidity(errorMessages.TOO_LONG);
      } else if (hashtag === '#') {
        inputHashtags.setCustomValidity(errorMessages.TOO_SHORT);
      } else if (hashtag.charAt(0) !== '#') {
        inputHashtags.setCustomValidity(errorMessages.HASH_SYMBOL);
      } else if (hashtag.includes('#', 1)) {
        inputHashtags.setCustomValidity(errorMessages.SPACE_DELIMITER);
      } else {
        inputHashtags.setCustomValidity('');
      }
    });
  };

  // Обработчик ввода текста для комментария
  window.commentTextareaInputHandler = function () {
    var text = commentTextarea.value;

    if (!text.length) {
      return;
    }

    if (text.length > commentProps.MAX_LENGTH) {
      commentTextarea.setCustomValidity(errorMessages.COMMENT_TOO_LONG);
    } else {
      commentTextarea.setCustomValidity('');
    }
  };
})();
