'use strict';

(function () {
  // Получаем элементы ввода текста
  var formNode = document.querySelector('#upload-select-image');
  var inputHashtags = formNode.querySelector('.text__hashtags');
  var commentTextarea = formNode.querySelector('.text__description');

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

  // Подсвечиваем инпут
  function highlightInput(input) {
    input.style.border = '2px solid crimson';
    input.style.boxShadow = 'none';
  }

  // Убираем подсветку инпута
  function resetHighlightInput(input) {
    input.style.border = '';
  }

  // Проверяет на уникальность хэштег
  function isHashtagUnique(item, index, items) {
    return items.indexOf(item) === index;
  }

  // Обработчик ввода хэштегов
  function inputHashtagsInputHandler() {
    resetHighlightInput(inputHashtags);
    var hashtags = inputHashtags.value.trim().toLowerCase().split(' ');

    if (!hashtags.length) {
      return;
    }

    if (hashtags.length > hashtagsProps.MAX) {
      highlightInput(inputHashtags);
      inputHashtags.setCustomValidity(errorMessages.OVER_MAX);
      return;
    }

    if (!hashtags.every(isHashtagUnique)) {
      highlightInput(inputHashtags);
      inputHashtags.setCustomValidity(errorMessages.UNIQUE);
      return;
    }

    hashtags.forEach(function (hashtag) {
      if (hashtag.length > hashtagsProps.MAX_LENGTH) {
        highlightInput(inputHashtags);
        inputHashtags.setCustomValidity(errorMessages.TOO_LONG);
      } else if (hashtag === '#') {
        highlightInput(inputHashtags);
        inputHashtags.setCustomValidity(errorMessages.TOO_SHORT);
      } else if (hashtag.charAt(0) !== '#') {
        highlightInput(inputHashtags);
        inputHashtags.setCustomValidity(errorMessages.HASH_SYMBOL);
      } else if (hashtag.includes('#', 1)) {
        highlightInput(inputHashtags);
        inputHashtags.setCustomValidity(errorMessages.SPACE_DELIMITER);
      } else {
        resetHighlightInput(inputHashtags);
        inputHashtags.setCustomValidity('');
      }
    });
  }

  // Обработчик ввода текста для комментария
  function commentTextareaInputHandler() {
    resetHighlightInput(commentTextarea);
    var text = commentTextarea.value;

    if (!text.length) {
      return;
    }

    if (text.length > commentProps.MAX_LENGTH) {
      highlightInput(commentTextarea);
      commentTextarea.setCustomValidity(errorMessages.COMMENT_TOO_LONG);
    } else {
      resetHighlightInput(commentTextarea);
      commentTextarea.setCustomValidity('');
    }
  }

  // Выключаем валидацию формы
  function disable() {
    inputHashtags.removeEventListener('input', inputHashtagsInputHandler);
    commentTextarea.removeEventListener('input', commentTextareaInputHandler);
  }

  // Включаем валидацию формы
  function activate() {
    inputHashtags.addEventListener('input', inputHashtagsInputHandler);
    commentTextarea.addEventListener('input', commentTextareaInputHandler);
  }

  // Передаём функции в глобальную область видимости
  window.validation = {
    activate: activate,
    disable: disable
  };
})();
