'use strict';

(function () {
  // Получаем элементы полноэкранного изображения
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCloseButton = bigPicture.querySelector('.big-picture__cancel');
  var bigPictureTextInput = bigPicture.querySelector('.social__footer-text');
  var pictureListElements = document.querySelector('.pictures');

  // Получаем элементы комментариев
  var commentElements = document.querySelector('.social__comments');
  var commentElement = commentElements.querySelector('.social__comment');
  var loadCommentsButton = document.querySelector('.social__comments-loader');
  var countCommentsField = document.querySelector('.social__comment-count');

  // Количество комментариев
  var commentsQuantity = {
    DEFAULT: 5,
    LOAD: 5
  };

  // Отрисовка полноэкранного изображения
  function initBigPicture(photo) {
    bigPicture.querySelector('img').src = photo.url; // Указываем путь к фото
    bigPicture.querySelector('.likes-count').textContent = photo.likes; // Показываем количество лайков
    bigPicture.querySelector('.comments-count').textContent = photo.comments.length; // Показываем количество комментариев
    bigPicture.querySelector('.social__caption').textContent = photo.description; // Показываем описание к фото

    commentsQuantity.rendered = commentsQuantity.DEFAULT;
    renderComments(photo.comments, commentsQuantity.DEFAULT);
  }

  // Отрисовка комментария
  function renderComments(array, quantity) {
    clearElements(commentElements); // Очищаем ненужные комментарии

    var fragment = document.createDocumentFragment();
    quantity = (quantity > array.length) ? array.length : quantity;

    for (var i = 0; i < quantity; i++) {
      fragment.appendChild(setCommentData(array[i]));
    }

    commentElements.appendChild(fragment); // Вставляем в разметку новые комментарии

    updateCommentsCounter(array.length, quantity);

    if (array.length <= quantity) {
      window.util.hideElement(loadCommentsButton);
    } else {
      window.util.showElement(loadCommentsButton);
    }
  }

  // Удаляем ненужные DOM элементы
  function clearElements(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  // Заполняем комментарии из массива
  function setCommentData(comment) {
    var element = commentElement.cloneNode(true);

    element.querySelector('.social__picture').src = comment.avatar;
    element.querySelector('.social__picture').alt = comment.name;
    element.querySelector('.social__text').textContent = comment.message;

    return element;
  }

  // Обновление счётчика комментариев
  function updateCommentsCounter(length, count) {
    countCommentsField.innerHTML = count + ' из ' + '<span class="comments-count">' + length + '</span>' + ' комментариев';
  }

  // Открыть окно при клике
  function openBigPictureOnClickHandler(evt) {
    var photoNode = evt.target.closest('.picture');
    if (!photoNode) {
      return;
    }

    window.photoData.forEach(function (photo) {
      if (parseInt(photoNode.getAttribute('data-photo'), 10) === photo.id) {
        window.currentPreview = photo;
        initBigPicture(photo);
        bigPictureOpenClickHandler();
      }
    });
  }

  // Загружаем комментарии
  function loadCommentsClickHandler(evt) {
    evt.preventDefault();

    commentsQuantity.rendered += commentsQuantity.LOAD;
    renderComments(window.currentPreview.comments, commentsQuantity.rendered);
  }

  // Закрыть окно при нажатии кнопки Enter
  function closeBigPictureOnKeyDown(evt) {
    window.util.isEnterKey(evt, bigPictureCloseClickHandler);
  }

  // Закрыть окно при нажатии кнопки Esc
  function closeBigPictureOnPressEsc(evt) {
    window.util.isEscKey(evt, bigPictureCloseClickHandler);
  }

  // Обработчик кнопки зарытия полноэкранного изображения
  function bigPictureButtonCloseHandler() {
    bigPictureCloseClickHandler();
  }

  // Обработчик состояния фокуса в поле инпута комментария
  function bigPictureInputFocusHandler() {
    document.removeEventListener('keydown', closeBigPictureOnPressEsc);
  }

  // Обработчик выхода из фокуса поля инпута комментария
  function bigPictureInputBlurHandler() {
    document.addEventListener('keydown', closeBigPictureOnPressEsc);
  }

  // Открыть окно при нажатии кнопки Enter
  function openBigPictureOnKeyDown(evt) {
    if (window.CONSTANTS.KEYCODES.ENTER === evt.keyCode) {
      openBigPictureOnClickHandler(evt);
    }
  }

  // Открывает попап с полноэкранным изображением
  function bigPictureOpenClickHandler() {
    window.util.showElement(bigPicture);
    window.util.hideBodyScroll();

    pictureListElements.removeEventListener('click', openBigPictureOnClickHandler);
    pictureListElements.removeEventListener('keydown', openBigPictureOnKeyDown);

    document.addEventListener('keydown', closeBigPictureOnPressEsc);
    bigPictureCloseButton.addEventListener('click', bigPictureButtonCloseHandler);
    bigPictureCloseButton.addEventListener('keydown', closeBigPictureOnKeyDown);
    bigPictureTextInput.addEventListener('focus', bigPictureInputFocusHandler);
    bigPictureTextInput.addEventListener('blur', bigPictureInputBlurHandler);
    loadCommentsButton.addEventListener('click', loadCommentsClickHandler);
  }

  // Закрывает попап с полноэкранным изображением
  function bigPictureCloseClickHandler() {
    window.util.hideElement(bigPicture);
    window.util.showBodyScroll();

    pictureListElements.addEventListener('keydown', openBigPictureOnKeyDown);
    pictureListElements.addEventListener('click', openBigPictureOnClickHandler);

    document.removeEventListener('keydown', closeBigPictureOnPressEsc);
    bigPictureCloseButton.removeEventListener('click', bigPictureButtonCloseHandler);
    bigPictureCloseButton.removeEventListener('keydown', closeBigPictureOnKeyDown);
    bigPictureTextInput.removeEventListener('focus', bigPictureInputFocusHandler);
    bigPictureTextInput.removeEventListener('blur', bigPictureInputBlurHandler);
    loadCommentsButton.removeEventListener('click', loadCommentsClickHandler);
  }

  // Функция активации полноэкранного режима
  function activate() {
    pictureListElements.addEventListener('keydown', openBigPictureOnKeyDown);
    pictureListElements.addEventListener('click', openBigPictureOnClickHandler);
  }

  // Функция отключения полноэкранного режима
  function disable() {
    pictureListElements.removeEventListener('keydown', openBigPictureOnKeyDown);
    pictureListElements.removeEventListener('click', openBigPictureOnClickHandler);
  }

  // Передаём функции в глобальную область видимости
  window.preview = {
    activate: activate,
    disable: disable
  };
})();
