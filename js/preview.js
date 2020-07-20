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
    default: window.CONSTANTS.PREVIEW.COMMENTS_DEFAULT_AMOUNT,
    load: window.CONSTANTS.PREVIEW.COMMENTS_LOAD_AMOUNT,
    rendered: window.CONSTANTS.PREVIEW.COMMENTS_DEFAULT_AMOUNT
  };

  // Отрисовка полноэкранного изображения
  function initBigPicture(photo) {
    var index = window.photoData.findIndex(function (item) {
      return item.url === photo.querySelector('img').getAttribute('src');
    });

    window.picture = window.photoData[index];

    bigPicture.querySelector('img').src = window.picture.url; // Указываем путь к фото
    bigPicture.querySelector('.likes-count').textContent = window.picture.likes; // Показываем количество лайков
    bigPicture.querySelector('.comments-count').textContent = window.picture.comments.length; // Показываем количество комментариев
    bigPicture.querySelector('.social__caption').textContent = window.picture.description; // Показываем описание к фото

    commentsQuantity.rendered = commentsQuantity.default;
    renderComments(window.picture.comments, commentsQuantity.default);
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
    var target = evt.target;

    while (target.parentNode !== evt.currentTarget) {
      target = target.parentNode;
      if (target.classList.contains('picture')) {
        initBigPicture(target);
        bigPictureOpenClickHandler();
        return;
      }
    }
  }

  // Загружаем комментарии
  function loadCommentsClickHandler(evt) {
    evt.preventDefault();

    commentsQuantity.rendered += commentsQuantity.load;
    renderComments(window.picture.comments, commentsQuantity.rendered);
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
    window.util.isEnterKey(evt, bigPictureOpenClickHandler);
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

  pictureListElements.addEventListener('keydown', openBigPictureOnKeyDown);
  pictureListElements.addEventListener('click', openBigPictureOnClickHandler);
})();
